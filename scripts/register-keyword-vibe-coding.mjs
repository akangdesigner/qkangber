// 在「關鍵字編列」分頁登記 30 篇 vibe-coding（Vibe Coding pillar hub）：
//   append 新列：vibe coding → vibe-coding ✅ 已上架（月搜 33,100 / KD 10，2026-08-01 驗過）
//   長尾吃在同篇 H2/H3：vibe coding 是什麼 4400、教學 1000、工具 590、翻車 260、中文 260、意思 390、範例 320
// 用法：node scripts/register-keyword-vibe-coding.mjs [--write]
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

// 第 45 列原本是「待寫(Pillar)」佔位，且搜尋量寫舊的 50000（實測 33100/KD10）→ 就地更新不 append
const KEYWORD = 'vibe coding'
const idx = rows.findIndex(r => (r[2] || '').trim().toLowerCase() === KEYWORD)
if (idx === -1) { console.error(`找不到「${KEYWORD}」列，請確認分頁內容`); process.exit(1) }
const rowNum = idx + 1
console.log(`\n現況第 ${rowNum} 列：`, JSON.stringify(rows[idx]))

const newRow = [rows[idx][0], 'Pillar（Vibe Coding hub）', KEYWORD, '資訊(定義+教學)', 'vibe-coding ✅ 已上架', '33100(KD10)', '低', '高']
console.log(`更新後：`, JSON.stringify(newRow))

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.update({
  spreadsheetId: SID, range: `${TAB}!A${rowNum}:H${rowNum}`,
  valueInputOption: 'RAW', requestBody: { values: [newRow] },
})
console.log(`✓ 已更新第 ${rowNum} 列：${KEYWORD} → vibe-coding ✅ 已上架`)
