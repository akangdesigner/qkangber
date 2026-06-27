// 在 posts 某篇內文(F)做精準字串替換以插入站內連結。
// 用法：node scripts/add-internal-link.mjs <slug> [--write]  預設 dry-run。
// 替換規則寫在下方 EDITS（slug → {find, replace}），find 必須在內文中剛好出現一次。
import fs from 'fs'
import { google } from 'googleapis'

const EDITS = {
  'engineer-mindset': {
    find: '丟給 AI Agent 規劃文章架構',
    replace: '丟給 AI Agent（這種讓 AI 自己規劃、自己決定下一步的設計，背後就是一套 <a href="https://aiqkangber.com/blog/ai-architecture">AI 架構</a>）規劃文章架構',
  },
}

const slug = process.argv[2]
const WRITE = process.argv.includes('--write')
const edit = EDITS[slug]
if (!edit) { console.error('沒有這個 slug 的替換規則：', Object.keys(EDITS).join(', ')); process.exit(1) }

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON), scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:F' })
const rows = data.values ?? []
const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === slug)
if (idx === -1) { console.error('找不到 slug'); process.exit(1) }
const row = idx + 1
const content = rows[idx][5] ?? ''

const count = content.split(edit.find).length - 1
if (count !== 1) { console.error(`find 命中 ${count} 次（需剛好 1 次），中止。`); process.exit(1) }
if (content.includes(edit.replace)) { console.error('看起來已經插入過了，中止。'); process.exit(1) }

const next = content.replace(edit.find, edit.replace)
const at = next.indexOf(edit.replace)
console.log(`slug=${slug}  row=${row}`)
console.log('--- 替換後上下文 ---')
console.log('…' + next.slice(Math.max(0, at - 40), at + edit.replace.length + 40) + '…')

if (!WRITE) { console.log('\n（dry-run）加 --write 才會寫回 Sheet。'); process.exit(0) }
await sheets.spreadsheets.values.update({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: `posts!F${row}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[next]] },
})
console.log('\n已寫回 posts row ' + row + ' 內文(F) ✓')
