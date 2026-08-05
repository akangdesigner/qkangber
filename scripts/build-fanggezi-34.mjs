// 從最新草稿重建 34 篇（google-apps-script-syntax）的方格子版。
// 方格子會吃掉 inline style，所以：inline SVG 示意圖 → ImgBB 圖片（jpg/png 原檔，方格子不吃 webp）；
// 本地圖 → 已上傳的 ImgBB 網址；前言錨文字補上官網自連（官網版不自連，只有這裡掛）。
// 圖片網址＝scripts/upload-imgbb-raw.mjs 直傳的結果。
// SVG 的 jpg 由 scripts/render-svg-34.mjs 產生（Playwright 2x，sharp 直吃 SVG 中文會空白）。
// 用法：node scripts/build-fanggezi-34.mjs
import fs from 'node:fs'

const DRAFT = 'blog-drafts/34-google-apps-script-syntax/34-google-apps-script-syntax.html'
const OUT = 'blog-drafts/34-google-apps-script-syntax/_fanggezi.html'

const IMG = {
  'images/cover.jpg': 'https://i.ibb.co/HfrsQjzK/cover.jpg',
  'images/error-log.png': 'https://i.ibb.co/5g7vFTrF/error-log.png',
  'images/script-properties.png': 'https://i.ibb.co/4gJGH7rK/script-properties.png',
}
// 順序＝文章裡 inline SVG 出現的順序
const SVG_IMG = [
  { url: 'https://i.ibb.co/HfPZckKz/svg-code-blocks.jpg', alt: 'Google Apps Script 程式碼拆解示意圖：註解、function、變數、Google 服務四塊' },
]

let html = fs.readFileSync(DRAFT, 'utf8')

let n = 0
html = html.replace(/<svg[\s\S]*?<\/svg>/g, () => {
  const s = SVG_IMG[n++]
  if (!s) throw new Error('SVG 數量比預期多')
  return `<img src="${s.url}" alt="${s.alt}">`
})
if (n !== SVG_IMG.length) throw new Error(`SVG 只換到 ${n} 張`)

for (const [local, url] of Object.entries(IMG)) {
  html = html.replaceAll(`src="${local}"`, `src="${url}"`)
}
const left = (html.match(/src="images\//g) ?? []).length
if (left) throw new Error(`還有 ${left} 張本地圖沒換`)

// 表格滿版＋補格線：照 21-prompt-engineering 的方格子版做法，table 與每個 th/td 都上 inline style
// （width 屬性一起留著當雙保險，方格子若吃掉 style 至少屬性還在）
html = html.replace(/<table(?![^>]*\bstyle=)[^>]*>/g, '<table width="100%" style="width:100%;border-collapse:collapse;">')
html = html.replaceAll('<th>', '<th style="border:1px solid #ddd;padding:8px;text-align:left;">')
html = html.replaceAll('<td>', '<td style="border:1px solid #ddd;padding:8px;">')

// 文中 CTA 是 h4＋p（不用方框 div，方格子吃得到標籤、只會掉置中）
const cta = (html.match(/<h4[^>]*>/g) ?? []).length
if (cta !== 1) throw new Error(`文中 CTA 的 h4 應有 1 個，實際 ${cta} 個`)

// 前言關鍵字掛官網自連（只有方格子版掛，官網版不自連）
const before = '<strong>Google Apps Script 語法</strong>不用背。'
const after = '<strong><a href="https://aiqkangber.com/blog/google-apps-script-syntax" target="_blank" rel="noopener">Google Apps Script 語法</a></strong>不用背。'
if (!html.includes(before)) throw new Error('找不到前言錨文字')
html = html.replace(before, after)

fs.writeFileSync(OUT, html)
console.log(`✓ 方格子版 → ${OUT}`)
console.log(`  SVG→圖片 ${n} 張｜本地圖 ${Object.keys(IMG).length} 張｜文中 CTA h4 ${cta} 個｜自連已補`)
console.log(`  殘留 inline style＝${(html.match(/ style="/g) ?? []).length}（方格子會全部吃掉）`)
console.log(`  總圖片數＝${(html.match(/<img /g) ?? []).length}｜表格＝${(html.match(/<table/g) ?? []).length}`)
console.log(`  殘留 inline svg＝${(html.match(/<svg /g) ?? []).length}（應 0）`)
