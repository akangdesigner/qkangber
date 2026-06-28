// 內鏈圖譜總體檢：撈 posts 全部已發布文章，解析內文所有 <a>，建出連結關係。
// 用法：node scripts/audit-internal-links.mjs
// 認證沿用 .env.local 的 GOOGLE_SERVICE_ACCOUNT_JSON + GOOGLE_SHEET_ID（唯讀）。
import fs from 'fs'
import { google } from 'googleapis'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] })
const sheets = google.sheets({ version: 'v4', auth })

const res = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = (res.data.values ?? []).slice(1)

const posts = rows
  .map((r) => ({
    slug: (r[0] ?? '').trim(),
    title: r[1] ?? '',
    date: r[2] ?? '',
    content: r[5] ?? '',
    category: (r[12] ?? '').trim(),
    published: (r[7] ?? '').toLowerCase() === 'true',
  }))
  .filter((p) => p.published && p.slug)

const slugSet = new Set(posts.map((p) => p.slug))
const STRIP = (s) => s.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
const BAD_ANCHORS = ['這裡', '點此', '點這', '看這', '連結', 'here', 'click', '按這', '詳見', '參考']

// link extraction
const ahref = /<a\s+[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi
const outbound = new Map() // slug -> [{to, anchor, raw}]
const inboundBlog = new Map() // targetSlug -> [{from, anchor}]
const emptyLinks = [] // {slug, anchor}
const badAnchorLinks = [] // {slug, to, anchor}
const externalOut = new Map() // slug -> Set(host)

for (const s of slugSet) inboundBlog.set(s, [])

for (const p of posts) {
  const outs = []
  let m
  ahref.lastIndex = 0
  while ((m = ahref.exec(p.content))) {
    const href = m[1].trim()
    const anchor = STRIP(m[2])
    if (!href || href === '#') { emptyLinks.push({ slug: p.slug, anchor }); continue }
    // classify
    const blogMatch = href.match(/(?:https?:\/\/aiqkangber\.com)?\/blog\/([a-z0-9\-]+)/i)
    if (blogMatch) {
      const to = blogMatch[1]
      outs.push({ to, anchor, kind: 'blog' })
      if (slugSet.has(to)) inboundBlog.get(to).push({ from: p.slug, anchor })
      if (!anchor || BAD_ANCHORS.some((b) => anchor.toLowerCase() === b.toLowerCase())) badAnchorLinks.push({ slug: p.slug, to, anchor })
      continue
    }
    if (/^https?:\/\//i.test(href)) {
      const host = href.replace(/^https?:\/\//i, '').split('/')[0]
      if (!externalOut.has(p.slug)) externalOut.set(p.slug, new Map())
      externalOut.get(p.slug).set(host, (externalOut.get(p.slug).get(host) || 0) + 1)
      outs.push({ to: href, anchor, kind: host.includes('aiqkangber') ? 'self-other' : 'external' })
    } else if (href.startsWith('/')) {
      outs.push({ to: href, anchor, kind: 'internal-page' })
    }
  }
  outbound.set(p.slug, outs)
}

console.log(`\n========== 內鏈圖譜總體檢 ==========`)
console.log(`已發布文章：${posts.length} 篇\n`)

// 入鏈排行
const ranked = posts
  .map((p) => ({ slug: p.slug, cat: p.category, in: inboundBlog.get(p.slug).length, out: outbound.get(p.slug).filter((o) => o.kind === 'blog' && slugSet.has(o.to)).length }))
  .sort((a, b) => b.in - a.in)

console.log('── 每篇 blog↔blog 內鏈（in=被幾篇連入 / out=連出到幾篇）──')
const pad = (s, n) => String(s).padEnd(n)
for (const r of ranked) console.log(pad(r.slug, 40), `in ${pad(r.in, 3)} out ${pad(r.out, 3)} ${r.cat}`)

// 孤兒頁
const orphans = ranked.filter((r) => r.in === 0)
console.log(`\n── 🔴 孤兒頁（0 篇文章連入，${orphans.length} 篇）──`)
for (const o of orphans) console.log('  ', pad(o.slug, 40), o.cat)

// 死巷頁（不連出任何 blog）
const deadends = ranked.filter((r) => r.out === 0)
console.log(`\n── 🟡 死巷頁（內文沒連出任何其他 blog，${deadends.length} 篇）──`)
for (const d of deadends) console.log('  ', pad(d.slug, 40), d.cat)

// 空連結 / 爛錨
console.log(`\n── ⚠ 空連結 href="#" 或空（${emptyLinks.length}）──`)
for (const e of emptyLinks) console.log('  ', pad(e.slug, 40), `錨「${e.anchor}」`)
console.log(`\n── ⚠ 爛錨文字 / 指向不存在 slug（${badAnchorLinks.length}）──`)
for (const b of badAnchorLinks) {
  const dead = slugSet.has(b.to) ? '' : ' ← ⛔目標slug不存在'
  console.log('  ', pad(b.slug, 36), `→ ${pad(b.to, 32)} 錨「${b.anchor}」${dead}`)
}

// 指向不存在 slug 的所有 blog 連結（斷鏈）
const brokenBlog = []
for (const p of posts) for (const o of outbound.get(p.slug)) if (o.kind === 'blog' && !slugSet.has(o.to)) brokenBlog.push({ from: p.slug, to: o.to, anchor: o.anchor })
console.log(`\n── ⛔ 斷鏈：指向未發布/不存在的 blog slug（${brokenBlog.length}）──`)
for (const b of brokenBlog) console.log('  ', pad(b.from, 36), `→ ${pad(b.to, 32)} 錨「${b.anchor}」`)

// 分類叢集
console.log(`\n── 分類叢集（同類互鏈密度）──`)
const byCat = {}
for (const p of posts) (byCat[p.category || '(未分類)'] ??= []).push(p.slug)
for (const [cat, list] of Object.entries(byCat)) {
  let intra = 0
  for (const s of list) for (const o of outbound.get(s)) if (o.kind === 'blog' && list.includes(o.to)) intra++
  console.log('  ', pad(cat, 16), `${list.length} 篇，同類互鏈 ${intra} 條`)
}

// aicommand 交叉連結
console.log(`\n── aicommand 姊妹站交叉連結 ──`)
let aicmd = 0
for (const p of posts) for (const o of outbound.get(p.slug)) if (o.kind === 'external' && /aicommand/.test(o.to)) { aicmd++; }
console.log(`   全站指向 aicommand 的連結：${aicmd} 條`)

// 全文 dump 給後續分析
fs.writeFileSync(
  'C:/Users/asdto/AppData/Local/Temp/claude/D--qkangber/201ae812-355b-40c5-9fc2-346416962860/scratchpad/link-graph.json',
  JSON.stringify({ posts: posts.map((p) => ({ slug: p.slug, title: p.title, category: p.category, date: p.date })), edges: [...outbound.entries()].map(([from, outs]) => ({ from, outs })) }, null, 2),
  'utf8',
)
console.log('\n圖譜 JSON 已存 scratchpad/link-graph.json')
