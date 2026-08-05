// 在「關鍵字編列」分頁登記 28 篇 godot-game-development：
//   append 新列：godot → godot-game-development ✅ 已上架（月搜 6,600 / KD 23，2026-07-27 驗過）
// 用法：node scripts/register-keyword-godot-game-development.mjs [--write]
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
console.log('最後 3 列：')
for (const r of rows.slice(-3)) console.log(' ', JSON.stringify(r))

const KEYWORD = 'godot'
const dup = rows.findIndex(r => (r[2] || '').trim().toLowerCase() === KEYWORD)
if (dup !== -1) { console.error(`⚠ 已有「${KEYWORD}」（第 ${dup + 1} 列），停止`); process.exit(1) }

const lastNum = Math.max(...rows.slice(1).map(r => parseInt(r[0], 10)).filter(Number.isFinite))
const next = lastNum + 1
const newRow = [String(next), 'H AI 開發/架構', KEYWORD, '資訊(教學)', 'godot-game-development ✅ 已上架', '6600', '中', '中']
console.log(`\n接續排序=${next}，準備 append：`, JSON.stringify(newRow))

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: SID, range: `${TAB}!A:H`, valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS', requestBody: { values: [newRow] },
})
console.log(`✓ 已登記第 ${next} 列：${KEYWORD} → godot-game-development`)
