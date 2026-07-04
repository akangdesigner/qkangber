// 發布 17-tool-calling 到 posts 分頁。
// 用法：node scripts/publish-tool-calling.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24（但跳過 <svg> 區塊，示意圖配色不轉）。
// 五張概念圖是 inline SVG（非 <img>）；唯一 <img> 是封面，src 換成 ImgBB 網址。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'ai-tool-calling'
const TITLE = 'AI 為什麼能查資料、寄信、操作資料庫？Tool Calling 運作原理一次看懂'
const DATE = '2026/07/01'
const TAGS = 'AI Agent,Tool Calling,Function Calling,MCP,工具呼叫'
const EXCERPT = 'ChatGPT 不只會聊天，還能查資料、寄 Email、操作資料庫，靠的就是 Tool Calling。這篇拆解 AI 如何決定要不要使用工具、完整執行流程，以及 Tool Calling、Function Calling、MCP 有什麼不同。'
const CATEGORY = 'AI Agent'       // M 主分類（dry-run 會印既有分類供核對）
const SUBCATEGORY = ''            // O 副分類已退役，留空
const COVER = 'https://i.ibb.co/fd4vq9kR/cover.webp'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/17-tool-calling/17-tool-calling.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 封面 img → ImgBB 網址
content = content.replace(/src="images\/cover\.jpg"/gi, `src="${COVER}"`)

// 紅 → 琥珀，但先把 <svg> 區塊抽出保護（示意圖內 #c0392b 不轉）
const svgBlocks = []
content = content.replace(/<svg[\s\S]*?<\/svg>/gi, (m) => { svgBlocks.push(m); return ` SVG${svgBlocks.length - 1} ` })
const redInSvg = svgBlocks.join('').match(/#c0392b/gi)?.length ?? 0
content = content.replace(/#c0392b/gi, '#fbbf24')   // 只作用在 body 文字
content = content.replace(/ SVG(\d+) /g, (_, i) => svgBlocks[+i])

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  redBody: (content.replace(/<svg[\s\S]*?<\/svg>/gi, '').match(/#c0392b/gi) ?? []).length,
  redSvgKept: (content.match(/<svg[\s\S]*?<\/svg>/gi)?.join('').match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
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
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應1：封面）｜inline <svg>=${leftover.svgs}（應5）`)
console.log(`紅字：body 殘留=${leftover.redBody}（應0）｜SVG 內保留=${leftover.redSvgKept}（原 SVG 有 ${redInSvg}，應原樣保留）`)
console.log(`本地圖殘留=${leftover.localImg}（應0）｜/services 連結=${leftover.serviceCta}（結尾 CTA，應≥1）`)
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
