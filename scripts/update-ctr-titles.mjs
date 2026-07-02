// One-off: CTR 回收——更新三篇 0 點擊文章的標題(B)與 excerpt(E)，不動內文。
// 用法：node scripts/update-ctr-titles.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const UPDATES = [
  {
    slug: 'engineer-terms',
    title: '工程師術語白話解釋：用 AI 寫程式會遇到的 20 個開發行話一次看懂',
    excerpt:
      '環境變數、CI/CD、PR、git rebase、Linter……這些工程師術語到底在說什麼？20 個開發行話全部用白話解釋，一篇看懂，跟工程師和 AI 溝通不再點頭裝懂。',
  },
  {
    slug: 'engineer-mindset',
    title: 'AI 會取代工程師嗎？會被取代的是打字，不是判斷',
    excerpt:
      'AI 會取代工程師嗎？我實測過一條從選題到上站全自動的寫文工作流，最後親手關掉它。這篇從真實結果談哪些工作會消失、哪些反而更值錢，以及該把力氣放在哪。',
  },
  {
    slug: 'socailmedia',
    title: '社群監控工具自己做：用 n8n 一次追蹤 5 個平台的競品動態',
    excerpt:
      '不用月付幾千元的社群監控 SaaS：用 n8n 串 Apify 自動追蹤 5 個平台的競品貼文，數據自動整理成報表。完整節點設定教學，一個下午就能上線。',
  },
]

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}

const sheetId = env.GOOGLE_SHEET_ID
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'posts!A:E' })
const rows = data.values ?? []

for (const u of UPDATES) {
  const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === u.slug)
  if (idx === -1) {
    console.error(`✗ 找不到 slug=${u.slug}，略過`)
    continue
  }
  const sheetRow = idx + 1
  console.log(`\nslug=${u.slug}  row=${sheetRow}`)
  console.log(`  舊標題：${rows[idx][1] ?? ''}`)
  console.log(`  新標題：${u.title}`)
  console.log(`  舊 excerpt：${(rows[idx][4] ?? '').slice(0, 60)}…`)

  if (!WRITE) continue

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `posts!B${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[u.title]] },
  })
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `posts!E${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[u.excerpt]] },
  })
  console.log(`  ✓ 已更新 標題(B) / excerpt(E)`)
}

if (!WRITE) console.log('\n（dry-run）加上 --write 才會寫回 Sheet。')
