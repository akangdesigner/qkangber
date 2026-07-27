// 標註 GitHub Dashboard 截圖：模糊個人資訊（側欄 repo 名單＋頭像），紅框①右上登入 ②左上 New
import path from 'path'
import sharp from 'sharp'
import { chromium } from 'playwright'

const RAW = 'C:/Users/asdto/OneDrive/桌面/未命名.png'
const OUT = path.resolve('D:/qkangber/blog-drafts/27-claude-code-github/images/screenshot-github-dashboard.jpg')

const meta = await sharp(RAW).metadata()
const W = meta.width, H = meta.height
console.log('raw', W, 'x', H)
const b64 = (await sharp(RAW).png().toBuffer()).toString('base64')

// 模糊區（個人資訊）：側欄 repo 名單、右上頭像
const MASKS = [
  { x: 16, y: 166, w: 310, h: 224, r: 8 },     // 側欄 repo 名單（含小頭像，蓋到最後一列）
  { x: 1472, y: 18, w: 36, h: 36, r: 18 },     // 右上角頭像
]

const BOXES = [
  { n: 1, x: 1464, y: 10, w: 52, h: 52, r: 12, badge: 'left' },  // 右上登入頭像
  { n: 2, x: 242, y: 84, w: 78, h: 40, r: 10, badge: 'right' },  // 左上 New 按鈕
]

const maskHtml = MASKS.map(m => `
  <div class="mask" style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;border-radius:${m.r}px;"></div>`).join('')

const overlays = BOXES.map(b => {
  const bx = b.bx ?? (b.badge === 'left' ? b.x - 32 : b.x + b.w + 8)
  const by = b.by ?? (b.y + b.h / 2 - 12)
  return `
  <div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${b.r}px;"></div>
  <div class="badge" style="left:${bx}px;top:${by}px;">${b.n}</div>`
}).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${W}px; height:${H}px; position:relative; overflow:hidden; }
img.shot { display:block; width:${W}px; height:${H}px; }
.mask { position:absolute; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.box { position:absolute; border:3px solid #e60023; box-shadow:0 0 0 1.5px rgba(255,255,255,0.85), inset 0 0 0 1.5px rgba(255,255,255,0.85); }
.badge { position:absolute; width:24px; height:24px; border-radius:50%; background:#e60023; color:#fff;
  font:700 14px/24px 'Segoe UI',sans-serif; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.35); }
</style></head><body><img class="shot" src="data:image/png;base64,${b64}">${maskHtml}${overlays}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
const png = await page.screenshot({ type: 'png' })
await browser.close()
await sharp(png).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(OUT)
console.log('OK', OUT)
