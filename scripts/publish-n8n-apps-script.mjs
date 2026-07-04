// 發布 23-n8n-apps-script 到 posts 分頁（等 22 google-apps-script 入門篇上線後再跑，內文有指向它的連結）。
// 用法：node scripts/publish-n8n-apps-script.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24；五張 <img>（封面＋4 示意圖）src 全換 ImgBB webp。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'n8n-apps-script'
const TITLE = 'n8n × Google Apps Script 協同作業教學：從數據抓取到報表統計，打造全自動流程'
const DATE = '2026/07/02'
const TAGS = 'n8n,Google Apps Script,webhook,Google Sheets,自動化'
const EXCERPT = 'n8n 和 Google Apps Script 怎麼搭配？用我的 IG 監控工具當例子：Apps Script 顧資料進表、n8n webhook 串接跨服務流程，從數據抓取、AI 摘要到報表統計全自動，含分工決策圖。'
const CATEGORY = 'AI 軟體開發'    // M 主分類（dry-run 會印既有分類供核對）
const SUBCATEGORY = ''            // O 副分類已退役，留空

const IMG = {
  'cover.jpg': 'https://i.ibb.co/kgzrbQzc/cover.webp',
  'arch-hub.jpg': 'https://i.ibb.co/ZpNtB0V6/arch-hub.webp',
  'flow-relay.jpg': 'https://i.ibb.co/b5YfbSrJ/flow-relay.webp',  // 2026-07-04 換版：出手→動手
  'webhook-directions.jpg': 'https://i.ibb.co/NgQFTDp0/webhook-directions.webp',
  'decision-tree.jpg': 'https://i.ibb.co/9mJHQRCb/decision-tree.webp',
}
const COVER = IMG['cover.jpg']

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/23-n8n-apps-script/23-n8n-apps-script.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 本地圖 → ImgBB 網址
for (const [file, url] of Object.entries(IMG)) {
  content = content.replaceAll(`src="images/${file}"`, `src="${url}"`)
}

// 紅 → 琥珀
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  redBody: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/services/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
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

// 前置檢查：22 入門篇上線了嗎（內文兩處連結指向它）
const has22 = slugs.includes('google-apps-script')
console.log(`前置：posts 是否已有 google-apps-script（22 入門篇）→ ${has22 ? '✓ 有' : '✗ 還沒！先發 22 再發這篇'}`)

console.log(`模式：${UPDATE ? `覆蓋既有第 ${existIdx + 1} 列` : 'append 新列'}`)
console.log(`既有分類（核對 M 欄該填什麼）：${cats.join('、')}`)
console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應5：封面＋4示意圖；程式碼是 <pre> 文字塊非圖）`)
console.log(`紅字殘留=${leftover.redBody}（應0）｜本地圖殘留=${leftover.localImg}（應0）｜/services 連結=${leftover.serviceCta}（文中框＋結尾，應2）`)
console.log(`內文 aiqkangber 連結（${aqLinks.length}）：\n  - ${aqLinks.join('\n  - ')}`)
console.log(`封面=${COVER}`)
if (!WRITE) { console.log(`\n（dry-run）確認無誤後加 --write${UPDATE ? ' --update' : ''} 才會寫入。`); process.exit(0) }
if (!has22 && !UPDATE) { console.error('✗ 22 入門篇還沒上線，擋下寫入（確定要先發就自己註解掉這行）'); process.exit(1) }

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
