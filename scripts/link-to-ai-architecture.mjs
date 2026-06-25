// 在相關文章插入指向 /blog/ai-architecture 的語境內鏈（錨文字「AI 架構」），把該頁從第2頁往上推。
// 用法：node scripts/link-to-ai-architecture.mjs [--write]　預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const A = 'https://aiqkangber.com/blog/ai-architecture'
const edits = [
  {
    slug: 'codetools-6',
    find: '油箱空了就跑不動。</p>',
    repl: `油箱空了就跑不動。這種「大腦＋知識＋工具」的組成，正是 <a href="${A}">AI 架構</a> 的核心元件。</p>`,
  },
  {
    slug: 'claude-mcp',
    find: '後面設定就不會卡住。</p>',
    repl: `後面設定就不會卡住。這三層分工，其實就是 <a href="${A}">AI 架構</a>裡「大腦／工具」拆解的具體實作。</p>`,
  },
]

const res = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = res.data.values ?? []

for (const e of edits) {
  const idx = rows.findIndex(r => (r[0] || '').trim() === e.slug)
  if (idx === -1) { console.error(`✗ 找不到 slug=${e.slug}`); continue }
  const body = rows[idx][5] || ''
  const n = body.split(e.find).length - 1
  if (n !== 1) { console.error(`✗ ${e.slug}：錨點出現 ${n} 次（需恰1次），跳過`); continue }
  if (body.includes(`href="${A}"`)) { console.error(`✗ ${e.slug}：已連過 ai-architecture，跳過`); continue }
  const newBody = body.replace(e.find, e.repl)
  const rowNum = idx + 1
  console.log(`✓ ${e.slug}（第 ${rowNum} 列）長度 ${body.length} → ${newBody.length}`)
  if (WRITE) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: `posts!F${rowNum}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[newBody]] },
    })
    console.log(`  已寫入 posts!F${rowNum}`)
  }
}
if (!WRITE) console.log('\n（dry-run）確認無誤後加 --write 才會寫入。')
