// ⛔ 已作廢（2026-07-04 稽核）：此腳本會用 values.update 從 A2:L7「覆蓋」寫入
// 電子報 master 表的「競品監控」分頁——該分頁現在是 n8n 工作流 9JxN0cBbdTJgyeB3
// 的真實寫入目的地，誤跑會蓋掉真實監控資料。示範資料一律改建在「示範用」表。
console.error('此腳本已作廢：會覆蓋 master 表的真實競品監控資料。示範資料請建在「示範用」表（1q1GR6...）。')
process.exit(1)

// 在「競品監控」分頁補幾筆擬真示範資料（給文章截圖用，非真實監控結果）。
// 用法：node scripts/seed-competitor-monitor-rows.mjs
import fs from 'fs'
import { google } from 'googleapis'

const SPREADSHEET_ID = '1VwGs_i7b-kk9HQtd0gBbkS8bFSO8cU7esKSGhEtJVzM'
const TAB = '競品監控'
// 欄位順序：日期｜來源｜關鍵字｜競品｜主題｜情緒｜相關度｜作者/標題｜連結｜摘要｜互動數｜狀態
const ROWS = [
  ['2026-06-23', 'Threads', 'Zapier', 'Zapier', '抱怨任務數方案太貴', '負面', '9', '@auto_maker', 'https://www.threads.net/@auto_maker/post/abc123', '嫌 Zapier 超量收費，想找替代方案', '142', '待覆核'],
  ['2026-06-23', 'Threads', 'Make', 'Make', '分享用 Make 串 Notion 自動化', '正面', '8', '@notion_diary', 'https://www.threads.net/@notion_diary/post/def456', '誇 Make 視覺化拉一拉就會動', '88', '待覆核'],
  ['2026-06-23', 'Threads', 'Zapier', 'Zapier', '問 Zapier 跟自架方案怎麼選', '中性', '8', '@maker_jane', 'https://www.threads.net/@maker_jane/post/jkl012', '在比較 Zapier 月費與自己架', '67', '待覆核'],
  ['2026-06-22', 'Threads', '自動化', '產業話題', '中小企業想導入自動化', '中性', '7', '@smbiz_tw', 'https://www.threads.net/@smbiz_tw/post/ghi789', '問有沒有便宜好上手的自動化工具', '45', '待覆核'],
  ['2026-06-22', '新聞', 'Make', 'Make', 'Make 推出新 AI 功能', '正面', '7', '科技媒體：Make 發表 AI 助手', 'https://example-news.com/make-ai-assistant', 'Make 新增 AI 自動化生成功能', '', '待覆核'],
  ['2026-06-21', 'Threads', 'claude code', '產業話題', '在聊用 AI 寫工作流', '正面', '6', '@dev_tom', 'https://www.threads.net/@dev_tom/post/mno345', '分享 vibe coding 串自動化的心得', '53', '待覆核'],
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

// 從第 2 列開始覆寫（蓋掉建分頁時放的佔位範例列）
await sheets.spreadsheets.values.update({
  spreadsheetId: SPREADSHEET_ID,
  range: `${TAB}!A2:L${1 + ROWS.length}`,
  valueInputOption: 'RAW',
  requestBody: { values: ROWS },
})
console.log(`已寫入 ${ROWS.length} 筆示範資料到「${TAB}」分頁`)
