// 發布 11-engineer-mindset 到 posts 分頁。
// 用法：node scripts/publish-engineer-mindset.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24、前言 ai-coding-downsides 自連拆掉。
// CTA 全保留（文中方框 CTA＋總結 CTA＋FAQ Q3，見 feedback_article_cta 2026-06-19 新政策）。內文圖已是 ImgBB。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'engineer-mindset'
const TITLE = 'AI 會取代工程師嗎？我關掉全自動寫文工作流，決定回來跟它一起動手'
const DATE = '2026/06/19'
const TAGS = 'AI 取代工程師,工程師會被 AI 取代嗎,人在迴路,Vibe Coding,n8n 全自動寫文章'
const EXCERPT = 'AI 會取代工程師嗎？我做過一條 n8n 全自動寫文章工作流，從選題到上站完全不用人碰，結果搜尋零曝光沒人看。這篇用我關掉它、改回人在迴路把關的真實過程，談 AI 取代工程師真正的分界線：會消失的是打字那部分，不是判斷。'
const CATEGORY = 'AI 趨勢觀點'   // M 主分類（扁平 5 類）— 觀點型破除迷思，非軟體開發教學
const SUBCATEGORY = ''           // O 副分類已退役，留空
const COVER = 'https://i.ibb.co/KxjWy2zx/photo-1508780709619-79562169bc64.webp'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/11-engineer-mindset/11-engineer-mindset.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 前言自連拆掉（保留錨文字）
content = content.replace(/<a href="https:\/\/aiqkangber\.com\/blog\/ai-coding-downsides">(.*?)<\/a>/, '$1')
// 紅 → 琥珀
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/n8n 自動化建置服務/gi) ?? []).length,
  ctaBox: (content.match(/諮詢／預約服務/g) ?? []).length,
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
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應 5）`)
console.log(`殘留檢查：紅字=${leftover.red}（應0）｜本地圖=${leftover.localImg}（應0）｜文中方框 CTA 按鈕=${leftover.ctaBox}（應1）｜n8n 自動化建置服務字串=${leftover.serviceCta}（應2＝總結＋FAQ Q3）`)
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
