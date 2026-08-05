// 掃 posts 分頁的文中方框 CTA，沒有 text-align:center 的補上（外框樣式統一置中）。
// 用法：node scripts/normalize-cta-center.mjs [--write]
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

// 方框 CTA：外框 div 有 border + 主色（線上是琥珀 #fbbf24，舊文可能還留紅 #c0392b），
// 且 div 內文含 aiqkangber.com/services 連結。
const BOX = /<div style="([^"]*border:[^"]*(?:#fbbf24|#c0392b)[^"]*)">([\s\S]*?)<\/div>/gi

const hits = []
for (let i = 1; i < rows.length; i++) {
  const slug = (rows[i][0] ?? '').trim()
  const content = rows[i][5] ?? ''
  if (!slug || !content) continue
  let changed = 0
  const next = content.replace(BOX, (whole, style, inner) => {
    if (!/aiqkangber\.com\/services/i.test(inner)) return whole
    if (/text-align\s*:\s*center/i.test(style)) return whole
    changed++
    const sep = style.trim().endsWith(';') ? '' : ';'
    return `<div style="${style}${sep}text-align:center;">${inner}</div>`
  })
  if (changed) hits.push({ rowNum: i + 1, slug, changed, next })
}

if (!hits.length) { console.log('所有文中方框 CTA 都已置中。'); process.exit(0) }
console.log(`需要補置中的文章 ${hits.length} 篇：`)
for (const h of hits) console.log(`  第 ${h.rowNum} 列 ${h.slug}（${h.changed} 個方框）`)

if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write 才會寫回。'); process.exit(0) }

for (const h of hits) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: `posts!F${h.rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[h.next]] },
  })
  console.log(`✓ 第 ${h.rowNum} 列 ${h.slug}：${h.changed} 個方框補上置中`)
}
