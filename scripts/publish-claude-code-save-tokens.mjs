// 發布 33-claude-code-save-tokens 到 posts 分頁（Claude Code 集群第四篇）。
// 用法：node scripts/publish-claude-code-save-tokens.mjs [--write] [--update]
//   預設 dry-run；--write 才寫入；--update 覆蓋既有同 slug 那列（否則 append 新列）。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24；四張本地圖換成 ImgBB 網址。
// 這篇沒有 inline SVG，全部是封面＋三張紅框真截圖。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const UPDATE = process.argv.includes('--update')

const SLUG = 'claude-code-save-tokens'
const TITLE = 'Claude Code 費用怎麼算？8 個省 Token 技巧幫你把成本壓下來'
const DATE = '2026/08/06'
const TAGS = 'Claude Code,省 Token,Claude Code 費用,上下文管理,MCP'
const EXCERPT = 'Claude Code 費用怎麼算、額度怎麼看？8 個省 Token 技巧，從上下文管理、模型選擇到 subagent，一次把成本壓下來。'
const CATEGORY = 'AI 軟體開發'     // M 主分類（dry-run 會印既有分類供核對）
const SUBCATEGORY = ''            // O 副分類已退役，留空
const COVER = 'https://i.ibb.co/fdwBBnbM/cover.webp'
const SHOT_USAGE = 'https://i.ibb.co/pj5RFPVZ/01-usage.webp'
const SHOT_CONTEXT = 'https://i.ibb.co/YFrPPqH6/02-context.webp'
const SHOT_PLAN = 'https://i.ibb.co/7JWPm8ff/03-plan-mode.webp'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/33-claude-code-save-tokens/33-claude-code-save-tokens.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 本地圖 → ImgBB 網址
content = content.replace(/src="images\/cover\.jpg"/gi, `src="${COVER}"`)
content = content.replace(/src="images\/01-usage\.png"/gi, `src="${SHOT_USAGE}"`)
content = content.replace(/src="images\/02-context\.png"/gi, `src="${SHOT_CONTEXT}"`)
content = content.replace(/src="images\/03-plan-mode\.png"/gi, `src="${SHOT_PLAN}"`)

// 紅 → 琥珀（這篇沒有 inline SVG，不需要保護區塊）
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const extLinks = [...content.matchAll(/href="(https?:\/\/(?!aiqkangber\.com)[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/aiqkangber\.com\/(services|contact)/gi) ?? []).length,
  imgs: (content.match(/<img /gi) ?? []).length,
  svgs: (content.match(/<svg /gi) ?? []).length,
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
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應4）｜inline <svg>=${leftover.svgs}（應0）｜<table>=${leftover.tables}（應1）｜rowspan=${leftover.rowspan}（應0）｜FAQ=${leftover.faq}（應5）`)
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
