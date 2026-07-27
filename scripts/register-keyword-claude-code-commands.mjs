// 在「關鍵字編列」分頁登記 26 篇 claude-code-commands。
// 用法：node scripts/register-keyword-claude-code-commands.mjs [--write]
//   dry-run 會先印表頭、最後 5 列與接續排序號，確認欄位後再 --write append。
import fs from 'fs'
import { google } from 'googleapis'
const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ if(!line||line.startsWith('#'))continue; const i=line.indexOf('='); if(i===-1)continue; env[line.slice(0,i).trim()]=line.slice(i+1).trim() }
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes:['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({version:'v4',auth})
const SID = env.GOOGLE_SHEET_ID, TAB = '關鍵字編列'

const res = await sheets.spreadsheets.values.get({ spreadsheetId: SID, range: `${TAB}!A1:H400` })
const rows = res.data.values ?? []
console.log('表頭：', JSON.stringify(rows[0]))
console.log('第 50 列起：')
for (const r of rows.slice(49)) console.log(' ', JSON.stringify(r))

// 撞字檢查
const dup = rows.findIndex(r => (r[2] || '').trim().toLowerCase().includes('claude code'))
if (dup !== -1) console.log(`⚠ 已有含 claude code 的列（第 ${dup + 1} 列）：${JSON.stringify(rows[dup])}`)

const lastNum = Math.max(...rows.slice(1).map(r => parseInt(r[0], 10)).filter(Number.isFinite))
const next = lastNum + 1
const newRow = [String(next), 'H AI 開發/架構', 'claude code 指令', '資訊(教學)', 'claude-code-commands ✅ 已上架', '待驗', '中', '中']
console.log(`\n接續排序=${next}，準備 append：`, JSON.stringify(newRow))
if (!WRITE) { console.log('\n（dry-run）欄位對得上再加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: SID, range: `${TAB}!A:H`, valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS', requestBody: { values: [newRow] },
})
console.log(`✓ 已登記第 ${next} 列：claude code 指令 → claude-code-commands`)
