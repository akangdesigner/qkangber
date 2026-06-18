// 發布 11-engineer-mindset 到 posts 分頁（append 新列）。
// 用法：node scripts/publish-engineer-mindset.mjs [--write]   預設 dry-run。
// 官網版處理：去 h1、紅 #c0392b → 琥珀 #fbbf24、砍結尾服務 CTA、前言 ai-coding-downsides 自連拆掉。
// 內文圖已是 ImgBB 網址；保留 H2④ git-repository 延伸閱讀內鏈與 FAQ Q3 /services（實答導流）。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const SLUG = 'engineer-mindset'
const TITLE = 'AI 會取代工程師嗎？我關掉全自動寫文工作流，決定回來跟它一起動手'
const DATE = '2026/06/19'
const TAGS = 'AI 取代工程師,工程師會被 AI 取代嗎,人在迴路,Vibe Coding,n8n 全自動寫文章'
const EXCERPT = 'AI 會取代工程師嗎？我做過一條 n8n 全自動寫文章工作流，從選題到上站完全不用人碰，結果搜尋零曝光沒人看。這篇用我關掉它、改回人在迴路把關的真實過程，談 AI 取代工程師真正的分界線：會消失的是打字那部分，不是判斷。'
const CATEGORY = 'AI 趨勢觀點'   // M 主分類（扁平 5 類）— 觀點型破除迷思，非軟體開發教學
const SUBCATEGORY = ''           // O 副分類已退役，留空
const COVER = 'https://i.ibb.co/KxjWy2zx/photo-1508780709619-79562169bc64.webp'

// --- 內文轉換 ---
const raw = fs.readFileSync('blog-drafts/11-engineer-mindset/11-engineer-mindset.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()

// 砍結尾服務 CTA（總結最後一句，保留前面結論）
content = content.replace(/想把繁瑣的事交給自動化、又想把該把關的閘門留在對的位置，可以看看我的 <a href="https:\/\/aiqkangber\.com\/services">n8n 自動化建置服務<\/a>。/, '')
// 前言自連拆掉（保留錨文字）
content = content.replace(/<a href="https:\/\/aiqkangber\.com\/blog\/ai-coding-downsides">(.*?)<\/a>/, '$1')
// 紅 → 琥珀
content = content.replace(/#c0392b/gi, '#fbbf24')

const aqLinks = [...content.matchAll(/href="(https:\/\/aiqkangber\.com[^"]*)"/gi)].map((m) => m[1])
const leftover = {
  red: (content.match(/#c0392b/gi) ?? []).length,
  localImg: (content.match(/src="images\//gi) ?? []).length,
  serviceCta: (content.match(/n8n 自動化建置服務/gi) ?? []).length,
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
const cats = [...new Set(rows.slice(1).map((r) => (r[12] ?? '').trim()).filter(Boolean))]

console.log(`既有分類：${cats.join('、')}`)
console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | M=${CATEGORY} | O=（空）| tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${leftover.imgs}（應 5）`)
console.log(`殘留檢查：紅字=${leftover.red}（應0）｜本地圖=${leftover.localImg}（應0）｜服務CTA字串=${leftover.serviceCta}（應1=FAQ Q3 保留）`)
console.log(`內文 aiqkangber 連結（${aqLinks.length}）：\n  - ${aqLinks.join('\n  - ')}`)
console.log(`封面=${COVER}`)
if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write 才會 append。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: 'posts!A:O',
  valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS',
  requestBody: { values: [row] },
})
console.log(`✓ 已 append 到 posts：${SLUG}`)
