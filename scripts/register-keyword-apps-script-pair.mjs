// 在「關鍵字編列」分頁登記 22/23 兩篇：
//   第 53 列 google apps script（待寫 → google-apps-script ✅ 已上架）
//   第 13 列 n8n webhook 串接（待寫 → n8n-apps-script ✅ 已上架，長尾吃在該篇 H2）
// 用法：node scripts/register-keyword-apps-script-pair.mjs [--write]
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

// 依關鍵字找列（不寫死列號，防表被重排）
const targets = [
  { kw: 'google apps script', article: 'google-apps-script ✅ 已上架', volume: '高(8100)' },
  { kw: 'n8n webhook 串接', article: 'n8n-apps-script ✅ 已上架(長尾)', volume: null },
]

for (const t of targets) {
  const idx = rows.findIndex(r => (r[2] || '').trim().toLowerCase() === t.kw)
  if (idx === -1) { console.log(`⚠ 找不到「${t.kw}」，略過`); continue }
  const rowNum = idx + 1
  const cur = rows[idx]
  console.log(`第 ${rowNum} 列「${t.kw}」：E 欄「${cur[4] ?? ''}」→「${t.article}」${t.volume ? `｜F 欄「${cur[5] ?? ''}」→「${t.volume}」` : ''}`)
  if (!WRITE) continue
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `${TAB}!E${rowNum}`, valueInputOption: 'RAW',
    requestBody: { values: [[t.article]] },
  })
  if (t.volume) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SID, range: `${TAB}!F${rowNum}`, valueInputOption: 'RAW',
      requestBody: { values: [[t.volume]] },
    })
  }
  console.log(`  ✓ 已更新`)
}
if (!WRITE) console.log('\n（dry-run）確認無誤後加 --write 才會寫入。')
