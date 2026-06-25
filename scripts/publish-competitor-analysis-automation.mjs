// 發布 13-competitor-analysis-automation 到 posts 分頁。
// 用法：node scripts/publish-competitor-analysis-automation.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 改成覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、抽掉 body 內封面 figure（改放 K/N 欄）、紅 #c0392b → 琥珀 #fbbf24。
// CTA 保留（文中方框 CTA→/services/marketing-automation＋結尾 CTA→/services）。內文圖已是 ImgBB 網址。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'competitor-analysis-automation'
const TITLE = '競品分析自動化：省下近 4 萬月費，用 n8n 每週自動監控競品與產業關鍵字'
const DATE = '2026/06/23'
const TAGS = '競品分析自動化,競品監控,輿情監控,社群監聽,n8n 行銷自動化'
const EXCERPT = '企業級輿情工具月費近 4 萬、還要簽一年。這篇教你用 n8n 自己做一套輕量的競品分析自動化，Tavily 撈新聞、Apify 爬社群、AI 分類，每週自動生成競品輿情監控週報，並判斷什麼情況不需要做這套。'
const CATEGORY = '行銷自動化'   // M 主分類（扁平 5 類）
const SUBCATEGORY = ''           // O 副分類已退役，留空
const COVER = 'https://i.ibb.co/xt9VZtff/125df80ef417.jpg'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/13-competitor-analysis-automation/13-competitor-analysis-automation.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 抽掉 body 裡的封面 figure（封面只放 K/N 欄，不放內文）
content = content.replace(/<figure>\s*<img src="https:\/\/i\.ibb\.co\/xt9VZtff\/125df80ef417\.jpg"[\s\S]*?<\/figure>/i, '').trim()

// 紅 → 琥珀（含文中方框 CTA 的框色/按鈕色一起轉）
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  coverInBody: (content.match(/125df80ef417/g) ?? []).length,
  ctaBtn: (content.match(/看行銷自動化服務/g) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/services/gi) ?? []).length,
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

console.log(`模式：${UPDATE ? `覆蓋既有第 ${existIdx + 1} 列` : 'append 新列'}`)
console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | O=（空）| tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應 4：封面已抽出 body）`)
console.log(`殘留檢查：紅字=${leftover.red}（應0）｜本地圖=${leftover.localImg}（應0）｜封面殘留 body=${leftover.coverInBody}（應0）｜方框 CTA 按鈕=${leftover.ctaBtn}（應1）｜/services 連結=${leftover.serviceCta}（方框＋結尾，應≥2）`)
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
