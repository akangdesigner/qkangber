// 裁切＋標註 /permissions 截圖：去掉頂部分頁列與上方無關 diff、底部狀態列，紅框＋編號三個重點
import path from 'path'
import sharp from 'sharp'
import { chromium } from 'playwright'

const RAW = 'C:/Users/asdto/OneDrive/桌面/CLAUDE讀取用圖片.png'
const OUT = path.resolve('D:/qkangber/blog-drafts/26-claude-code-commands/images/screenshot-permissions.jpg')
const CROP_TOP = 242
const CROP_BOTTOM = 600

const meta = await sharp(RAW).metadata()
const W = meta.width
const H = Math.min(CROP_BOTTOM, meta.height) - CROP_TOP
console.log('raw', meta.width, 'x', meta.height, '-> crop', W, 'x', H)

const cropped = await sharp(RAW).extract({ left: 0, top: CROP_TOP, width: W, height: H }).png().toBuffer()
const b64 = cropped.toString('base64')

const BOXES = [
  { n: 1, x: 322, y: 4, w: 70, h: 28, r: 6, badge: 'right', bx: 438, by: 8 }, // Allow 分頁（球放 Ask 與 Deny 中間空隙）
  { n: 2, x: 30, y: 132, w: 930, h: 192, r: 8, badge: 'right' },  // 自動放行規則清單
  { n: 3, x: 30, y: 330, w: 432, h: 26, r: 6, badge: 'right' },   // 底部切換提示（包到 cancel）
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
