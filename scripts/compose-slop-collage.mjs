// 把 _ai-slop-gallery 的 6 張流派截圖拼成一張帶標籤的 3x2 對照圖。
// 用法：node scripts/compose-slop-collage.mjs
// 輸出：blog-drafts/06-claude-code-web-design/images/06-ai-slop-six-styles.png
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const DIR = path.resolve('blog-drafts/06-claude-code-web-design/_ai-slop-gallery')
const OUT = path.resolve('blog-drafts/06-claude-code-web-design/images/06-ai-slop-six-styles.png')

const ITEMS = [
  { file: '01-dark-saas.png', label: '深色紫光 SaaS', sub: '記帳工具' },
  { file: '02-light-saas.png', label: '淺色乾淨 SaaS', sub: '法律科技' },
  { file: '03-bento.png', label: 'Bento 格子', sub: '寵物健康' },
  { file: '04-glass.png', label: '玻璃擬態漸層', sub: '咖啡訂閱' },
  { file: '05-split-pastel.png', label: '左右分欄粉彩', sub: '健身 App' },
  { file: '06-portfolio.png', label: '個人品牌 Portfolio', sub: '工程師' },
]

const cells = ITEMS.map(it => `
  <figure>
    <div class="shot"><img src="data:image/png;base64,${fs.readFileSync(path.join(DIR, it.file)).toString('base64')}" alt=""></div>
    <figcaption><strong>${it.label}</strong><span>${it.sub}</span></figcaption>
  </figure>`).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500;700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Noto Sans TC',sans-serif; background:#111317; padding:28px; width:1600px; }
.grid { display:grid; grid-template-columns:repeat(3,1fr); gap:26px 22px; }
figure { display:flex; flex-direction:column; gap:10px; }
.shot { border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.12); box-shadow:0 10px 28px rgba(0,0,0,0.45); }
.shot img { display:block; width:100%; }
figcaption { display:flex; align-items:baseline; gap:8px; padding:0 2px; }
figcaption strong { font-size:17px; font-weight:700; color:#f1f5f9; }
figcaption span { font-size:13px; font-weight:500; color:#7c8494; }
</style></head><body><div class="grid">${cells}</div></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 400 }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.screenshot({ path: OUT, fullPage: true })
await browser.close()
console.log('OK', OUT)
