// 在 Apps Script 部署設定截圖上圈重點（紅框＋步驟編號），並遮蔽 email 與指令碼 ID。
// 用法：node scripts/annotate-gas-deploy.mjs
// 輸入：blog-drafts/22-google-apps-script/_deploy-raw.png
// 輸出：blog-drafts/22-google-apps-script/images/ui-deploy-steps.jpg
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const RAW = path.resolve('blog-drafts/22-google-apps-script/_deploy-raw.png')
const OUT = path.resolve('blog-drafts/22-google-apps-script/images/ui-deploy-steps.jpg')
const W = 1160, H = 649

const b64 = fs.readFileSync(RAW).toString('base64')

// 紅框座標（對應 1160x649 原圖）
const BOXES = [
  { n: 1, x: 392, y: 144, w: 138, h: 36, r: 8, badge: 'left' },   // 選取類型：網頁應用程式
  { n: 2, x: 592, y: 420, w: 532, h: 74, r: 8, badge: 'left' },   // 誰可以存取＝所有人（含浮動標籤）
  { n: 3, x: 1052, y: 592, w: 84, h: 40, r: 8, badge: 'top' },    // 部署按鈕
]

// 遮蔽區（灰底蓋掉個資）
const MASKS = [
  { x: 640, y: 354, w: 228, h: 24 },   // email
  { x: 212, y: 576, w: 244, h: 22 },   // 指令碼 ID
]

const overlays = BOXES.map(b => {
  const bx = b.badge === 'top' ? b.x + b.w / 2 - 12 : (b.badge === 'left' ? b.x - 32 : b.x + b.w + 8)
  const by = b.badge === 'top' ? b.y - 32 : b.y + b.h / 2 - 12
  return `
  <div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${b.r}px;"></div>
  <div class="badge" style="left:${bx}px;top:${by}px;">${b.n}</div>`
}).join('') + MASKS.map(m =>
  `<div class="mask" style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;"></div>`
).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${W}px; height:${H}px; position:relative; overflow:hidden; }
img.shot { display:block; width:${W}px; height:${H}px; }
.box { position:absolute; border:3px solid #e60023; box-shadow:0 0 0 1.5px rgba(255,255,255,0.85), inset 0 0 0 1.5px rgba(255,255,255,0.85); }
.badge { position:absolute; width:24px; height:24px; border-radius:50%; background:#e60023; color:#fff;
  font:700 14px/24px 'Segoe UI',sans-serif; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.35); }
.mask { position:absolute; background:#e8eaed; border-radius:4px; }
</style></head><body><img class="shot" src="data:image/png;base64,${b64}">${overlays}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: OUT, type: 'jpeg', quality: 92 })
await browser.close()
console.log('OK', OUT)
