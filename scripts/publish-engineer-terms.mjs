// 發布 07-engineer-terms-qa 到 posts 分頁（append 新列）。
// 用法：node scripts/publish-engineer-terms.mjs [--write]   預設 dry-run。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24、砍結尾 CTA（/newsletter 段落）；內文圖已是 ImgBB 網址不用換。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const SLUG = 'engineer-terms'
const TITLE = '工程師術語聽不懂？用 AI 寫程式必懂的 20 個開發行話 QA 大補帖（環境變數、CI/CD、git rebase）'
const DATE = '2026/06/13'
const TAGS = '工程師術語,AI 寫程式,Vibe Coding,Git,CI/CD'
const EXCERPT = '用 AI 寫程式卻聽不懂工程師術語？本篇整理 vibe coding 必懂的 20 個開發行話 QA：環境變數、CI/CD、PR、git rebase、Linter 全部白話解釋，讓你聽得懂、答得上、不再點頭裝懂。'
const CATEGORY = 'AI小知識'
const COVER = 'https://i.ibb.co/GQ8DWFP0/cover.webp'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/07-engineer-terms-qa/07-engineer-terms-qa.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 結尾 CTA（含 /newsletter 連結的段落）整段砍掉
content = content.replace(/<p>[^<]*<a href="https:\/\/aiqkangber\.com\/newsletter"[\s\S]*?<\/p>\s*/, '')
// 紅 → 琥珀
content = content.replace(/#c0392b/gi, '#fbbf24')

const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  newsletter: (content.match(/\/newsletter/gi) ?? []).length,
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
console.log(`殘留檢查：紅字=${leftover.red}｜本地圖=${leftover.localImg}｜newsletter 連結=${leftover.newsletter}（應全為 0）`)
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
