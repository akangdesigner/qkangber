// One-off: 把 posts 分頁指定文章 content 內的舊紅 #c0392b 換成琥珀金 #fbbf24。
// 用法：node scripts/fix-highlight-color.mjs [slug] [--write]
//   預設 dry-run（只報告）。加 --write 才真的寫回 Sheet。
import fs from 'fs'
import { google } from 'googleapis'

const SLUG = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '01-vibe-coding-security'
const WRITE = process.argv.includes('--write')
const OLD = /#c0392b/gi
const NEW = '#fbbf24'

// --- load .env.local (no dotenv) ---
const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}

const sheetId = env.GOOGLE_SHEET_ID
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const sheets = google.sheets({ version: 'v4', auth })

const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'posts!A:N' })
const rows = data.values ?? []
const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === SLUG)
if (idx === -1) {
  console.error(`找不到 slug=${SLUG}（共 ${rows.length - 1} 篇）。現有 slug：`)
  console.error(rows.slice(1).map((r) => '  ' + (r[0] ?? '')).join('\n'))
  process.exit(1)
}

const sheetRow = idx + 1 // 1-based
const content = rows[idx][5] ?? '' // F 欄
const hits = (content.match(OLD) ?? []).length
console.log(`slug=${SLUG}  sheet row=${sheetRow}  #c0392b 出現 ${hits} 處`)

if (hits === 0) { console.log('沒有要改的，結束。'); process.exit(0) }

if (!WRITE) {
  console.log('（dry-run）加上 --write 才會寫回 Sheet。')
  process.exit(0)
}

const fixed = content.replace(OLD, NEW)
await sheets.spreadsheets.values.update({
  spreadsheetId: sheetId,
  range: `posts!F${sheetRow}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[fixed]] },
})
console.log(`已寫回 posts!F${sheetRow}，${hits} 處 #c0392b → ${NEW} ✓`)
