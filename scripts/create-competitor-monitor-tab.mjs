// ⚠ 一次性腳本，任務已完成（分頁已建立），不需要再跑。
// 在電子報 master 試算表建立「競品監控」分頁（n8n 競品輿情監控工作流 9JxN0cBbdTJgyeB3 寫入的目的地）。
// 用法：node scripts/create-competitor-monitor-tab.mjs
import fs from 'fs'
import { google } from 'googleapis'

const SPREADSHEET_ID = '1VwGs_i7b-kk9HQtd0gBbkS8bFSO8cU7esKSGhEtJVzM'
const TAB = '競品監控'
const HEADERS = ['日期', '來源', '關鍵字', '競品', '主題', '情緒', '相關度', '作者/標題', '連結', '摘要', '互動數', '狀態']
// 一列範例，避免空表讓 n8n Google Sheets 讀不到表頭
const SAMPLE = [
  new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
  '範例', 'Zapier', 'Zapier', '這是一列範例資料', '中性', '0', '範例標題',
  'https://example.com', '此列僅為避免空表，可刪', '0', '略過',
]

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
const exists = meta.data.sheets.some((s) => s.properties.title === TAB)
if (exists) {
  console.log(`「${TAB}」分頁已存在，跳過`)
  process.exit(0)
}
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: SPREADSHEET_ID,
  requestBody: { requests: [{ addSheet: { properties: { title: TAB } } }] },
})
await sheets.spreadsheets.values.update({
  spreadsheetId: SPREADSHEET_ID,
  range: `${TAB}!A1:L2`,
  valueInputOption: 'RAW',
  requestBody: { values: [HEADERS, SAMPLE] },
})
console.log(`已建立「${TAB}」分頁，表頭：${HEADERS.join(' | ')}`)
