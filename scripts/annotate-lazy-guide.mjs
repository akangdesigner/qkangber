// Threads「Claude Design 懶人使用法」指示圖：在 Dribbble 與 Claude Design 截圖上標紅框＋步驟編號。
// 用法：node scripts/annotate-lazy-guide.mjs
// 輸出：blog-drafts/06-claude-code-web-design/threads/step1-dribbble.png、step2-claude-design.png
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const IMAGES = path.resolve('blog-drafts/06-claude-code-web-design/images')
const OUT_DIR = path.resolve('blog-drafts/06-claude-code-web-design/threads')
fs.mkdirSync(OUT_DIR, { recursive: true })

const JOBS = [
  {
    src: 'dribbble-reference.png', out: 'step1-dribbble.png', w: 1512, h: 688,
    boxes: [
      { n: 1, x: 162, y: 14, w: 466, h: 58, r: 29 },    // 搜尋框：搜元素關鍵字
      { n: 2, x: 1100, y: 242, w: 130, h: 50, r: 14 },  // Web Design 分頁
      { n: 3, x: 68, y: 312, w: 322, h: 248, r: 14 },   // 挑一張看上眼的
    ],
  },
  {
    src: '02-claude-design-canvas.png', out: 'step2-claude-design.png', w: 1512, h: 685,
    boxes: [
      { n: 4, x: 8, y: 545, w: 364, h: 105, r: 14 },    // 對話框：貼截圖＋連結＋敘述
      { n: 5, x: 515, y: 150, w: 975, h: 520, r: 14 },  // 右側方案任你挑
    ],
  },
]

const browser = await chromium.launch()
for (const job of JOBS) {
  const b64 = fs.readFileSync(path.join(IMAGES, job.src)).toString('base64')
  const overlays = job.boxes.map(b => {
    const bx = b.x - 30 < 4 ? b.x + 6 : b.x - 30
    const by = Math.max(b.y + b.h / 2 - 12, 4)
    return `
    <div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${b.r}px;"></div>
    <div class="badge" style="left:${bx}px;top:${by}px;">${b.n}</div>`
  }).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${job.w}px; height:${job.h}px; position:relative; overflow:hidden; }
  img.shot { display:block; width:${job.w}px; height:${job.h}px; }
  .box { position:absolute; border:3px solid #e60023; box-shadow:0 0 0 1.5px rgba(255,255,255,0.85), inset 0 0 0 1.5px rgba(255,255,255,0.85); }
  .badge { position:absolute; width:24px; height:24px; border-radius:50%; background:#e60023; color:#fff;
    font:700 14px/24px 'Segoe UI',sans-serif; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.35); z-index:2; }
  </style></head><body><img class="shot" src="data:image/png;base64,${b64}">${overlays}</body></html>`

  const page = await browser.newPage({ viewport: { width: job.w, height: job.h }, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(OUT_DIR, job.out) })
  await page.close()
  console.log('OK', job.out)
}
await browser.close()
