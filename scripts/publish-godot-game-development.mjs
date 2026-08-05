// 發布 28-claude-code-game-dev 到 posts 分頁（slug: godot-game-development）。
// 用法：node scripts/publish-godot-game-development.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24、本地圖換 ImgBB 網址。封面保留在 body 當題圖，同時填 K/N 欄。
// 注意：提示詞終端機區塊用的深色底 #0f1117 與語法色（#6ee7a0/#c084fc/#93c5fd/#f87171）不含 #c0392b，不受紅轉琥珀影響。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'godot-game-development'
const TITLE = 'Godot 遊戲開發教學：結合 Claude Code 從零開始做出能玩的遊戲'
const DATE = '2026/07/30'
const TAGS = 'Godot,Godot 教學,Claude Code,AI 遊戲開發,遊戲引擎'
const EXCERPT = 'Godot 遊戲開發教學：結合 Claude Code 從零做出能玩的遊戲，引擎怎麼選、怎麼接上 Godot、提示詞怎麼下一次講清楚，附上實際卡住的地方與解法。'
const CATEGORY = 'AI 軟體開發'   // M 主分類（扁平 5 類）
const SUBCATEGORY = ''            // O 副分類已退役，留空
const COVER = 'https://i.ibb.co/nNXh08QW/cover.webp'

const IMG_MAP = {
  'images/cover.jpg': 'https://i.ibb.co/nNXh08QW/cover.webp',
  'images/arch-roles.jpg': 'https://i.ibb.co/VYy02t2R/arch-roles.webp',
  'images/screenshot-battle.jpg': 'https://i.ibb.co/WJrMK1c/screenshot-battle.webp',
  'images/screenshot-card.jpg': 'https://i.ibb.co/FqKvRmyT/screenshot-card.webp',
  'images/screenshot-codex.jpg': 'https://i.ibb.co/RkQ5nY5j/screenshot-codex.webp',
}

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/28-claude-code-game-dev/28-claude-code-game-dev.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 本地圖 → ImgBB 網址
for (const [local, url] of Object.entries(IMG_MAP)) {
  content = content.replace(new RegExp(`src="${local.replace(/\//g, '\\/')}"`, 'gi'), `src="${url}"`)
}

// 紅 → 琥珀（含文中方框 CTA 的框色/按鈕色一起轉）
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/services/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
  selfLink: (content.match(new RegExp(`aiqkangber\\.com/blog/${SLUG}`, 'gi')) ?? []).length,
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
console.log(`既有分類：${cats.join('、')}`)
console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | O=（空）| tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應 5）`)
console.log(`殘留檢查：紅字=${leftover.red}（應0）｜本地圖=${leftover.localImg}（應0）｜/services 連結=${leftover.serviceCta}（方框 CTA，應1）｜自連=${leftover.selfLink}（官網版應0，方格子版才掛）`)
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
