// 在 Send to Claude Code 截圖上圈出重點（紅框＋步驟編號）。
// 用法：node scripts/annotate-send-screenshot.mjs
// 輸入：blog-drafts/06-claude-code-web-design/_send-to-raw.png（原始截圖）
// 輸出：blog-drafts/06-claude-code-web-design/images/03-send-to-claude-code.png
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const RAW = path.resolve('blog-drafts/06-claude-code-web-design/_send-to-raw.png')
const OUT = path.resolve('blog-drafts/06-claude-code-web-design/images/03-send-to-claude-code.png')
const W = 1516, H = 692

const b64 = fs.readFileSync(RAW).toString('base64')

// 紅框座標（對應 1516x692 原圖）
const BOXES = [
  { n: 1, x: 1436, y: 1, w: 64, h: 34, r: 17, badge: 'left' },   // 右上角 Share 按鈕
  { n: 2, x: 1330, y: 42, w: 152, h: 36, r: 18, badge: 'left' },  // Send to... 分頁
  { n: 3, x: 1058, y: 116, w: 426, h: 50, r: 12, badge: 'left' }, // Claude Code + Send
]

const overlays = BOXES.map(b => {
  const bx = b.badge === 'left' ? b.x - 30 : b.x + b.w + 6
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
</style></head><body><img class="shot" src="data:image/png;base64,${b64}">${overlays}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: OUT })
await browser.close()
console.log('OK', OUT)
