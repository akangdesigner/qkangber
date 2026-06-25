// 發布 12-edm-rfm-segmentation 到 posts 分頁。
// 用法：node scripts/publish-edm-rfm-segmentation.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 改成覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24。CTA 保留（文中方框 CTA＋結尾 CTA，導 /services）。
// 內文圖已是 ImgBB 網址；封面不在 body（前言已移除），只放 K/N 欄；延伸閱讀內鏈保留。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'edm-rfm-segmentation'
const TITLE = 'EDM 自動化怎麼做：用 RFM 顧客分群＋n8n 把信精準發給對的人'
const DATE = '2026/06/22'
const TAGS = 'EDM 自動化,RFM 顧客分群,客戶分群,精準行銷,n8n 行銷自動化'
const EXCERPT = 'EDM 自動化怎麼做？我拿一個電商客戶一整年的 Shopline 訂單做 RFM 顧客分群，發現近九成客戶只買一次。這篇講怎麼把訂單變成可行動的分眾，再用 n8n 讓每封信精準發給對的人。'
const CATEGORY = '行銷自動化'   // M 主分類（扁平 5 類）
const SUBCATEGORY = ''           // O 副分類已退役，留空
const COVER = 'https://i.ibb.co/hFJkmYJ5/6add0bfd1aaa.jpg'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/12-edm-rfm-segmentation/12-edm-rfm-segmentation.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 紅 → 琥珀（含文中方框 CTA 的框色/按鈕色一起轉）
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/services/gi) ?? []).length,
  ctaBtn: (content.match(/看行銷自動化服務/g) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
}

// 欄位：A slug,B title,C date,D tags,E excerpt,F content,G featured,H published,I 已轉發,J 連結,K 圖片位址,L 雲端轉化,M category,N coverImage,O 副分類
// G 欄（index 6 featured）默認 TRUE，見 feedback_posts_featured_default
const row = [SLUG, TITLE, DATE, TAGS, EXCERPT, content, 'TRUE', 'TRUE', 'FALSE', `https://aiqkangber.com/blog/${SLUG}`, COVER, '', CATEGORY, COVER, SUBCATEGORY]

// --- env / auth ---
const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const existing = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = existing.data.values ?? []
const slugs = rows.map((r) => (r[0] ?? '').trim())
const existIdx = slugs.indexOf(SLUG)   // 0-based（含表頭）
if (!UPDATE && existIdx !== -1) { console.error(`posts 已有 slug=${SLUG}，要覆蓋請加 --update`); process.exit(1) }
if (UPDATE && existIdx === -1) { console.error(`找不到 slug=${SLUG}，無法 --update`); process.exit(1) }
const cats = [...new Set(rows.slice(1).map((r) => (r[12] ?? '').trim()).filter(Boolean))]

console.log(`模式：${UPDATE ? `覆蓋既有第 ${existIdx + 1} 列` : 'append 新列'}`)
console.log(`既有分類：${cats.join('、')}`)
console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | O=（空）| tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應 5：5 張內文圖，封面不在 body）`)
console.log(`殘留檢查：紅字=${leftover.red}（應0）｜本地圖=${leftover.localImg}（應0）｜方框 CTA 按鈕=${leftover.ctaBtn}（應1）｜/services 連結=${leftover.serviceCta}（方框＋結尾，應≥2）`)
console.log(`內文 aiqkangber 連結（${aqLinks.length}）：\n  - ${aqLinks.join('\n  - ')}`)
console.log(`封面=${COVER}`)
if (!WRITE) { console.log(`\n（dry-run）確認無誤後加 --write${UPDATE ? ' --update' : ''} 才會寫入。`); process.exit(0) }

if (UPDATE) {
  const rowNum = existIdx + 1
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: `posts!A${rowNum}:O${rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })
  console.log(`✓ 已覆蓋 posts 第 ${rowNum} 列：${SLUG}`)
  process.exit(0)
}

await sheets.spreadsheets.values.append({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: 'posts!A:O',
  valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS',
  requestBody: { values: [row] },
})
console.log(`✓ 已 append 到 posts：${SLUG}`)
