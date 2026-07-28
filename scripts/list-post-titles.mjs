// 唯讀：列出 posts 分頁所有文章的 slug / 標題 / 字數 / 分類 / 發布狀態，用來校標題長度。
// 用法：node scripts/list-post-titles.mjs [--all]   預設只列 published=TRUE。
import fs from 'fs'
import { google } from 'googleapis'

const SHOW_ALL = process.argv.includes('--all')

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
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})
const sheets = google.sheets({ version: 'v4', auth })

const { data } = await sheets.spreadsheets.values.get({
  spreadsheetId: sheetId,
  range: 'posts!A:O',
})
const rows = (data.values ?? []).slice(1)

const posts = rows
  .map((r, i) => ({
    row: i + 2,
    slug: (r[0] ?? '').trim(),
    title: r[1] ?? '',
    date: r[2] ?? '',
    published: (r[7] ?? '').toLowerCase() === 'true',
    category: (r[12] ?? '').trim(),
  }))
  .filter((p) => p.slug && (SHOW_ALL || p.published))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

// SERP 佔位以「半形單位」估算：全形字（CJK、全形標點）寬約 2，半形字元寬約 1。
// Google 桌面標題約在 60 單位處截斷，這才是真正該看的數字，不是字元數。
const BUDGET = 60
function serpWidth(text) {
  let w = 0
  for (const ch of text) {
    w += /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/.test(ch)
      ? 2
      : 1
  }
  return w
}

const scored = posts
  .map((p) => ({ ...p, width: serpWidth(p.title) }))
  .sort((a, b) => b.width - a.width)

const over = scored.filter((p) => p.width > BUDGET)
console.log(
  `共 ${scored.length} 篇${SHOW_ALL ? '（含未發布）' : '（已發布）'}，其中 ${over.length} 篇超過 ${BUDGET} 單位（依寬度排序）\n`,
)
for (const p of scored) {
  const flag = p.width > BUDGET ? '⚠ 超' + String(p.width - BUDGET).padStart(2) : '  ok  '
  console.log(
    `${String(p.width).padStart(3)}  ${flag}  ${p.date}  [${p.category || '未分類'}]${p.published ? '' : ' (草稿)'}`,
  )
  console.log(`          ${p.title}`)
  console.log(`          /blog/${p.slug}  (row ${p.row})\n`)
}
