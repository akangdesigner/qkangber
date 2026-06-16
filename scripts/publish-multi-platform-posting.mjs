// 發布 08-multi-platform-posting 到 posts 分頁（append 新列）。
// 用法：node scripts/publish-multi-platform-posting.mjs [--write]   預設 dry-run。
// 官網版處理：去 h1、砍結尾「n8n 自動化建置服務」CTA（保留免費下載＋延伸閱讀內鏈）、紅 #c0392b → 琥珀 #fbbf24。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const SLUG = 'multi-platform-posting'
const TITLE = '多平台發文如何自動化？我捨棄 Buffer，用 n8n 串 API 一次發三平台'
const DATE = '2026/06/17'
const TAGS = '多平台發文自動化,社群貼文自動化,n8n 串 API,Instagram 發文,Threads 發文'
const EXCERPT = '多平台發文自動化怎麼做？這篇分享我為什麼捨棄 Buffer，改用 n8n 串 Meta Graph API，把一篇定稿自動發到 FB、IG、Threads 的完整流程，還有 token 會過期這個最容易被忽略的問題。'
const CATEGORY = 'n8n 自動化'        // M 主分類
const SUBCATEGORY = '行銷專用'        // O 副分類
const COVER = 'https://i.ibb.co/3yqVkN11/cover.webp'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/08-multi-platform-posting/08-multi-platform-posting.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 砍結尾服務 CTA（句子，保留前面的免費下載）
content = content.replace(/想連內容生成到審核整套一起做，再看我的 <a href="https:\/\/aiqkangber\.com\/services">n8n 自動化建置服務<\/a>。/, '')
// 紅 → 琥珀
content = content.replace(/#c0392b/gi, '#fbbf24')

const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/n8n 自動化建置服務/gi) ?? []).length,
  freeDownload: (content.match(/services#free-download/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
}

// 欄位：A slug,B title,C date,D tags,E excerpt,F content,G featured,H published,I 已轉發,J 連結,K 圖片位址,L 雲端轉化,M category,N coverImage,O 副分類
const row = [SLUG, TITLE, DATE, TAGS, EXCERPT, content, '', 'TRUE', 'FALSE', `https://aiqkangber.com/blog/${SLUG}`, COVER, '', CATEGORY, COVER, SUBCATEGORY]

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

// 防重複
const existing = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = existing.data.values ?? []
const slugs = rows.map((r) => (r[0] ?? '').trim())
if (slugs.includes(SLUG)) { console.error(`posts 已有 slug=${SLUG}，中止（避免重複）`); process.exit(1) }

console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | O=${SUBCATEGORY} | tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應 5：封面＋4）`)
console.log(`殘留檢查：紅字=${leftover.red}（0）｜本地圖=${leftover.localImg}（0）｜服務CTA=${leftover.serviceCta}（0）｜免費下載連結=${leftover.freeDownload}（應 1，保留）`)
console.log(`封面=${COVER}`)
if (!WRITE) { console.log('（dry-run）確認無誤後加 --write 才會 append。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: 'posts!A:O',
  valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS',
  requestBody: { values: [row] },
})
console.log(`✓ 已 append 到 posts：${SLUG}`)
