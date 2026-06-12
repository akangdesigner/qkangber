// 產生方格子轉貼版：把草稿的本機圖片路徑換成 ImgBB 絕對網址（其他內容不動，
// CTA／前言反向連結／紅字 #c0392b 都保留——那些就是給外部平台用的）。
// 用法：node scripts/make-vocus-draft.mjs
// 輸出：blog-drafts/06-claude-code-web-design/06-claude-code-web-design.vocus.html
import fs from 'fs'

const SRC = 'blog-drafts/06-claude-code-web-design/06-claude-code-web-design.html'
const OUT = 'blog-drafts/06-claude-code-web-design/06-claude-code-web-design.vocus.html'

const IMG_MAP = {
  'images/01-ai-samey-layouts.png': 'https://i.ibb.co/8nDJvCRN/claude-design-01-ai-samey-layouts.png',
  'images/06-ai-slop-six-styles.png': 'https://i.ibb.co/gF3gYSXD/claude-design-06-ai-slop-six-styles.png',
  'images/setup-design-system.png': 'https://i.ibb.co/wZYywfXH/claude-design-setup-design-system.png',
  'images/02-claude-design-canvas.png': 'https://i.ibb.co/zWLMGhLc/claude-design-02-claude-design-canvas.png',
  'images/dribbble-reference.png': 'https://i.ibb.co/4nDwmtPh/claude-design-dribbble-reference.png',
  'images/03-send-to-claude-code.png': 'https://i.ibb.co/fYwmDkW9/claude-design-03-send-to-claude-code.png',
  'images/04-before-ai-generic.png': 'https://i.ibb.co/pj9m5Dt9/claude-design-04-before-ai-generic.png',
  'images/05-after-aiqkangber.png': 'https://i.ibb.co/PvY150RK/claude-design-05-after-aiqkangber.png',
  'images/07-services-before-after.png': 'https://i.ibb.co/CKJQprqJ/claude-design-07-services-before-after.png',
  'images/08-newsletter-before-after.png': 'https://i.ibb.co/hFMB1d5L/claude-design-08-newsletter-before-after.png',
}

let html = fs.readFileSync(SRC, 'utf8')
for (const [local, remote] of Object.entries(IMG_MAP)) html = html.replaceAll(`src="${local}"`, `src="${remote}"`)

const leftover = (html.match(/src="images\//g) ?? []).length
fs.writeFileSync(OUT, html)
console.log(`OK ${OUT}｜<img>=${(html.match(/<img /g) ?? []).length}｜殘留本地路徑=${leftover}（應為 0）`)
