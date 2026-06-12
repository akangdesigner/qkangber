// One-off: 更新 posts 分頁 claude-design 那列的封面（K 圖片位址 + N coverImage）。
// 用法：node scripts/update-claude-design-cover.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const SLUG = 'claude-design'
const COVER = 'https://i.ibb.co/KpD1hmBt/claude-design-cover-v3-robot.jpg'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON), scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const r = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:N' })
const rows = r.data.values ?? []
const idx = rows.findIndex((row) => (row[0] ?? '').trim() === SLUG)
if (idx === -1) { console.error(`找不到 slug=${SLUG}`); process.exit(1) }
const rowNum = idx + 1
console.log(`第 ${rowNum} 列｜舊 K=${rows[idx][10] ?? ''}｜舊 N=${rows[idx][13] ?? ''}`)
console.log(`新封面=${COVER}`)
if (!WRITE) { console.log('（dry-run）加 --write 才會更新。'); process.exit(0) }

await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  requestBody: {
    valueInputOption: 'RAW',
    data: [
      { range: `posts!K${rowNum}`, values: [[COVER]] },
      { range: `posts!N${rowNum}`, values: [[COVER]] },
    ],
  },
})
console.log(`✓ 已更新 K${rowNum} / N${rowNum}`)
