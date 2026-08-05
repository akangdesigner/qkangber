// 從最新草稿重建 28 篇（godot-game-development）的方格子版。
// 方格子會吃掉 inline style，所以：inline SVG 示意圖 → ImgBB 圖片；深色提示詞區塊 → 終端機視窗截圖；
// 本地圖 → 已上傳的 jpg（方格子不吃 webp）；前言錨文字補上官網自連（官網版不自連，只有這裡掛）。
// 提示詞區塊的圖由 scripts/_tmp-terminal-shots.mjs 那類腳本重新產生後再上傳更新網址。
// 用法：node scripts/build-fanggezi-28.mjs
import fs from 'node:fs'

const DRAFT = 'blog-drafts/28-claude-code-game-dev/28-claude-code-game-dev.html'
const OUT = 'blog-drafts/28-claude-code-game-dev/_fanggezi.html'

const IMG = {
  'images/cover.jpg': 'https://i.ibb.co/Jj65DSDd/cover-jpg.jpg',
  'images/arch-roles.jpg': 'https://i.ibb.co/zHBsm6qh/arch-roles-jpg.jpg',
  'images/screenshot-battle.jpg': 'https://i.ibb.co/hRY8VsZ6/screenshot-battle-jpg.jpg',
  'images/screenshot-card.jpg': 'https://i.ibb.co/XxMH2MBV/screenshot-card-jpg.jpg',
  'images/screenshot-codex.jpg': 'https://i.ibb.co/GfZhtXfk/screenshot-codex-jpg.jpg',
}
const SVG_IMG = [
  { url: 'https://i.ibb.co/hRrQ5FKT/svg-godot-steps.jpg', alt: '接上 Godot 的三步驟示意圖：下載安裝 Godot、在專案資料夾開 Claude Code、回編輯器按執行' },
  { url: 'https://i.ibb.co/DPgxncZw/svg-prompt-parts.jpg', alt: '好提示詞的三個部分示意圖：交代專案與規則、條件一條條列出、限制範圍並回報' },
]
const PROMPT_IMG = [
  { url: 'https://i.ibb.co/6RFf39YR/prompt-1.jpg', alt: 'Claude Code 提示詞範例：告訴它這是我的 Godot 專案資料夾、要做什麼遊戲，這一輪先不要改檔案' },
  { url: 'https://i.ibb.co/SwkDBptt/prompt-2.jpg', alt: 'Claude Code 提示詞範例：請它在終端機設定檔加一個 gogodot 捷徑，一鍵開啟 Godot 編輯器' },
  { url: 'https://i.ibb.co/ZRRKpcV9/prompt-3.jpg', alt: '含糊的提示詞寫法範例：只說幫我做棋子可以移動' },
  { url: 'https://i.ibb.co/sptXH2bQ/prompt-4.jpg', alt: '具體的提示詞寫法範例：交代專案與規則、三條移動判斷條件、限制這輪只改移動並回報改了哪些檔案' },
]

let html = fs.readFileSync(DRAFT, 'utf8')

let n = 0
html = html.replace(/<svg[\s\S]*?<\/svg>/g, () => {
  const s = SVG_IMG[n++]
  if (!s) throw new Error('SVG 數量比預期多')
  return `<img src="${s.url}" alt="${s.alt}">`
})
if (n !== SVG_IMG.length) throw new Error(`SVG 只換到 ${n} 張`)

let p = 0
html = html.replace(/<div style="background:#0f1117[\s\S]*?\n<\/div>/g, () => {
  const s = PROMPT_IMG[p++]
  if (!s) throw new Error('提示詞區塊比預期多')
  return `<figure>\n  <img src="${s.url}" alt="${s.alt}">\n</figure>`
})
if (p !== PROMPT_IMG.length) throw new Error(`提示詞區塊只換到 ${p} 個`)

for (const [local, url] of Object.entries(IMG)) {
  html = html.replaceAll(`src="${local}"`, `src="${url}"`)
}
const left = (html.match(/src="images\//g) ?? []).length
if (left) throw new Error(`還有 ${left} 張本地圖沒換`)

const before = '這篇 <strong>Godot 遊戲開發教學</strong>'
const after = '這篇 <strong><a href="https://aiqkangber.com/blog/godot-game-development" target="_blank" rel="noopener">Godot 遊戲開發教學</a></strong>'
if (!html.includes(before)) throw new Error('找不到前言錨文字')
html = html.replace(before, after)

fs.writeFileSync(OUT, html)
console.log(`✓ 方格子版 → ${OUT}`)
console.log(`  SVG→圖片 ${n} 張｜提示詞區塊→終端機圖 ${p} 張｜本地圖 ${Object.keys(IMG).length} 張｜自連已補`)
console.log(`  總圖片數＝${(html.match(/<img /g) ?? []).length}`)
