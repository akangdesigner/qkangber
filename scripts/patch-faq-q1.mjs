// 把線上 posts 分頁 21 篇文章的通用模板 Q1 換成切題長尾問句。
// 用法：node scripts/patch-faq-q1.mjs [--write]
//   預設 dry-run，只印比對結果；--write 才回寫 F 欄。
// 新答案不含重點色字，故不需要做紅 → 琥珀轉換；其餘內容原封不動。
import fs from 'fs'
import { google } from 'googleapis'
import { MAP } from './faq-q1-map.mjs'

const WRITE = process.argv.includes('--write')

// 草稿資料夾 → posts 分頁 slug
const SLUG_OF = {
  '02-git-repository': 'git-repository',
  '03-ai-coding-downsides': 'ai-coding-downsides',
  '04-claude-mcp': 'claude-mcp',
  '05-ai-architecture': 'ai-architecture',
  '08-multi-platform-posting': 'multi-platform-posting',
  '09-n8n-auto-report': 'n8n-auto-report',
  '11-engineer-mindset': 'engineer-mindset',
  '12-edm-rfm-segmentation': 'edm-rfm-segmentation',
  '13-competitor-analysis-automation': 'competitor-analysis-automation',
  '14-n8n-zeabur-beginner-guide': 'n8n-zeabur-beginner-guide',
  '16-ai-website-development': 'ai-website-development',
  '17-tool-calling': 'ai-tool-calling',
  '23-n8n-apps-script': 'n8n-apps-script',
  '24-ai-website-deploy': 'ai-website-deploy',
  '25-ai-coding-tools': 'ai-coding-tools',
  '26-claude-code-commands': 'claude-code-commands',
  '27-claude-code-github': 'claude-code-github',
  '28-claude-code-game-dev': 'godot-game-development',
  '29-claude-code-remotion': 'claude-code-remotion',
  '30-vibe-coding': 'vibe-coding',
  '31-nightshade-mercenaries': 'nightshade-mercenaries',
}

const Q1_BLOCK = /<h3>Q1[:：][^<]*<\/h3>\s*<p>[\s\S]*?<\/p>/

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const res = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = res.data.values ?? []
const slugs = rows.map((r) => (r[0] ?? '').trim())

const updates = []
const misses = []
for (const [dir, { q, a }] of Object.entries(MAP)) {
  const slug = SLUG_OF[dir]
  const idx = slugs.indexOf(slug)
  if (idx === -1) { misses.push(`${dir} → slug=${slug}（posts 找不到）`); continue }
  const content = rows[idx][5] ?? ''
  if (!Q1_BLOCK.test(content)) { misses.push(`${dir} → slug=${slug}（內文沒有 Q1 區塊）`); continue }
  const oldQ = content.match(/<h3>Q1[:：]([^<]*)<\/h3>/)[1]
  const next = content.replace(Q1_BLOCK, `<h3>Q1：${q}</h3>\n<p>${a}</p>`)
  updates.push({ slug, range: `posts!F${idx + 1}`, content: next, oldQ })
}

console.log(`可更新 ${updates.length} 篇：`)
for (const u of updates) console.log(`  ${u.range.padEnd(12)} ${u.slug.padEnd(32)} 舊：${u.oldQ}`)
if (misses.length) {
  console.log(`\n對不到 ${misses.length} 篇：`)
  for (const m of misses) console.log(`  ${m}`)
}

if (!WRITE) { console.log('\n(dry-run，要寫入請加 --write)'); process.exit(0) }

await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  requestBody: {
    valueInputOption: 'RAW',
    data: updates.map((u) => ({ range: u.range, values: [[u.content]] })),
  },
})
console.log(`\n已寫入 ${updates.length} 篇`)
