// 裁切＋標註 GitHub new repo 頁（Playwright 快照渲染版，來源已是 2x）
import path from 'path'
import sharp from 'sharp'
import { chromium } from 'playwright'

const RAW = path.resolve('blog-drafts/27-claude-code-github/images/_newrepo-raw.png')
const OUT = path.resolve('blog-drafts/27-claude-code-github/images/screenshot-github-newrepo.jpg')
// 原圖 3136x3000（2x）。裁 CSS y=80..920 → raw top=160, height=1680
const CROP = { left: 0, top: 160, width: 3136, height: 1576 }
const W = 1568, H = 788  // CSS 尺寸

const cropped = await sharp(RAW).extract(CROP).png().toBuffer()
const b64 = cropped.toString('base64')

const BOXES = [
  { n: 1, x: 616, y: 164, w: 528, h: 58, r: 8, badge: 'right' },  // Repository name + available
  { n: 2, x: 996, y: 424, w: 132, h: 46, r: 8, badge: 'right' },  // Private 下拉
  { n: 3, x: 988, y: 722, w: 152, h: 46, r: 8, badge: 'right' },  // Create repository 按鈕
]

const overlays = BOXES.map(b => {
  const bx = b.bx ?? (b.badge === 'left' ? b.x - 30 : b.x + b.w + 8)
  const by = b.by ?? (b.y + b.h / 2 - 12)
  return `
  <div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${b.r}px;"></div>
  <div class="badge" style="left:${bx}px;top:${by}px;">${b.n}</div>`
}).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${W}px; height:${H}px; position:relative; overflow:hidden; }
img.shot { display:block; width:${W}px; height:${H}px; }
.box { position:absolute; border:3px solid #e60023; box-shadow:0 0 0 1.5px rgba(255,255,255,0.85), inset 0 0 0 1.5px rgba(255,255,255,0.85); }
.badge { position:absolute; width:24px; height:24px; border-radius:50%; background:#e60023; color:#fff;
  font:700 14px/24px 'Segoe UI',sans-serif; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.35); }
</style></head><body><img class="shot" src="data:image/png;base64,${b64}">${overlays}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
const png = await page.screenshot({ type: 'png' })
await browser.close()
await sharp(png).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(OUT)
console.log('OK', OUT)
