// 在 33-claude-code-save-tokens 的三張 CLI 截圖上圈紅框＋編號。
// 用法：node scripts/annotate-33-save-tokens.mjs
// 輸入：桌面 1.png(/usage)、2.png(plan mode)、3.png(/context)
// 輸出：blog-drafts/33-claude-code-save-tokens/images/
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const SRC = 'C:/Users/asdto/OneDrive/桌面'
const OUTDIR = path.resolve('blog-drafts/33-claude-code-save-tokens/images')
fs.mkdirSync(OUTDIR, { recursive: true })

const JOBS = [
  {
    raw: `${SRC}/1.png`, out: '01-usage.png', w: 1169, h: 569,
    boxes: [
      // Total cost —— 照 API 牌價換算出來的金額
      { n: 1, x: 26, y: 130, w: 320, h: 24, badge: 'right' },
      // 兩條額度條 —— 訂閱用戶真正要看的
      { n: 2, x: 26, y: 243, w: 600, h: 132, badge: 'right' },
    ],
  },
  {
    raw: `${SRC}/3.png`, out: '02-context.png', w: 1160, h: 501,
    boxes: [
      // 目前總用量
      { n: 1, x: 444, y: 80, w: 202, h: 22, badge: 'left' },
      // System tools 已載入的工具說明
      { n: 2, x: 444, y: 151, w: 346, h: 21, badge: 'left' },
      // MCP tools 120 個工具但 0 tokens
      { n: 3, x: 38, y: 261, w: 352, h: 43, badge: 'right' },
    ],
  },
  {
    raw: `${SRC}/2.png`, out: '03-plan-mode.png', w: 1180, h: 572,
    boxes: [
      // 底部狀態列：plan mode on (shift+tab to cycle)
      { n: 1, x: 18, y: 539, w: 500, h: 26, badge: 'right' },
    ],
  },
]

const browser = await chromium.launch()

for (const job of JOBS) {
  const b64 = fs.readFileSync(path.resolve(job.raw)).toString('base64')
  const overlays = job.boxes.map(b => {
    const bx = b.badge === 'left' ? b.x - 30 : b.x + b.w + 6
    const by = b.y + b.h / 2 - 12
    return `
    <div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;"></div>
    <div class="badge" style="left:${bx}px;top:${by}px;">${b.n}</div>`
  }).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${job.w}px; height:${job.h}px; position:relative; overflow:hidden; }
img.shot { display:block; width:${job.w}px; height:${job.h}px; }
.box { position:absolute; border:2.5px solid #e60023; border-radius:6px;
  box-shadow:0 0 0 1.5px rgba(0,0,0,0.55), inset 0 0 0 1.5px rgba(0,0,0,0.55); }
.badge { position:absolute; width:24px; height:24px; border-radius:50%; background:#e60023; color:#fff;
  font:700 14px/24px 'Segoe UI',sans-serif; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.45); }
</style></head><body><img class="shot" src="data:image/png;base64,${b64}">${overlays}</body></html>`

  const page = await browser.newPage({ viewport: { width: job.w, height: job.h }, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)
  await page.screenshot({ path: path.join(OUTDIR, job.out) })
  await page.close()
  console.log('OK', job.out)
}

await browser.close()
