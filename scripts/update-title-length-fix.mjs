// One-off：修 3 篇 title 過長被 Google SERP 顯示異常的文章標題，只動 B 欄，不碰 excerpt/內文。
// 用法：node scripts/update-title-length-fix.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const UPDATES = [
  {
    slug: 'ai-tool-calling',
    title: 'AI 怎麼查資料、寄信、操作資料庫？拆解 Tool Calling 運作原理',
  },
  {
    slug: 'post-produce',
    title: 'AI 貼文生成器怎麼做？n8n + Claude Code 寫出多風格社群貼文',
  },
  {
    slug: 'claude-mcp',
    title: 'MCP 是什麼？讓 Claude 直接操作你的Figma和n8n',
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

const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'posts!A:B' })
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

  if (!WRITE) continue

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `posts!B${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[u.title]] },
  })
  console.log(`  ✓ 已更新標題(B)`)
}

if (!WRITE) console.log('\n（dry-run）加上 --write 才會寫回 Sheet。')
