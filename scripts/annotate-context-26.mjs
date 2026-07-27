// 裁切＋標註 /context 截圖：去掉頂部分頁列與上一句對話，紅框＋編號三個重點
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { chromium } from 'playwright'

const RAW = 'C:/Users/asdto/OneDrive/桌面/未命名.png'
const OUT = path.resolve('D:/qkangber/blog-drafts/26-claude-code-commands/images/screenshot-context.jpg')
const CROP_TOP = 55

const meta = await sharp(RAW).metadata()
const W = meta.width
const H = meta.height - CROP_TOP
console.log('raw', meta.width, 'x', meta.height, '-> crop', W, 'x', H)

const cropped = await sharp(RAW).extract({ left: 0, top: CROP_TOP, width: W, height: H }).png().toBuffer()
const b64 = cropped.toString('base64')

const BOXES = [
  { n: 1, x: 2, y: 2, w: 112, h: 26, r: 6, badge: 'right' },     // /context 指令行
  { n: 2, x: 446, y: 76, w: 270, h: 28, r: 6, badge: 'right' },  // 224.6k/1m tokens 總量
  { n: 3, x: 446, y: 116, w: 356, h: 156, r: 8, badge: 'left' }, // 分類明細區塊（含 Free space）
]
// 遮掉裁切後頂部殘留的上一句對話灰字（/context 框右側以外全塗黑）
const MASK = `<div style="position:absolute;left:120px;top:0;width:${1161 - 120}px;height:16px;background:#000;"></div>`

const overlays = BOXES.map(b => {
  const bx = b.badge === 'left' ? b.x - 30 : b.x + b.w + 8
  const by = b.y + b.h / 2 - 12
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
</style></head><body><img class="shot" src="data:image/png;base64,${b64}">${MASK}${overlays}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
const png = await page.screenshot({ type: 'png' })
await browser.close()
await sharp(png).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(OUT)
console.log('OK', OUT)
