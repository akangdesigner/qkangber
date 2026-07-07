// 發布 22-google-apps-script（GAS 入門篇）到 posts 分頁。先發這篇，再發 23-n8n-apps-script。
// 用法：node scripts/publish-google-apps-script.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24；六張 <img> src 全換 ImgBB webp；程式碼是 <pre> 文字塊不用動。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'google-apps-script'
const TITLE = 'Google Apps Script 能做什麼？4 種用法與免費額度入門教學，Google 帳號內建的自動化工具'
const DATE = '2026/07/04'
const TAGS = 'Google Apps Script,GAS,Google Sheets,自動化,自訂函式'
const EXCERPT = 'Google Apps Script 能做什麼？入門教學一次認識 4 種常見用法：Google Sheet 自訂函式、定時觸發器、自動寄信、網頁應用程式，整理免費額度上限，並附上我實際用它解決問題的過程與部署設定。'
const CATEGORY = 'AI 軟體開發'    // M 主分類（dry-run 會印既有分類供核對）
const SUBCATEGORY = ''            // O 副分類已退役，留空

// [本地檔名, 草稿用 jpg 網址（方格子版）, 官網用 webp 網址]——草稿內嵌 jpg 網址，發官網換 webp
const IMG = [
  ['cover.jpg', 'https://i.ibb.co/4nTqqbRR/cover-jpg.jpg', 'https://i.ibb.co/35RwRBSQ/cover.webp'],
  ['ui-open-editor.jpg', 'https://i.ibb.co/3yyL8g11/ui-open-editor-jpg.jpg', 'https://i.ibb.co/bgGdcpTn/ui-open-editor.webp'],
  ['gas-use-cases.jpg', 'https://i.ibb.co/1ty6PF43/gas-use-cases-jpg.jpg', 'https://i.ibb.co/bMMsXWzJ/gas-use-cases.webp'],
  ['flow-getlink.jpg', 'https://i.ibb.co/HpqhZWNs/flow-getlink-jpg.jpg', 'https://i.ibb.co/cXknw1QK/flow-getlink.webp'],
  ['arch-feedback-flow.jpg', 'https://i.ibb.co/DP0cgYj0/arch-feedback-flow-jpg.jpg', 'https://i.ibb.co/tFNhJCR/arch-feedback-flow.webp'],
  ['ui-deploy-steps.jpg', 'https://i.ibb.co/pjrvjrjT/ui-deploy-steps-jpg.jpg', 'https://i.ibb.co/n8w3q1M1/ui-deploy-steps.webp'],
]
const COVER = IMG[0][2]

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/22-google-apps-script/22-google-apps-script.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 草稿 jpg 網址（或殘留的本地路徑）→ 官網 webp 網址
for (const [file, jpgUrl, webpUrl] of IMG) {
  content = content.replaceAll(`src="${jpgUrl}"`, `src="${webpUrl}"`)
  content = content.replaceAll(`src="images/${file}"`, `src="${webpUrl}"`)
}

// 紅 → 琥珀（程式碼 <pre> 內的語法色不含 #c0392b，不受影響）
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  redBody: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  jpgImg: (content.match(/-jpg\.jpg/gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/services/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
  pres: (content.match(/<pre /gi) ?? []).length,
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
const cats = [...new Set(rows.slice(1).map((r) => (r[12] ?? '').trim()).filter(Boolean))]

console.log(`模式：${UPDATE ? `覆蓋既有第 ${existIdx + 1} 列` : 'append 新列'}`)
console.log(`既有分類（核對 M 欄該填什麼）：${cats.join('、')}`)
console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應6）｜<pre>=${leftover.pres}（應5：4段程式＋1段AI提問格式）`)
console.log(`紅字殘留=${leftover.redBody}（應0）｜本地圖殘留=${leftover.localImg}（應0）｜jpg圖殘留=${leftover.jpgImg}（應0）｜/services 連結=${leftover.serviceCta}（文中框＋結尾，應2）`)
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
