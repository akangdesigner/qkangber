// 新增一列到「日記本」分頁：AI Agent 記憶重構 Threads 草稿
// 用法：node scripts/_tmp-diary-agent-memory.mjs [--write]
import fs from 'fs'
import { google } from 'googleapis'
const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ if(!line||line.startsWith('#'))continue; const i=line.indexOf('='); if(i===-1)continue; env[line.slice(0,i).trim()]=line.slice(i+1).trim() }
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes:['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({version:'v4',auth})
const SID = env.GOOGLE_SHEET_ID, TAB = '日記本'

const POST = `上週講座有同學問我：為什麼幫 AI 加了記憶，反而變笨？

Claude 的記憶就是把 CLAUDE.md、知識庫檔案再塞回去讀一次。上個專案對的規則，換到這個專案就是錯的，它會照抄。有研究測過，把舊經驗直接倒回去的那組，成績只剩 52%。

所以知識庫不要只加不刪。開新專案前先看一遍：過期的規則刪掉、用得到的改寫成這個專案的講法，再動手。同一個模型這樣做，成績從 52% 跳到 85%。

記憶要挑過再用，不是存越多越好。`

const newRow = ['2026-08-05', POST, '草稿', '']

const res = await sheets.spreadsheets.values.get({ spreadsheetId: SID, range: `${TAB}!A1:D200` })
const rows = res.data.values ?? []
console.log(`現有 ${rows.length} 列，最後一列日期：`, rows[rows.length-1]?.[0])
console.log('\n準備 append：\n' + POST)

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: SID, range: `${TAB}!A:D`, valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS',
  requestBody: { values: [newRow] },
})
console.log('✓ 已新增一列')
