// 在「新聞轉發」工作流截圖上紅筆標註各段節點。
// 用法：node scripts/annotate-news.mjs a   （或 b）
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const which = (process.argv[2] || 'a').toLowerCase()

const CFG = {
  a: {
    raw: 'blog-drafts/11-engineer-mindset/images/_news-a-raw.png',
    out: 'blog-drafts/11-engineer-mindset/images/news-workflow-a.jpg',
    W: 1424, H: 476,
    boxes: [
      { x: 118, y: 86, w: 688, h: 92 },   // 排程→抓RSS→去重
      { x: 812, y: 86, w: 92,  h: 92 },   // Groq 改寫
      { x: 926, y: 86, w: 232, h: 92 },   // 過濾分數+寫入候選
      { x: 1280, y: 86, w: 92, h: 92 },   // LINE 通知
    ],
    labels: [
      { n: 1, x: 120,  y: 58,  t: '排程自動抓新聞、整理來源' },
      { n: 2, x: 735,  y: 188, t: 'AI（Groq）改寫成原創草稿' },
      { n: 3, x: 930,  y: 188, t: '過濾分數，寫進候選清單' },
      { n: 4, x: 1150, y: 216, t: 'LINE 通知你有新候選' },
    ],
  },
  b: {
    raw: 'blog-drafts/11-engineer-mindset/images/_news-b-raw.png',
    out: 'blog-drafts/11-engineer-mindset/images/news-workflow-b.jpg',
    W: 1438, H: 485,
    boxes: [
      { x: 120,  y: 113, w: 342, h: 78 },  // 每10分鐘+取Token+挑帳號
      { x: 515,  y: 113, w: 212, h: 78 },  // 讀候選+挑核准的（人在迴路閘門）
      { x: 778,  y: 113, w: 340, h: 78 },  // 組網址+建容器+發布貼文
      { x: 1175, y: 113, w: 208, h: 78 },  // 整理更新+標記已發
    ],
    labels: [
      { n: 1, x: 125,  y: 86,  t: '每 10 分鐘自動檢查一次' },
      { n: 2, x: 500,  y: 196, t: '只挑你改成「核准」的那幾則' },
      { n: 3, x: 790,  y: 196, t: '自動建立貼文、發到 Threads' },
      { n: 4, x: 1130, y: 214, t: '標記已發，不會重複發' },
    ],
  },
}

const c = CFG[which]
const RAW = path.resolve(c.raw)
const OUT = path.resolve(c.out)
const b64 = fs.readFileSync(RAW).toString('base64')

const boxEls = c.boxes.map(b =>
  `<div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;"></div>`
).join('')
const labelEls = c.labels.map(l =>
  `<div class="pill" style="left:${l.x}px;top:${l.y}px;"><span class="num">${l.n}</span>${l.t}</div>`
).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${c.W}px; height:${c.H}px; position:relative; overflow:hidden;
  font-family:'Microsoft JhengHei','Segoe UI',sans-serif; }
img.shot { display:block; width:${c.W}px; height:${c.H}px; }
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
const page = await browser.newPage({ viewport: { width: c.W, height: c.H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: OUT.replace(/\.jpg$/, '.png') })
// 轉 jpg 縮檔
const sharp = (await import('sharp')).default
await sharp(OUT.replace(/\.jpg$/, '.png')).jpeg({ quality: 90 }).toFile(OUT)
fs.unlinkSync(OUT.replace(/\.jpg$/, '.png'))
await browser.close()
console.log('OK', OUT)
