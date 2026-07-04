// 修 claude-mcp 內文兩條指向舊 codetools slug 的斷鏈，改直連現行 slug 並校正錨文字。
// 用法：node scripts/fix-claude-mcp-broken-links.mjs [--write]　預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const REPLACE = [
  {
    from: '<a href="https://aiqkangber.com/blog/codetools-4">n8n 自動產生 SEO 推薦文：51 個節點打造競品分析＋自動寫稿｜開發工具箱 4</a>',
    to: '<a href="https://aiqkangber.com/blog/socailmedia">n8n + Apify 社群監控：一次追蹤 5 個平台的競品動態</a>',
  },
  {
    from: '<a href="https://aiqkangber.com/blog/codetools">Next.js 內部工具開發實錄：工程師為什麼該自己做工具箱｜開發工具箱 1</a>',
    to: '<a href="https://aiqkangber.com/blog/claude-design">Claude 產出的網頁太 AI 味？Claude Design 協同設計讓 UI/UX 質感飛躍</a>',
  },
]

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON), scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })
const res = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = res.data.values ?? []
const idx = rows.findIndex((r) => (r[0] ?? '').trim() === 'claude-mcp')
if (idx === -1) { console.log('✗ 找不到 claude-mcp'); process.exit(1) }

let c = rows[idx][5] ?? ''
for (const r of REPLACE) {
  if (!c.includes(r.from)) { console.log('⚠ 找不到（可能已修過）：', r.from.slice(0, 60), '...'); continue }
  c = c.replace(r.from, r.to)
  console.log('\n修正：')
  console.log('  ✗', r.from)
  console.log('  ✓', r.to)
}

if (c === (rows[idx][5] ?? '')) { console.log('\n沒有變更。'); process.exit(0) }
console.log(`\nclaude-mcp 位於第 ${idx + 1} 列。`)
if (!WRITE) { console.log('（dry-run）確認後加 --write。'); process.exit(0) }
await sheets.spreadsheets.values.update({ spreadsheetId: env.GOOGLE_SHEET_ID, range: `posts!F${idx + 1}`, valueInputOption: 'RAW', requestBody: { values: [[c]] } })
console.log('✓ 已寫回。')
