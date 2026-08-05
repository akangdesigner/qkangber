// 在「關鍵字編列」分頁登記 32 篇 claude-code-tips：
//   append 新列：claude code 怎麼用 → claude-code-tips ✅ 已上架（月搜 390 / KD 5，2026-08-05 DataForSEO 驗過）
//   長尾吃在同篇 H2/H3：claude code 使用技巧 170、claude code 技巧 70、claude code 設定 70、
//                        claude code hooks 390、claude code 模式 20、claude code plan 模式 50
//   註：破千頭部字都被佔或不對題（claude code 教學 5400 給 claude-code-github、
//       claude code 指令 給 claude-code-commands、費用/安裝/下載/skills 不合本篇）
// 用法：node scripts/register-keyword-claude-code-tips.mjs [--write]
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

// 這個字第 7 列（排序 6）早就存在，但當時沒有主場文章、掛在 claude-design／claude-code-github 底下，
// 搜尋量欄還是沒驗過的「中」。本篇才是這個字的主場 → 就地更新不 append。
const KEYWORD = 'claude code 怎麼用'
const idx = rows.findIndex(r => (r[2] || '').trim().toLowerCase() === KEYWORD)
if (idx === -1) { console.error(`找不到「${KEYWORD}」列，請確認分頁內容`); process.exit(1) }
const rowNum = idx + 1
console.log(`\n現況第 ${rowNum} 列：`, JSON.stringify(rows[idx]))

const newRow = [rows[idx][0], rows[idx][1], rows[idx][2], '資訊(使用技巧)', 'claude-code-tips ✅ 已上架（主）／claude-design ✅', '390(KD5)', '低', '中']
console.log(`更新後：`, JSON.stringify(newRow))

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.update({
  spreadsheetId: SID, range: `${TAB}!A${rowNum}:H${rowNum}`,
  valueInputOption: 'RAW', requestBody: { values: [newRow] },
})
console.log(`✓ 已更新第 ${rowNum} 列：${KEYWORD} → claude-code-tips ✅ 已上架`)
