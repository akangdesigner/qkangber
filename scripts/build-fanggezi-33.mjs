// 從最新草稿重建 33 篇（claude-code-save-tokens）的方格子版。
// 方格子會吃掉 inline style，所以本地圖一律換成 ImgBB 的 jpg/png 原檔（方格子不吃 webp）。
// 這篇沒有 inline SVG，四張圖都是實體檔（封面＋三張紅框 CLI 截圖），不用 Playwright 轉圖。
// 圖片網址＝blog-drafts/33-claude-code-save-tokens/images/ 用 scripts/upload-imgbb-raw.mjs 直傳。
// 前言錨文字補上官網自連（官網版不自連，只有方格子版掛）。
// 用法：node scripts/build-fanggezi-33.mjs
import fs from 'node:fs'

const DRAFT = 'blog-drafts/33-claude-code-save-tokens/33-claude-code-save-tokens.html'
const OUT = 'blog-drafts/33-claude-code-save-tokens/_fanggezi.html'

const IMG = {
  'images/cover.jpg': 'https://i.ibb.co/hxQrPvJr/cover.jpg',
  'images/01-usage.png': 'https://i.ibb.co/Kpq5YbZT/01-usage.png',
  'images/02-context.png': 'https://i.ibb.co/ns8fYmrB/02-context.png',
  'images/03-plan-mode.png': 'https://i.ibb.co/b56wVmGr/03-plan-mode.png',
}

let html = fs.readFileSync(DRAFT, 'utf8')

for (const [local, url] of Object.entries(IMG)) {
  html = html.replaceAll(`src="${local}"`, `src="${url}"`)
}
const left = (html.match(/src="images\//g) ?? []).length
if (left) throw new Error(`還有 ${left} 張本地圖沒換`)

// 前言關鍵字掛官網自連（只有方格子版掛，官網版不自連）
const before = '<strong>Claude Code 費用</strong>怎麼算'
const after = '<strong><a href="https://aiqkangber.com/blog/claude-code-save-tokens" target="_blank" rel="noopener">Claude Code 費用</a></strong>怎麼算'
if (!html.includes(before)) throw new Error('找不到前言錨文字')
html = html.replace(before, after)

fs.writeFileSync(OUT, html)
console.log(`✓ 方格子版 → ${OUT}`)
console.log(`  本地圖換掉 ${Object.keys(IMG).length} 張｜自連已補`)
console.log(`  總圖片數＝${(html.match(/<img /g) ?? []).length}（應4）｜表格＝${(html.match(/<table/g) ?? []).length}（應1）`)
console.log(`  殘留 inline svg＝${(html.match(/<svg /g) ?? []).length}（應0）｜webp 網址＝${(html.match(/\.webp/g) ?? []).length}（應0）`)
console.log(`  h4 CTA＝${(html.match(/<h4 /g) ?? []).length}（應1）｜方框 CTA 殘留＝${(html.match(/border:1px solid #c0392b/g) ?? []).length}（應0）`)
