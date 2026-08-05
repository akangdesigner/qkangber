// 把 posts 分頁每篇文章內文裡「連到自己 slug」的自連拆掉（保留錨文字與其內層標籤）。
// 官網版不自連，方格子版才掛連結（2026-07-30 定案）。
// 用法：node scripts/strip-self-links.mjs [--write]
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const res = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = res.data.values ?? []

const hits = []
for (let i = 1; i < rows.length; i++) {
  const slug = (rows[i][0] ?? '').trim()
  const content = rows[i][5] ?? ''
  if (!slug || !content) continue
  // 自連：<a ... href="...aiqkangber.com/blog/<slug>"...>內容</a>（href 可帶結尾斜線）
  const re = new RegExp(`<a\\b[^>]*href="https?://(?:www\\.)?aiqkangber\\.com/blog/${slug}/?"[^>]*>([\\s\\S]*?)</a>`, 'gi')
  const found = [...content.matchAll(re)]
  if (!found.length) continue
  const next = content.replace(re, '$1')
  hits.push({ rowNum: i + 1, slug, count: found.length, samples: found.map((m) => m[0].slice(0, 120)), next })
}

if (!hits.length) { console.log('沒有任何文章有自連。'); process.exit(0) }

console.log(`有自連的文章 ${hits.length} 篇：`)
for (const h of hits) {
  console.log(`\n  第 ${h.rowNum} 列 ${h.slug}（${h.count} 處）`)
  for (const s of h.samples) console.log(`    ${s}`)
}

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write 才會寫回。'); process.exit(0) }

for (const h of hits) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: `posts!F${h.rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[h.next]] },
  })
  console.log(`✓ 第 ${h.rowNum} 列 ${h.slug}：拆掉 ${h.count} 處自連`)
}
