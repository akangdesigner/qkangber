// 發布 20-ai-agent-planning 到 posts 分頁。
// 用法：node scripts/publish-ai-agent-planning.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24。
// 示意圖已轉 ImgBB <img>（方格子複製不掉圖）；含封面共 5 張 <img>，無 inline SVG。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'ai-agent-planning'
const TITLE = 'AI 為什麼只需要一句指令，它就知道怎麼做？看懂 AI Agent 的推理與規劃能力'
const DATE = '2026/07/01'
const TAGS = 'AI Agent,Reasoning,Planning,推理,規劃'
const EXCERPT = '為什麼你只講一句話，AI 就自己拆解、一步步把任務做完？看懂 AI Agent 的推理（Reasoning）與規劃（Planning）：它怎麼先想清楚問題、再排出步驟，以及先想好全部和邊做邊調整兩種風格差在哪。'
const CATEGORY = 'AI Agent'
const SUBCATEGORY = ''
const COVER = 'https://i.ibb.co/fz4x3PHV/cover.webp'

// 草稿用 PNG/JPG（方格子不吃 webp）；上線官網才用 webp（效能）。
// 發布時把草稿的 png/jpg ImgBB 網址 map 成對應 webp 再寫 posts。
const PNG2WEBP = {
  'https://i.ibb.co/1jsrjG3/cover.jpg': 'https://i.ibb.co/fz4x3PHV/cover.webp',
  'https://i.ibb.co/Fqd6FbZv/plan-decompose.png': 'https://i.ibb.co/bjSNxkY9/plan-decompose.webp',
  'https://i.ibb.co/v6jYBths/plan-loop.png': 'https://i.ibb.co/nMF8yQJz/plan-loop.webp',
  'https://i.ibb.co/JWZNhQ4r/plan-two-styles.png': 'https://i.ibb.co/w25JrSs/plan-two-styles.webp',
  'https://i.ibb.co/HTq9XNST/ecosystem-planning.png': 'https://i.ibb.co/848gNpmK/ecosystem-planning.webp',
}

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/20-ai-agent-planning/20-ai-agent-planning.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 封面 img（萬一草稿還留本地路徑）→ webp 封面
content = content.replace(/src="images\/cover\.jpg"/gi, `src="${COVER}"`)
// 草稿 png/jpg → 官網 webp
for (const [png, webp] of Object.entries(PNG2WEBP)) content = content.split(png).join(webp)

// 紅 → 琥珀（內文已無 inline SVG，整段 body 文字都轉）
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  redBody: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/services/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
  svgs: (content.match(/<svg /gi) ?? []).length,
  imgbb: (content.match(/i\.ibb\.co/gi) ?? []).length,
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
console.log(`既有分類：${cats.join('、')}`)
console.log(`slug=${SLUG} | M=${CATEGORY} | date=${DATE}`)
console.log(`title=${TITLE}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應5：封面+4圖）｜其中 ImgBB=${leftover.imgbb}｜inline <svg>=${leftover.svgs}（應0）`)
console.log(`紅字殘留=${leftover.redBody}（應0）｜本地圖殘留=${leftover.localImg}（應0）｜/services CTA=${leftover.serviceCta}（應≥1）`)
console.log(`內文 aiqkangber 連結（${aqLinks.length}）：\n  - ${aqLinks.join('\n  - ')}`)
console.log(`封面=${COVER}`)
if (!WRITE) { console.log(`\n（dry-run）確認無誤後加 --write${UPDATE ? ' --update' : ''} 才會寫入。`); process.exit(0) }

if (UPDATE) {
  const rowNum = existIdx + 1
  await sheets.spreadsheets.values.update({ spreadsheetId: env.GOOGLE_SHEET_ID, range: `posts!A${rowNum}:O${rowNum}`, valueInputOption: 'RAW', requestBody: { values: [row] } })
  console.log(`✓ 已覆蓋 posts 第 ${rowNum} 列：${SLUG}`)
  process.exit(0)
}

await sheets.spreadsheets.values.append({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O', valueInputOption: 'RAW', insertDataOption: 'INSERT_ROWS', requestBody: { values: [row] } })
console.log(`✓ 已 append 到 posts：${SLUG}`)
