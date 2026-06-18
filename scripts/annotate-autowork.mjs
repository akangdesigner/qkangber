// 在全自動寫文工作流截圖上紅筆標註各段節點在幹嘛。
// 用法：node scripts/annotate-autowork.mjs
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const RAW = path.resolve('blog-drafts/11-engineer-mindset/images/_auto-workflow-raw.png')
const OUT = path.resolve('blog-drafts/11-engineer-mindset/images/auto-workflow.png')
const W = 1026, H = 413

const b64 = fs.readFileSync(RAW).toString('base64')

// 紅框（對應 1026x413 原圖）
const BOXES = [
  { x: 103, y: 205, w: 290, h: 66 },   // ① 前段：Code→主題生成→AI Agent
  { x: 498, y: 18,  w: 152, h: 380 },  // ② Switch 分章＋各段 Groq 生成
  { x: 695, y: 205, w: 188, h: 66 },   // ③ Merge→排序→轉html
  { x: 893, y: 205, w: 60,  h: 66 },   // ④ HTTP Request 上站
]

// 紅字說明（pill）
const LABELS = [
  { n: 1, x: 110, y: 286, t: '自動定主題、規劃文章架構' },
  { n: 2, x: 470, y: 1,   t: '拆成各章節，每段各自叫 AI 生成' },
  { n: 3, x: 672, y: 285, t: '合併、排序、轉成網頁 HTML' },
  { n: 4, x: 800, y: 330, t: '直接 POST 上站，沒人按確認' },
]

const boxEls = BOXES.map(b =>
  `<div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;"></div>`
).join('')

const labelEls = LABELS.map(l =>
  `<div class="pill" style="left:${l.x}px;top:${l.y}px;"><span class="num">${l.n}</span>${l.t}</div>`
).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${W}px; height:${H}px; position:relative; overflow:hidden;
  font-family:'Microsoft JhengHei','Segoe UI',sans-serif; }
img.shot { display:block; width:${W}px; height:${H}px; }
.box { position:absolute; border:2.5px solid #e60023; border-radius:6px;
  box-shadow:0 0 0 1px rgba(255,255,255,0.7), inset 0 0 0 1px rgba(255,255,255,0.7); }
.pill { position:absolute; background:rgba(255,255,255,0.96); color:#c0102a;
  font:700 12px/1 'Microsoft JhengHei',sans-serif; padding:4px 8px 4px 5px; border-radius:11px;
  border:1.5px solid #e60023; white-space:nowrap; box-shadow:0 1px 4px rgba(0,0,0,0.4);
  display:flex; align-items:center; gap:5px; }
.num { display:inline-flex; width:16px; height:16px; border-radius:50%; background:#e60023; color:#fff;
  font:700 11px/16px 'Segoe UI',sans-serif; align-items:center; justify-content:center; flex:0 0 auto; }
</style></head><body><img class="shot" src="data:image/png;base64,${b64}">${boxEls}${labelEls}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: OUT })
await browser.close()
console.log('OK', OUT)
