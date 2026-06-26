// 發布 15-marketing-automation-pillar 到 posts 分頁。
// 用法：node scripts/publish-n8n-marketing-applications.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append）。
// 官網版處理：去 h1、抽掉 body 內封面 figure（改放 K/N 欄）、紅 #c0392b → 琥珀 #fbbf24。
// 內文 2 張 inline SVG 保留（HTML 文章走 dangerouslySetInnerHTML，SVG 正常渲染）。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'n8n-marketing-applications'
const TITLE = 'n8n 應用：行銷團隊必備 6 大自動化工具——從競品分析到行銷週報製作'
const DATE = '2026/06/27'
const TAGS = 'n8n 應用,n8n 行銷自動化,行銷自動化,行銷團隊,自動化工作流'
const EXCERPT = 'n8n 在行銷可以做什麼？這篇用 6 篇實戰幫行銷團隊把 n8n 學完用滿：先帶你把環境架起來，再給 5 種立刻能照做的自動化——新聞稿群發、多平台發文、競品分析、RFM／EDM、自動週報，從零到每週省下大把時間。'
const CATEGORY = '行銷自動化'
const SUBCATEGORY = ''
const COVER = 'https://i.ibb.co/JRfHTXNV/cover.webp'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/15-marketing-automation-pillar/15-marketing-automation-pillar.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 抽掉 body 裡的封面 figure（封面只放 K/N 欄）
content = content.replace(/<figure>\s*<img src="images\/cover\.jpg"[\s\S]*?<\/figure>/i, '').trim()

// 紅 → 琥珀（含方框 CTA 的框色/按鈕色）
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  coverInBody: (content.match(/cover\.jpg/g) ?? []).length,
  svg: (content.match(/<svg/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/services/gi) ?? []).length,
}

// 欄位：A slug,B title,C date,D tags,E excerpt,F content,G featured,H published,I 已轉發,J 連結,K 圖片位址,L 雲端轉化,M category,N coverImage,O 副分類
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
const existIdx = slugs.indexOf(SLUG)
if (!UPDATE && existIdx !== -1) { console.error(`posts 已有 slug=${SLUG}，要覆蓋請加 --update`); process.exit(1) }
if (UPDATE && existIdx === -1) { console.error(`找不到 slug=${SLUG}，無法 --update`); process.exit(1) }

console.log(`模式：${UPDATE ? `覆蓋既有第 ${existIdx + 1} 列` : 'append 新列'}`)
console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | O=（空）| tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<svg>=${leftover.svg}（應2）｜<img>=${leftover.imgs}（應0：封面已抽出、其餘是 inline SVG）`)
console.log(`殘留檢查：紅字=${leftover.red}（應0）｜本地圖=${leftover.localImg}（應0）｜封面殘留 body=${leftover.coverInBody}（應0）｜/services 連結=${leftover.serviceCta}（方框＋結尾，應≥2）`)
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
