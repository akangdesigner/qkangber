// 刪除電子報「工作表1」分頁中指定 slug 的那一列。
// 用法：node scripts/delete-newsletter-row.mjs <slug>
import fs from 'fs'
import { google } from 'googleapis'

const SPREADSHEET_ID = '1VwGs_i7b-kk9HQtd0gBbkS8bFSO8cU7esKSGhEtJVzM'
const TAB = '工作表1'
const slug = process.argv[2]
if (!slug) { console.error('請給 slug'); process.exit(1) }

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })
const sheet = meta.data.sheets.find((s) => s.properties.title === TAB)
if (!sheet) { console.error(`找不到分頁 ${TAB}`); process.exit(1) }
const sheetId = sheet.properties.sheetId

const res = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: `${TAB}!A:A` })
const rows = res.data.values || []
const matches = []
rows.forEach((r, i) => { if ((r[0] || '').trim() === slug) matches.push(i) }) // 0-based row index

if (matches.length === 0) { console.log(`找不到 slug=${slug}，不動作`); process.exit(0) }
if (matches.length > 1) { console.error(`找到多列 (${matches.map((i) => i + 1).join(',')})，為安全起見不刪`); process.exit(1) }

const rowIndex = matches[0]
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: SPREADSHEET_ID,
  requestBody: { requests: [{ deleteDimension: { range: { sheetId, dimension: 'ROWS', startIndex: rowIndex, endIndex: rowIndex + 1 } } }] },
})
console.log(`已刪除第 ${rowIndex + 1} 列（slug=${slug}）`)
