// 在「關鍵字編列」分頁登記 33 篇 claude-code-save-tokens：
//   append 新列：claude code 費用 → claude-code-save-tokens ✅ 已上架
//   長尾吃在同篇 H2/H3：claude code compact、claude code sonnet、claude code opus、
//                        claude code mcp、claude code skills、claude code worktree
//   註：搜尋量還沒驗（填「待驗」），之後補跑 DataForSEO 再回填。
// 用法：node scripts/register-keyword-claude-code-save-tokens.mjs [--write]
import fs from 'fs'
import { google } from 'googleapis'
const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ if(!line||line.startsWith('#'))continue; const i=line.indexOf('='); if(i===-1)continue; env[line.slice(0,i).trim()]=line.slice(i+1).trim() }
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes:['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({version:'v4',auth})
const SID = env.GOOGLE_SHEET_ID, TAB = '關鍵字編列'

const KEYWORD = 'claude code 費用'
const SLUG = 'claude-code-save-tokens'

const res = await sheets.spreadsheets.values.get({ spreadsheetId: SID, range: `${TAB}!A1:H400` })
const rows = res.data.values ?? []
console.log('表頭：', JSON.stringify(rows[0]))
console.log('最後 2 列：')
for (const r of rows.slice(-2)) console.log(' ', JSON.stringify(r))

const dup = rows.findIndex(r => (r[2] || '').trim().toLowerCase() === KEYWORD)
if (dup !== -1) { console.error(`「${KEYWORD}」已在第 ${dup + 1} 列，改用就地更新而非 append`); process.exit(1) }

const lastOrder = Math.max(...rows.slice(1).map(r => parseInt(r[0]) || 0))
const newRow = [String(lastOrder + 1), 'H AI 開發/架構', KEYWORD, '資訊(費用)', `${SLUG} ✅ 已上架`, '待驗', '中', '中']
console.log('\n要 append：', JSON.stringify(newRow))

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: SID, range: `${TAB}!A:H`,
  valueInputOption: 'RAW', insertDataOption: 'INSERT_ROWS',
  requestBody: { values: [newRow] },
})
console.log(`✓ 已登記：${KEYWORD} → ${SLUG} ✅ 已上架（排序 ${lastOrder + 1}）`)
