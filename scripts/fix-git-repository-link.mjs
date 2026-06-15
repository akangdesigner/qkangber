// One-off: 修 git-repository 文章裡壞掉的延伸閱讀連結。
// /blog/vibe-coding（從不存在，404）→ /blog/ai-coding-downsides，並把錨文字換成真實標題。
// 用法：node scripts/fix-git-repository-link.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const SLUG = 'git-repository'

const REPLACEMENTS = [
  ['https://aiqkangber.com/blog/vibe-coding', 'https://aiqkangber.com/blog/ai-coding-downsides'],
  ['Vibe Coding 是什麼？如何用 AI 大幅優化開發效率', 'AI 寫程式的缺點有哪些？2026 vibe coding 實測，8 個 AI 生成程式碼的致命問題'],
  ['還不熟 vibe coding 的話', '想知道用 AI 寫程式會踩哪些坑的話'],
]

// --- load .env.local ---
const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}

const sheetId = env.GOOGLE_SHEET_ID
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'posts!A:N' })
const rows = data.values ?? []
const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === SLUG)
if (idx === -1) { console.error(`找不到 slug=${SLUG}`); process.exit(1) }

const sheetRow = idx + 1 // 1-based
let content = rows[idx][5] ?? ''

for (const [from, to] of REPLACEMENTS) {
  const count = content.split(from).length - 1
  if (count !== 1) {
    console.error(`✗ 預期出現 1 次，實際 ${count} 次：「${from}」`)
    process.exit(1)
  }
  content = content.split(from).join(to)
  console.log(`✓ 取代（1 處）：${from.slice(0, 40)}… → ${to.slice(0, 40)}…`)
}

const remaining = (content.match(/blog\/vibe-coding/g) ?? []).length
console.log(`\nslug=${SLUG}  sheet row=${sheetRow}`)
console.log(`內文殘留 blog/vibe-coding：${remaining} 處（應為 0）`)

if (!WRITE) { console.log('\n（dry-run）加上 --write 才會寫回 Sheet。'); process.exit(0) }

await sheets.spreadsheets.values.update({
  spreadsheetId: sheetId,
  range: `posts!F${sheetRow}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[content]] },
})
console.log(`\n已更新 posts row ${sheetRow} 內文(F) ✓`)
