// 從最新草稿重建 30 篇（vibe-coding，Vibe Coding pillar hub）的方格子版。
// 方格子會吃掉 inline style，所以：inline SVG 示意圖 → ImgBB 圖片（jpg 原檔，方格子不吃 webp）；
// 封面本地圖 → 已上傳的 jpg；前言錨文字補上官網自連（官網版不自連，只有這裡掛）。
// 圖片來源＝blog-drafts/30-vibe-coding/images/ 用 scripts/upload-imgbb-raw.mjs 直傳的網址。
// 用法：node scripts/build-fanggezi-30.mjs
import fs from 'node:fs'

const DRAFT = 'blog-drafts/30-vibe-coding/30-vibe-coding.html'
const OUT = 'blog-drafts/30-vibe-coding/_fanggezi.html'

const IMG = {
  'images/cover.jpg': 'https://i.ibb.co/0yzHY2jN/cover.jpg',
}
// 順序＝文章裡 inline SVG 出現的順序
const SVG_IMG = [
  { url: 'https://i.ibb.co/3YszMgN5/how-it-works.jpg', alt: 'Vibe Coding 運作流程示意圖：你描述要什麼、AI 推測生成、你動手驗收三個環節' },
  { url: 'https://i.ibb.co/JF7GLkJ8/learning-path.jpg', alt: 'Vibe Coding 四階段學習順序示意圖：把需求講清楚、看懂它做了什麼、存檔與退回去、讓東西真的上線' },
  { url: 'https://i.ibb.co/TM3hjLHk/three-failures.jpg', alt: 'Vibe Coding 三種最常見的失控示意圖：改 A 壞 B、說做好了其實沒做、越修越亂，以及各自的擋法' },
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
const before = '<strong>Vibe Coding</strong> 是用自然語言描述需求'
const after = '<strong><a href="https://aiqkangber.com/blog/vibe-coding" target="_blank" rel="noopener">Vibe Coding</a></strong> 是用自然語言描述需求'
if (!html.includes(before)) throw new Error('找不到前言錨文字')
html = html.replace(before, after)

fs.writeFileSync(OUT, html)
console.log(`✓ 方格子版 → ${OUT}`)
console.log(`  SVG→圖片 ${n} 張｜本地圖 ${Object.keys(IMG).length} 張｜自連已補`)
console.log(`  總圖片數＝${(html.match(/<img /g) ?? []).length}｜表格＝${(html.match(/<table/g) ?? []).length}`)
console.log(`  殘留 inline svg＝${(html.match(/<svg /g) ?? []).length}（應 0）`)
