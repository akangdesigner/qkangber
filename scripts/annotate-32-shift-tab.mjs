// 把 Claude Code 終端機截圖裁掉中間空白、上下拼接，並圈出 /clear 與 shift+tab 兩個重點。
// 用法：node scripts/annotate-32-shift-tab.mjs
// 輸入：C:/Users/asdto/OneDrive/桌面/未命名.png（1173x557 原始截圖）
// 輸出：blog-drafts/32-claude-code-beginner-tips/images/screenshot-shift-tab.jpg
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const RAW = 'C:/Users/asdto/OneDrive/桌面/未命名.png'
const OUT = path.resolve('blog-drafts/32-claude-code-beginner-tips/images/screenshot-shift-tab.jpg')

const W = 1173
const TOP_H = 140       // header + /clear 那條
const GAP_H = 26        // 中間省略帶
const BOT_SRC_Y = 480   // 下段從原圖這個 y 開始
const BOT_H = 77        // 輸入框 + auto mode 那行
const H = TOP_H + GAP_H + BOT_H

const b64 = fs.readFileSync(RAW).toString('base64')
const src = `data:image/png;base64,${b64}`

// 紅框座標（對應拼接後的畫布）
const BOXES = [
  { n: 1, x: 4, y: 104, w: 108, h: 28 },                                   // /clear
  { n: 2, x: 8, y: TOP_H + GAP_H + (532 - BOT_SRC_Y) - 4, w: 372, h: 26 }, // auto mode on (shift+tab to cycle)
]

const overlays = BOXES.map((b) => `
  <div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;"></div>
  <div class="badge" style="left:${b.x + b.w + 8}px;top:${b.y + b.h / 2 - 12}px;">${b.n}</div>`).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${W}px; height:${H}px; position:relative; overflow:hidden; background:#1a1a1a; }
.seg { position:absolute; left:0; width:${W}px; background-image:url('${src}'); background-repeat:no-repeat; }
.top { top:0; height:${TOP_H}px; background-position:0 0; }
.bot { top:${TOP_H + GAP_H}px; height:${BOT_H}px; background-position:0 -${BOT_SRC_Y}px; }
.gap { position:absolute; left:0; top:${TOP_H}px; width:${W}px; height:${GAP_H}px; background:#1a1a1a;
  color:#666; font:600 15px/${GAP_H}px 'Segoe UI',sans-serif; text-align:center; letter-spacing:6px; }
.box { position:absolute; border:3px solid #e60023; border-radius:6px;
  box-shadow:0 0 0 1.5px rgba(255,255,255,0.6), inset 0 0 0 1.5px rgba(255,255,255,0.6); }
.badge { position:absolute; width:24px; height:24px; border-radius:50%; background:#e60023; color:#fff;
  font:700 14px/24px 'Segoe UI',sans-serif; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.35); }
</style></head><body>
<div class="seg top"></div>
<div class="gap">• • •</div>
<div class="seg bot"></div>
${overlays}
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: OUT, type: 'jpeg', quality: 92 })
await browser.close()
console.log('OK', OUT)
