// One-off: 從草稿重建 engineer-terms 的官網內文並更新 posts F 欄（Q17 補 Claude Code 自動修 lint）。
// 用法：node scripts/update-engineer-terms-content.mjs [--write]   預設 dry-run。
// 官網版處理：去 h1、紅→琥珀、砍結尾 CTA（/newsletter 段落）；內文圖已是 ImgBB 網址。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const SLUG = 'engineer-terms'

const raw = fs.readFileSync('blog-drafts/07-engineer-terms-qa/07-engineer-terms-qa.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()
content = content.replace(/<p>[^<]*<a href="https:\/\/aiqkangber\.com\/newsletter"[\s\S]*?<\/p>\s*/, '')
content = content.replace(/#c0392b/gi, '#fbbf24')

const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  newsletter: (content.match(/\/newsletter/gi) ?? []).length,
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
console.log(`殘留檢查：紅字=${leftover.red}｜本地圖=${leftover.localImg}｜newsletter=${leftover.newsletter}（應全為 0）`)
console.log(`Q17 自動修 lint 段落：${(content.match(/fix linter errors/g) ?? []).length} 處（應為 1）`)
if (!WRITE) { console.log('（dry-run）加 --write 才會更新。'); process.exit(0) }

await sheets.spreadsheets.values.update({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: `posts!F${rowNum}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[content]] },
})
console.log(`✓ 已更新 F${rowNum}`)
