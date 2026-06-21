// 一次性：修 engineer-mindset 文章的 AI 味 + 前言補官網連結。
// 直接讀 posts 分頁現有內容做字串替換、寫回 F 欄（不重跑發布腳本，因 blog-drafts 源檔已不在）。
// 用法：node scripts/fix-engineer-mindset-aivoice.mjs [--write]
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const SLUG = 'engineer-mindset'

// [找, 換, 預期命中次數]
const EDITS = [
  // 1. 那一刻 → 之後
  ['看懂這張表的那一刻，我就決定把那條全自動工作流關掉了。',
   '看懂這張表之後，我就決定把那條全自動工作流關掉了。', 1],
  // 2. 前言關鍵字掛官網連結（語意錨文字 → AI 寫程式缺點那篇）
  ['，以及 AI 接手寫程式這件事真正的分界線在哪。',
   '，以及 <a href="https://aiqkangber.com/blog/ai-coding-downsides">AI 接手寫程式</a>這件事真正的分界線在哪。', 1],
  // 3. 差別不在…而在… → 平述
  ['差別不在「是不是 AI 寫的」，而在內容有沒有東西。',
   '跟「是不是 AI 寫的」無關，差別在內容有沒有東西。', 1],
  // 4. 問題不在…而在… → 平述（保留琥珀 span 高亮）
  ['我才意識到問題不在哪個節點壞了，而在<span style="color:#fbbf24;">整條流程裡，從頭到尾沒有一個地方是「人停下來做判斷」的</span>。',
   '我才意識到，問題根本不在某個節點壞掉。<span style="color:#fbbf24;">整條流程從頭到尾，根本沒有一個地方是「人停下來做判斷」的</span>。', 1],
  // 5. 不是它做得不好，是… → 平述
  ['不是它做得不好，是「完全不用人」這個目標本身就設錯了。',
   '它其實做得不差，壞就壞在「完全不用人」這個目標本身設錯了。', 1],
  // 6. 圖片 alt 裡的 不是「好」而是… → 平述
  ['我回給 AI 的不是「好」而是修改指令',
   '我回給 AI 的多半是修改指令', 1],
]

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const res = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = res.data.values ?? []
const idx = rows.findIndex((r) => (r[0] ?? '').trim() === SLUG)
if (idx === -1) { console.error(`找不到 slug=${SLUG}`); process.exit(1) }
const rowNum = idx + 1
let content = rows[idx][5] ?? ''
console.log(`找到 posts 第 ${rowNum} 列，內文長度 ${content.length}`)

let ok = true
for (const [find, repl, expect] of EDITS) {
  const n = content.split(find).length - 1
  const tag = n === expect ? '✓' : '✗'
  if (n !== expect) ok = false
  console.log(`${tag} 命中 ${n}（預期 ${expect}）：「${find.slice(0, 22)}…」`)
  if (n > 0) content = content.split(find).join(repl)
}

// 殘留體檢
const leftover = {
  那一刻: (content.match(/那一刻/g) ?? []).length,
  紅字: (content.match(/#c0392b/gi) ?? []).length,
  img: (content.match(/<img/gi) ?? []).length,
  前言官網連結: /做行銷[\s\S]{0,260}aiqkangber\.com/.test(content),
}
console.log(`\n替換後體檢：那一刻=${leftover.那一刻}（應0）｜紅字=${leftover.紅字}（應0）｜<img>=${leftover.img}（應5）｜前言含官網連結=${leftover.前言官網連結}`)
console.log(`新內文長度 ${content.length}`)

if (!ok) { console.error('\n有替換沒精準命中，中止。'); process.exit(1) }
if (!WRITE) { console.log('\n（dry-run）確認無誤後加 --write 才寫入。'); process.exit(0) }

await sheets.spreadsheets.values.update({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: `posts!F${rowNum}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[content]] },
})
console.log(`\n✓ 已寫回 posts!F${rowNum}`)
