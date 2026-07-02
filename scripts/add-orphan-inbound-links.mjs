// One-off: 孤兒頁內鏈救援——ig-data-tracking / html-cleaner-tool / internal-tools-nextjs
// （前兩者原 codetools 改名後有排名但站內 0 連入；順便解 internal-tools 與 html-cleaner 的死巷）
// 用法：node scripts/add-orphan-inbound-links.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const IG_LINK =
  '<p>📖 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/ig-data-tracking">IG 數據怎麼追蹤？用 n8n + Google Sheets 做一份免費社群數據報告</a></p>'
const HTML_CLEANER_LINK =
  '<p>📖 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/html-cleaner-tool">文章貼上格式就跑掉？我用 Next.js 做了一個 HTML 清洗工具</a></p>'
const INTERNAL_TOOLS_LINK =
  '<p>📖 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/internal-tools-nextjs">工程師該自己做內部工具嗎？我用 Next.js 打造一套自用後台的實錄</a></p>'
const PILLAR_LINE = '<p>👉 <a href="https://aiqkangber.com/blog/n8n-marketing-applications">'
const CLAUDE_DESIGN_LINE = '<p>👉 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/claude-design">'

const EDITS = [
  {
    slug: 'n8n-auto-report',
    find: PILLAR_LINE,
    replace: IG_LINK + '\n' + PILLAR_LINE,
    note: '結尾 pillar 前插入 ig-data-tracking 延伸閱讀',
  },
  {
    slug: 'competitor-analysis-automation',
    find: PILLAR_LINE,
    replace: IG_LINK + '\n' + PILLAR_LINE,
    note: '結尾 pillar 前插入 ig-data-tracking 延伸閱讀',
  },
  {
    slug: 'internal-tools-nextjs',
    find: '</body>',
    replace: '\n' + HTML_CLEANER_LINK + '\n</body>',
    note: '結尾插入 html-cleaner-tool 延伸閱讀（同時解死巷）',
  },
  {
    slug: 'html-cleaner-tool',
    find: '</body>',
    replace: '\n' + INTERNAL_TOOLS_LINK + '\n</body>',
    note: '結尾插入 internal-tools-nextjs 延伸閱讀（同時解死巷）',
  },
  {
    slug: 'ai-website-development',
    find: CLAUDE_DESIGN_LINE,
    replace: INTERNAL_TOOLS_LINK + '\n' + CLAUDE_DESIGN_LINE,
    note: '延伸閱讀區插入 internal-tools-nextjs',
  },
]

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const sheets = google.sheets({ version: 'v4', auth })
const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:F' })
const rows = data.values ?? []

for (const e of EDITS) {
  const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === e.slug)
  if (idx === -1) { console.error(`✗ ${e.slug}：找不到列，略過`); continue }
  const content = rows[idx][5] ?? ''
  const hits = content.split(e.find).length - 1
  console.log(`\n${e.slug}（row ${idx + 1}）：${e.note}`)
  if (hits !== 1) { console.error(`  ✗ 錨點出現 ${hits} 次（需恰好 1 次），跳過`); continue }
  console.log('  ✓ 錨點唯一命中')

  if (!WRITE) continue

  const next = content.replace(e.find, e.replace).replace(/#c0392b/gi, '#fbbf24')
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: `posts!F${idx + 1}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[next]] },
  })
  console.log('  ✓ 已寫回')
}

if (!WRITE) console.log('\n（dry-run）加上 --write 才會寫回 Sheet。')
