// 發布 19-ai-agent-trigger 到 posts 分頁。
// 用法：node scripts/publish-ai-agent-trigger.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24；草稿的 jpg/png ImgBB 圖換成 webp（上線用）。
// 19 全文都是 <img>（無 inline SVG），紅轉琥珀直接作用在全文。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'ai-agent-trigger'
const TITLE = 'AI 為什麼不用人下指令，也會自己開始工作？拆解 AI Agent 的排程與事件觸發機制'
const DATE = '2026/07/01'
const TAGS = 'AI Agent,排程,事件觸發,Trigger,主動式 AI'
const EXCERPT = '為什麼有些 AI 不用你開口，就會自己定時整理報表、收到訂單自動處理？這篇拆解 AI Agent 的排程（Schedule）與事件觸發（Trigger）機制，看懂主動式 AI 怎麼自己開始工作，以及 Trigger 和 Workflow 差在哪。'
const CATEGORY = 'AI Agent'       // M 主分類（dry-run 會印既有分類供核對）
const SUBCATEGORY = ''            // O 副分類已退役，留空

// 草稿 jpg/png（方格子用）→ 上線 webp
const IMG_MAP = {
  'https://i.ibb.co/YFQxR7GF/cover.jpg': 'https://i.ibb.co/fdY67sVJ/cover.webp',
  'https://i.ibb.co/Pzht5FgJ/two-triggers.png': 'https://i.ibb.co/x81CrS46/two-triggers.webp',
  'https://i.ibb.co/3m2X2zsm/trigger-flow.png': 'https://i.ibb.co/mFd86ZK8/trigger-flow.webp',
  'https://i.ibb.co/tpNS1fyX/ecosystem-trigger.png': 'https://i.ibb.co/GQCgh2SL/ecosystem-trigger.webp',
}
const COVER = IMG_MAP['https://i.ibb.co/YFQxR7GF/cover.jpg']

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/19-ai-agent-trigger/19-ai-agent-trigger.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 草稿圖 → 上線 webp
for (const [from, to] of Object.entries(IMG_MAP)) content = content.split(from).join(to)

// 紅 → 琥珀（19 無 inline SVG，直接全文替換）
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  redBody: (content.match(/#c0392b/gi) ?? []).length,
  amber: (content.match(/#fbbf24/gi) ?? []).length,
  draftImg: Object.keys(IMG_MAP).filter((u) => content.includes(u)).length,
  jpgPng: (content.match(/i\.ibb\.co\/[^"]*\.(jpg|png)/gi) ?? []).length,
  webp: (content.match(/i\.ibb\.co\/[^"]*\.webp/gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/services/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
  svgs: (content.match(/<svg /gi) ?? []).length,
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
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應4：封面+3示意圖）｜inline <svg>=${leftover.svgs}（應0）`)
console.log(`圖片：草稿jpg/png殘留=${leftover.draftImg}（應0）｜jpg/png=${leftover.jpgPng}（應0）｜webp=${leftover.webp}（應4）`)
console.log(`紅字殘留=${leftover.redBody}（應0）｜琥珀=${leftover.amber}｜/services CTA=${leftover.serviceCta}（應≥1）`)
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
