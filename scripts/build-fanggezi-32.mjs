// 從最新草稿重建 32 篇（claude-code-tips）的方格子版。
// 方格子會吃掉 inline style，所以：inline SVG 示意圖 → ImgBB 圖片（jpg 原檔，方格子不吃 webp）；
// 本地圖 → 已上傳的 jpg；前言錨文字補上官網自連（官網版不自連，只有這裡掛）。
// 圖片來源＝blog-drafts/32-claude-code-beginner-tips/images/ 用 scripts/upload-imgbb-raw.mjs 直傳的網址。
// SVG 的 jpg 由 scripts/render-svg-32.mjs 產生（Playwright 2x，sharp 直吃 SVG 中文會空白）。
// 用法：node scripts/build-fanggezi-32.mjs
import fs from 'node:fs'

const DRAFT = 'blog-drafts/32-claude-code-beginner-tips/32-claude-code-beginner-tips.html'
const OUT = 'blog-drafts/32-claude-code-beginner-tips/_fanggezi.html'

const IMG = {
  'images/cover.jpg': 'https://i.ibb.co/8DZpGLV7/cover.jpg',
  'images/screenshot-shift-tab.jpg': 'https://i.ibb.co/Y7g7Xf16/screenshot-shift-tab.jpg',
}
// 順序＝文章裡 inline SVG 出現的順序
const SVG_IMG = [
  { url: 'https://i.ibb.co/65cPyDq/svg-claude-md.jpg', alt: 'CLAUDE.md 該寫的三種東西示意圖：稱呼與語言偏好、動手前的確認界線、回報方式與長度' },
  { url: 'https://i.ibb.co/h1Jwrs6X/svg-permission-modes.jpg', alt: 'Claude Code 四種權限模式階梯圖：Plan Mode、Manual、Accept Edits、Auto 的放行範圍由低到高' },
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

// 前言關鍵字掛官網自連（只有方格子版掛，官網版不自連）
const before = '剛裝好 <strong>Claude Code</strong> 的'
const after = '剛裝好 <strong><a href="https://aiqkangber.com/blog/claude-code-tips" target="_blank" rel="noopener">Claude Code</a></strong> 的'
if (!html.includes(before)) throw new Error('找不到前言錨文字')
html = html.replace(before, after)

fs.writeFileSync(OUT, html)
console.log(`✓ 方格子版 → ${OUT}`)
console.log(`  SVG→圖片 ${n} 張｜本地圖 ${Object.keys(IMG).length} 張｜自連已補`)
console.log(`  總圖片數＝${(html.match(/<img /g) ?? []).length}｜表格＝${(html.match(/<table/g) ?? []).length}`)
console.log(`  殘留 inline svg＝${(html.match(/<svg /g) ?? []).length}（應 0）`)
