// 在電子報試算表建立「回饋」分頁（電子報互動按鈕的點擊記錄）。
// 用法：node scripts/create-feedback-tab.mjs
import fs from 'fs'
import { google } from 'googleapis'

// n8n 電子報工作流寫入的那份試算表
const SPREADSHEET_ID = '1VwGs_i7b-kk9HQtd0gBbkS8bFSO8cU7esKSGhEtJVzM'
const TAB = '回饋'
const HEADERS = ['時間', 'slug', '編號', '標題', '評價']

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
  range: `${TAB}!A1:E1`,
  valueInputOption: 'RAW',
  requestBody: { values: [HEADERS] },
})
console.log(`已建立「${TAB}」分頁，表頭：${HEADERS.join(' | ')}`)
