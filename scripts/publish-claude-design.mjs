// 發布 06-claude-code-web-design 到 posts 分頁（append 新列）。
// 用法：node scripts/publish-claude-design.mjs [--write]   預設 dry-run。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24、內文圖換 ImgBB、砍前言自連與結尾 CTA。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const SLUG = 'claude-design'
const TITLE = 'Claude Code 做出來的網頁充滿 AI 味？Claude Design 協同設計讓網站 UI/UX 質感飛躍'
const DATE = '2026/06/11'
const TAGS = 'Claude Design,Claude Code,UI/UX,Vibe Coding'
const EXCERPT = 'Claude Code 做的網頁總是充滿 AI 味、一看就是 AI 生的？這篇用我自己的網站當案例，實測怎麼讓 Claude Design 與 Claude Code 協同設計，從千篇一律、彼此撞臉的罐頭版型救成有個性的 UI/UX，並誠實講限制與最新的額度變動。'
const CATEGORY = 'AI工具'
const COVER = 'https://i.ibb.co/v4NFZ68q/06-claude-code-web-design-cover.jpg'

const IMG_MAP = {
  'images/01-ai-samey-layouts.png': 'https://i.ibb.co/8nDJvCRN/claude-design-01-ai-samey-layouts.png',
  'images/06-ai-slop-six-styles.png': 'https://i.ibb.co/gF3gYSXD/claude-design-06-ai-slop-six-styles.png',
  'images/setup-design-system.png': 'https://i.ibb.co/wZYywfXH/claude-design-setup-design-system.png',
  'images/02-claude-design-canvas.png': 'https://i.ibb.co/zWLMGhLc/claude-design-02-claude-design-canvas.png',
  'images/dribbble-reference.png': 'https://i.ibb.co/4nDwmtPh/claude-design-dribbble-reference.png',
  'images/03-send-to-claude-code.png': 'https://i.ibb.co/fYwmDkW9/claude-design-03-send-to-claude-code.png',
  'images/04-before-ai-generic.png': 'https://i.ibb.co/pj9m5Dt9/claude-design-04-before-ai-generic.png',
  'images/05-after-aiqkangber.png': 'https://i.ibb.co/PvY150RK/claude-design-05-after-aiqkangber.png',
}

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/06-claude-code-web-design/06-claude-code-web-design.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 前言自連：拆掉 claude-mcp 連結、保留文字
content = content.replace(
  /<a href="https:\/\/aiqkangber\.com\/blog\/claude-mcp"[^>]*><strong>Claude Code<\/strong><\/a>/,
  '<strong>Claude Code</strong>'
)
// 結尾 CTA（含 /contact 連結的段落）整段砍掉
content = content.replace(/<p>[^<]*<a href="https:\/\/aiqkangber\.com\/contact"[\s\S]*?<\/p>\s*/, '')
// 紅 → 琥珀
content = content.replace(/#c0392b/gi, '#fbbf24')
// 內文圖換 ImgBB
for (const [local, remote] of Object.entries(IMG_MAP)) content = content.replaceAll(`src="${local}"`, `src="${remote}"`)

const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  contact: (content.match(/\/contact/gi) ?? []).length,
  introLink: (content.match(/blog\/claude-mcp"[^>]*><strong>Claude Code/gi) ?? []).length,
}

// 欄位順序：A slug,B title,C date,D tags,E excerpt,F content,G featured,H published,I 已轉發,J 連結,K 圖片位址,L 雲端轉化,M category,N coverImage
const row = [SLUG, TITLE, DATE, TAGS, EXCERPT, content, '', 'TRUE', 'FALSE', `https://aiqkangber.com/blog/${SLUG}`, COVER, '', CATEGORY, COVER]

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

// 防重複 + 列出既有分類
const existing = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:M' })
const rows = existing.data.values ?? []
const slugs = rows.map((r) => (r[0] ?? '').trim())
if (slugs.includes(SLUG)) { console.error(`posts 已有 slug=${SLUG}，中止（避免重複）`); process.exit(1) }
const cats = [...new Set(rows.slice(1).map((r) => (r[12] ?? '').trim()).filter(Boolean))]
console.log(`既有分類：${cats.join('、')}`)

console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | category=${CATEGORY} | tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${(content.match(/<img /gi) ?? []).length}`)
console.log(`殘留檢查：紅字=${leftover.red}｜本地圖=${leftover.localImg}｜contact 連結=${leftover.contact}｜前言自連=${leftover.introLink}（應全為 0）`)
console.log(`封面=${COVER}`)
if (!WRITE) { console.log('（dry-run）確認無誤後加 --write 才會 append。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: 'posts!A:N',
  valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS',
  requestBody: { values: [row] },
})
console.log(`✓ 已 append 到 posts：${SLUG}`)
