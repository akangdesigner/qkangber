// One-off: 重建 claude-design 的官網內文並更新 posts F 欄（新增兩組 before/after 對比）。
// 用法：node scripts/update-claude-design-content.mjs [--write]   預設 dry-run。
// 官網版處理：去 h1、紅→琥珀、內文圖換 ImgBB、砍結尾 CTA；前言連到 claude-mcp 的連結
// 是指向其他文章的內部連結（非自連），保留。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const SLUG = 'claude-design'

const IMG_MAP = {
  'images/01-ai-samey-layouts.png': 'https://i.ibb.co/8nDJvCRN/claude-design-01-ai-samey-layouts.png',
  'images/06-ai-slop-six-styles.png': 'https://i.ibb.co/gF3gYSXD/claude-design-06-ai-slop-six-styles.png',
  'images/setup-design-system.png': 'https://i.ibb.co/wZYywfXH/claude-design-setup-design-system.png',
  'images/02-claude-design-canvas.png': 'https://i.ibb.co/zWLMGhLc/claude-design-02-claude-design-canvas.png',
  'images/dribbble-reference.png': 'https://i.ibb.co/4nDwmtPh/claude-design-dribbble-reference.png',
  'images/03-send-to-claude-code.png': 'https://i.ibb.co/fYwmDkW9/claude-design-03-send-to-claude-code.png',
  'images/04-before-ai-generic.png': 'https://i.ibb.co/pj9m5Dt9/claude-design-04-before-ai-generic.png',
  'images/05-after-aiqkangber.png': 'https://i.ibb.co/PvY150RK/claude-design-05-after-aiqkangber.png',
  'images/07-services-before-after.png': 'https://i.ibb.co/CKJQprqJ/claude-design-07-services-before-after.png',
  'images/08-newsletter-before-after.png': 'https://i.ibb.co/hFMB1d5L/claude-design-08-newsletter-before-after.png',
}

const raw = fs.readFileSync('blog-drafts/06-claude-code-web-design/06-claude-code-web-design.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()
content = content.replace(/<p>[^<]*<a href="https:\/\/aiqkangber\.com\/contact"[\s\S]*?<\/p>\s*/, '')
content = content.replace(/#c0392b/gi, '#fbbf24')
for (const [local, remote] of Object.entries(IMG_MAP)) content = content.replaceAll(`src="${local}"`, `src="${remote}"`)

const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  contact: (content.match(/\/contact/gi) ?? []).length,
}

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON), scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const r = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:A' })
const idx = (r.data.values ?? []).findIndex((row) => (row[0] ?? '').trim() === SLUG)
if (idx === -1) { console.error(`找不到 slug=${SLUG}`); process.exit(1) }
const rowNum = idx + 1

console.log(`第 ${rowNum} 列｜內文長度=${content.length}｜<img>=${(content.match(/<img /gi) ?? []).length}`)
console.log(`殘留檢查：紅字=${leftover.red}｜本地圖=${leftover.localImg}｜contact=${leftover.contact}（應全為 0）`)
console.log(`前言內部連結（claude-mcp，保留）：${(content.match(/blog\/claude-mcp/g) ?? []).length} 處`)
if (!WRITE) { console.log('（dry-run）加 --write 才會更新。'); process.exit(0) }

await sheets.spreadsheets.values.update({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: `posts!F${rowNum}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[content]] },
})
console.log(`✓ 已更新 F${rowNum}`)
