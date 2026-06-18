// 在「寄信」媒體登記範例 sheet 寫入 schema＋範例列（給新聞稿群發 workflow 讀取/篩選示範）
// 用法：node scripts/seed-media-sheet.mjs
import fs from 'fs'
import { google } from 'googleapis'

const SPREADSHEET_ID = '1q1GR6bPmZi7sMx8HGtZhHjimwoWbnV9wVHAmfhqY40s'
const TAB = '寄信'

// 欄位：媒體名稱 | 種類 | 聯絡人 | Email | 稱呼 | 拒收（拒收欄留空＝會寄，填「拒收」＝跳過）
const rows = [
  ['媒體名稱', '種類', '聯絡人', 'Email', '稱呼', '拒收'],
  ['科技新報 TechNews', '科技線', '林記者', 'tech-reporter@example.com', '林記者', ''],
  ['數位時代', '科技線', '陳編輯', 'digital-age@example.com', '陳編輯', ''],
  ['iThome', '科技線', '黃記者', 'ithome-news@example.com', '黃記者', ''],
  ['經濟日報', '財經線', '王記者', 'money-daily@example.com', '王記者', ''],
  ['食尚玩家', '生活線', '李主編', 'lifestyle-mag@example.com', '李主編', ''],
  ['早安健康', '生活線', '周記者', 'health-news@example.com', '周記者', '拒收'],
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

try {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  })
  console.log(`已寫入「${TAB}」分頁 ${rows.length} 列（含表頭）`)
} catch (e) {
  console.error('寫入失敗：', e.message)
  console.error('服務帳號 email：', credentials.client_email)
  console.error('→ 若是權限錯誤，請把這個 sheet 分享給上面那個服務帳號（編輯者），或自行照 schema 貼上。')
  process.exit(1)
}
