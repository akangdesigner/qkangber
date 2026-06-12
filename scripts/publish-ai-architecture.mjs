// 發布 05-ai-architecture 到 posts 分頁（append 新列）。
// 用法：node scripts/publish-ai-architecture.mjs <COVER_DRIVE_ID> [--write]
//   不帶 --write = dry-run（只預覽，不寫入）。
import fs from 'fs'
import { google } from 'googleapis'

const COVER_ID = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : ''
const WRITE = process.argv.includes('--write')

const SLUG = 'ai-architecture'
const TITLE = 'AI 架構是什麼？搞懂 AI Agent 怎麼從「會聊天」變成「會自己做事」'
const DATE = '2026/06/09'
const TAGS = 'AI 架構,AI Agent,n8n,AI'
const EXCERPT = 'AI 架構是什麼？這篇用四個元件白話拆解，帶你看懂 AI Agent 怎麼從會聊天進化到會自己做事，並用實際做過的系統教你判斷：你的需求到底該不該用 AI Agent。'
const CATEGORY = 'AI趨勢'

// --- 內文：抽 body、去 h1、紅 #c0392b → 琥珀 #fbbf24 ---
const raw = fs.readFileSync('blog-drafts/05-ai-architecture/05-ai-architecture.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
let content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim()
content = content.replace(/#c0392b/gi, '#fbbf24')
const stillRed = (content.match(/#c0392b/gi) ?? []).length

// --- 封面三欄（比照既有列格式）---
const K = COVER_ID ? `https://drive.google.com/uc?export=${COVER_ID}` : ''
const L = COVER_ID ? `https://lh3.googleusercontent.com/u/0/d/${COVER_ID}` : ''
const N = COVER_ID ? `https://drive.google.com/thumbnail?id=${COVER_ID}&sz=w1600` : ''

// 欄位順序：A slug,B title,C date,D tags,E excerpt,F content,G featured,H published,I 已轉發,J 連結,K 圖片位址,L 雲端轉化,M category,N coverImage
const row = [SLUG, TITLE, DATE, TAGS, EXCERPT, content, '', 'TRUE', 'FALSE', `https://aiqkangber.com/blog/${SLUG}`, K, L, CATEGORY, N]

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
const existing = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:A' })
const slugs = (existing.data.values ?? []).map((r) => (r[0] ?? '').trim())
if (slugs.includes(SLUG)) { console.error(`posts 已有 slug=${SLUG}，中止（避免重複）`); process.exit(1) }

console.log(`slug=${SLUG}`)
console.log(`title=${TITLE}`)
console.log(`date=${DATE} | category=${CATEGORY} | tags=${TAGS}`)
console.log(`內文長度=${content.length}｜<img>=${(content.match(/<img /gi) ?? []).length}｜殘留紅字#c0392b=${stillRed}`)
console.log(`封面 ID=${COVER_ID || '（未提供！）'}`)
console.log(`  N coverImage=${N || '（空）'}`)
if (!COVER_ID) console.log('⚠️ 沒有封面 ID，K/L/N 會留空。建議提供封面再發。')
if (!WRITE) { console.log('（dry-run）確認無誤後加 --write 才會 append。'); process.exit(0) }

await sheets.spreadsheets.values.append({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: 'posts!A:N',
  valueInputOption: 'RAW',
  insertDataOption: 'INSERT_ROWS',
  requestBody: { values: [row] },
})
console.log(`✓ 已 append 到 posts：${SLUG}`)
