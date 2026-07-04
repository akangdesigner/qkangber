// 在「示範用」表建 GETLINK示範 分頁：A 欄寫入「超連結文字」（rich text link，模擬客戶登記表），
// B 欄放 =GETLINK("A2") 公式（貼上 Apps Script 後生效，之前顯示 #NAME? 是正常的）。
// 用法：node scripts/seed-getlink-demo.mjs
import fs from 'fs'
import { google } from 'googleapis'

const SPREADSHEET_ID = '1q1GR6bPmZi7sMx8HGtZhHjimwoWbnV9wVHAmfhqY40s'
const TAB = 'GETLINK示範'

// 示範資料：自家已發布文章（標題＋真實網址）
const posts = [
  ['n8n 從 0 到 40 分入門攻略：Zeabur 雲端部署 x 8 大基本節點全解析', 'https://aiqkangber.com/blog/n8n-zeabur-beginner-guide'],
  ['AI Agent 的記憶是怎麼運作的？', 'https://aiqkangber.com/blog/ai-agent-memory'],
  ['Tool Calling 是什麼？看懂 AI 動手做事的機制', 'https://aiqkangber.com/blog/ai-tool-calling'],
  ['每週數據報表自動化：GSC + GA4 自動寫進試算表', 'https://aiqkangber.com/blog/n8n-auto-report'],
  ['競品輿情監控自動化：新聞＋社群一週一報', 'https://aiqkangber.com/blog/competitor-analysis-automation'],
  ['EDM 沒人開？用 RFM 分群把對的信寄給對的人', 'https://aiqkangber.com/blog/edm-rfm-segmentation'],
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

// 1) 若分頁不存在就新增
const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })
let sheet = meta.data.sheets.find(s => s.properties.title === TAB)
if (!sheet) {
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests: [{ addSheet: { properties: { title: TAB, gridProperties: { rowCount: 30, columnCount: 6 } } } }] },
  })
  sheet = res.data.replies[0].addSheet
  console.log(`已新增分頁「${TAB}」`)
}
const sheetId = sheet.properties.sheetId

// 2) 表頭＋A 欄 rich text 超連結＋B 欄 GETLINK 公式
const rows = [
  {
    values: [
      { userEnteredValue: { stringValue: '文章標題（超連結文字）' }, userEnteredFormat: { textFormat: { bold: true } } },
      { userEnteredValue: { stringValue: '純網址（GETLINK 結果）' }, userEnteredFormat: { textFormat: { bold: true } } },
    ],
  },
  ...posts.map(([title, url], i) => ({
    values: [
      {
        userEnteredValue: { stringValue: title },
        textFormatRuns: [{ startIndex: 0, format: { link: { uri: url } } }],
      },
      { userEnteredValue: { formulaValue: `=GETLINK("A${i + 2}")` } },
    ],
  })),
]

await sheets.spreadsheets.batchUpdate({
  spreadsheetId: SPREADSHEET_ID,
  requestBody: {
    requests: [
      {
        updateCells: {
          start: { sheetId, rowIndex: 0, columnIndex: 0 },
          rows,
          fields: 'userEnteredValue,userEnteredFormat.textFormat,textFormatRuns',
        },
      },
      { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 420 }, fields: 'pixelSize' } },
      { updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 430 }, fields: 'pixelSize' } },
    ],
  },
})
console.log(`已寫入 ${posts.length} 列示範資料（A 欄超連結文字＋B 欄 GETLINK 公式）`)
console.log(`分頁網址：https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${sheetId}`)
