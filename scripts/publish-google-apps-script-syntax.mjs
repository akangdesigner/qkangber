// 發布 34-google-apps-script-syntax（GAS 判讀篇）到 posts 分頁。
// 用法：node scripts/publish-google-apps-script-syntax.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24（跳過 inline SVG 區塊，SVG 配色不動）；
//   兩張本地截圖換成 ImgBB webp；inline SVG 保留不轉圖（官網直接渲染）。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'google-apps-script-syntax'
const TITLE = 'Google Apps Script 語法指南，怎麼看懂 AI 寫的程式碼'
const DATE = '2026/08/06'
const TAGS = 'Google Apps Script,GAS,程式碼判讀,AI 寫程式,SpreadsheetApp'
const EXCERPT = 'Google Apps Script 語法其實就是 JavaScript，不用從頭學。教你把 AI 寫的程式碼拆成四塊來讀，認得 SpreadsheetApp、doPost 在動什麼，還有哪幾個地方一定要自己改。'
const CATEGORY = 'AI 軟體開發'    // M 主分類（dry-run 會印既有分類供核對）
const SUBCATEGORY = ''            // O 副分類已退役，留空
const COVER = 'https://i.ibb.co/4wzmP9vW/cover.webp'
const SHOT_ERROR = 'https://i.ibb.co/Q7ZCGvWt/error-log.webp'
const SHOT_PROPS = 'https://i.ibb.co/DHX5g3Wd/script-properties.webp'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/34-google-apps-script-syntax/34-google-apps-script-syntax.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 本地圖 → ImgBB webp（封面不在內文裡，只寫進 K/N 欄）
content = content.replace(/src="images\/error-log\.png"/gi, `src="${SHOT_ERROR}"`)
content = content.replace(/src="images\/script-properties\.png"/gi, `src="${SHOT_PROPS}"`)

// 紅 → 琥珀：先把 inline SVG 抽出來保護，換完再放回去（SVG 是靛紫板型，配色不能被改）
const svgStash = []
content = content.replace(/<svg[\s\S]*?<\/svg>/gi, (m) => {
  svgStash.push(m)
  return `@@SVG${svgStash.length - 1}@@`
})
content = content.replace(/#c0392b/gi, '#fbbf24')
content = content.replace(/@@SVG(\d+)@@/g, (_, i) => svgStash[Number(i)])

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const extLinks = [...content.matchAll(/href="(https?:\/\/(?!aiqkangber\.com)[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/(services|contact)/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
  svgs: (content.match(/<svg /gi) ?? []).length,
  pres: (content.match(/<pre/gi) ?? []).length,
  tables: (content.match(/<table/gi) ?? []).length,
  rowspan: (content.match(/rowspan/gi) ?? []).length,
  faq: (content.match(/<h3>Q\d/gi) ?? []).length,
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
const existIdx = slugs.indexOf(SLUG)   // 0-based（含表頭）
if (!UPDATE && existIdx !== -1) { console.error(`posts 已有 slug=${SLUG}，要覆蓋請加 --update`); process.exit(1) }
if (UPDATE && existIdx === -1) { console.error(`找不到 slug=${SLUG}，無法 --update`); process.exit(1) }
const cats = [...new Set(rows.slice(1).map((r) => (r[12] ?? '').trim()).filter(Boolean))]

console.log(`模式：${UPDATE ? `覆蓋既有第 ${existIdx + 1} 列` : 'append 新列'}`)
console.log(`既有分類（核對 M 欄該填什麼）：${cats.join('、')}`)
console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應2）｜inline <svg>=${leftover.svgs}（應1）｜<pre>=${leftover.pres}（應5）｜<table>=${leftover.tables}（應1）｜rowspan=${leftover.rowspan}（應0）｜FAQ=${leftover.faq}（應5）`)
console.log(`紅字殘留=${leftover.red}（應0）｜本地圖殘留=${leftover.localImg}（應0）｜CTA 連結=${leftover.serviceCta}（應≥2）`)
console.log(`內鏈 aiqkangber（${aqLinks.length}）：\n  - ${aqLinks.join('\n  - ')}`)
console.log(`外部參考資料（${extLinks.length}）：\n  - ${extLinks.join('\n  - ')}`)
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
