// 在「關鍵字編列」分頁登記 34 篇 google-apps-script-syntax：
//   append 新列：google apps script 語法 → google-apps-script-syntax ✅ 已上架
//   長尾吃在同篇 H2/H3：apps script javascript、SpreadsheetApp、getValues setValues、
//                        apps script 錯誤訊息、apps script 執行時間上限
//   註：搜尋量還沒驗（填「待驗」），之後補跑 DataForSEO 再回填。
// 用法：node scripts/register-keyword-google-apps-script-syntax.mjs [--write]
import fs from 'fs'
import { google } from 'googleapis'
const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ if(!line||line.startsWith('#'))continue; const i=line.indexOf('='); if(i===-1)continue; env[line.slice(0,i).trim()]=line.slice(i+1).trim() }
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes:['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({version:'v4',auth})
const SID = env.GOOGLE_SHEET_ID, TAB = '關鍵字編列'

const KEYWORD = 'google apps script 語法'
const SLUG = 'google-apps-script-syntax'

const res = await sheets.spreadsheets.values.get({ spreadsheetId: SID, range: `${TAB}!A1:H400` })
const rows = res.data.values ?? []
console.log('表頭：', JSON.stringify(rows[0]))

// 沿用姊妹篇 google apps script 那列的集群標籤，維持同一群
const sib = rows.find(r => (r[2] || '').trim().toLowerCase() === 'google apps script')
if (!sib) { console.error('找不到姊妹篇「google apps script」那列，無法沿用集群標籤'); process.exit(1) }
const CLUSTER = sib[1]
const INTENT = sib[3]
console.log('姊妹篇那列：', JSON.stringify(sib))
console.log('最後 2 列：')
for (const r of rows.slice(-2)) console.log(' ', JSON.stringify(r))

const dup = rows.findIndex(r => (r[2] || '').trim().toLowerCase() === KEYWORD)
if (dup !== -1) { console.error(`「${KEYWORD}」已在第 ${dup + 1} 列，改用就地更新而非 append`); process.exit(1) }

const lastOrder = Math.max(...rows.slice(1).map(r => parseInt(r[0]) || 0))
const newRow = [String(lastOrder + 1), CLUSTER, KEYWORD, INTENT, `${SLUG} ✅ 已上架`, '待驗', '中', '中']
console.log('\n要 append：', JSON.stringify(newRow))

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: SID, range: `${TAB}!A:H`,
  valueInputOption: 'RAW', insertDataOption: 'INSERT_ROWS',
  requestBody: { values: [newRow] },
})
console.log(`✓ 已登記：${KEYWORD} → ${SLUG} ✅ 已上架（排序 ${lastOrder + 1}）`)
