// 在「關鍵字編列」分頁登記 27 篇 claude-code-github：
//   ① append 新列：claude code 教學 → claude-code-github ✅ 已上架
//   ② 更新第 6 列「Claude Code 怎麼用」E 欄：claude-design ✅ / 待強化 → 補 claude-code-github ✅
// 用法：node scripts/register-keyword-claude-code-github.mjs [--write]
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
console.log('最後 3 列：')
for (const r of rows.slice(-3)) console.log(' ', JSON.stringify(r))

// 撞字檢查
const dup = rows.findIndex(r => (r[2] || '').trim().toLowerCase() === 'claude code 教學')
if (dup !== -1) { console.error(`⚠ 已有「claude code 教學」（第 ${dup + 1} 列），停止`); process.exit(1) }

const lastNum = Math.max(...rows.slice(1).map(r => parseInt(r[0], 10)).filter(Number.isFinite))
const next = lastNum + 1
const newRow = [String(next), 'H AI 開發/架構', 'claude code 教學', '資訊(教學)', 'claude-code-github ✅ 已上架', '待驗', '中', '中']
console.log(`\n接續排序=${next}，準備 append：`, JSON.stringify(newRow))

// 第 6 列補強
const idx6 = rows.findIndex(r => (r[2] || '').trim() === 'Claude Code 怎麼用')
if (idx6 !== -1) {
  console.log(`第 ${idx6 + 1} 列「Claude Code 怎麼用」E 欄：「${rows[idx6][4] ?? ''}」→「claude-design ✅／claude-code-github ✅」`)
} else {
  console.log('⚠ 找不到「Claude Code 怎麼用」列，略過補強')
}

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: SID, range: `${TAB}!A:H`, valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS', requestBody: { values: [newRow] },
})
console.log(`✓ 已登記第 ${next} 列：claude code 教學 → claude-code-github`)

if (idx6 !== -1) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `${TAB}!E${idx6 + 1}`, valueInputOption: 'RAW',
    requestBody: { values: [['claude-design ✅／claude-code-github ✅']] },
  })
  console.log(`✓ 第 ${idx6 + 1} 列「Claude Code 怎麼用」已補 claude-code-github`)
}
