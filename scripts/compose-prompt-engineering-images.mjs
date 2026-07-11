// 把 21-prompt-engineering 的兩張左右對照截圖改成上下疊放，加大手機版可讀性。
// 用法：node scripts/compose-prompt-engineering-images.mjs
// 輸入：blog-drafts/21-prompt-engineering/images/_raw-{bad,good,code-bad,code-good}.png
// 輸出：blog-drafts/21-prompt-engineering/images/{bad-vs-good,point2-specific}.png（覆蓋）
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const DIR = path.resolve('blog-drafts/21-prompt-engineering/images')
const b64 = (f) => fs.readFileSync(path.join(DIR, f)).toString('base64')

const RAW_W = 1380
const CROP_X0 = 270 // 去掉左側導覽列
const CROP_W = RAW_W - CROP_X0 // 1110
const OUT_W = 1600
const S = OUT_W / CROP_W

const RAW_H = 860

function panel({ file, cropY1, box, num, label, labelColor }) {
  const outH = Math.round(cropY1 * S)
  const imgW = Math.round(RAW_W * S)
  const imgLeft = -Math.round(CROP_X0 * S)
  const bx = Math.round((box.x - CROP_X0) * S)
  const by = Math.round(box.y * S)
  const bw = Math.round(box.w * S)
  const bh = Math.round(box.h * S)
  return { file, outH, imgW, imgLeft, bx, by, bw, bh, num, label, labelColor }
}

function buildHtml(panels) {
  const body = panels.map((p, i) => `
    <div class="panel" style="width:${OUT_W}px;height:${p.outH}px;">
      <img class="shot" style="width:${p.imgW}px;left:${p.imgLeft}px;top:0;" src="data:image/png;base64,${b64(p.file)}">
      <div class="pill" style="background:${p.labelColor.bg};border-color:${p.labelColor.border};color:${p.labelColor.fg};">${p.label}</div>
      <div class="box" style="left:${p.bx}px;top:${p.by}px;width:${p.bw}px;height:${p.bh}px;"></div>
      <div class="badge" style="left:${p.bx - 34}px;top:${p.by + p.bh / 2 - 15}px;">${p.num}</div>
    </div>
    ${i < panels.length - 1 ? '<div class="divider"></div>' : ''}
  `).join('')

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${OUT_W}px; background:#05060a; font-family:'Noto Sans TC',sans-serif; }
.panel { position:relative; overflow:hidden; background:#0a0a12; }
.panel img.shot { position:absolute; left:0; top:0; display:block; }
.pill { position:absolute; left:24px; top:66px; padding:8px 18px; border-radius:999px; font-size:22px; font-weight:700; border:2px solid; z-index:5; }
.box { position:absolute; border:4px solid #e60023; border-radius:14px; box-shadow:0 0 0 2px rgba(255,255,255,0.85), inset 0 0 0 2px rgba(255,255,255,0.85); z-index:4; }
.badge { position:absolute; width:30px; height:30px; border-radius:50%; background:#e60023; color:#fff;
  font:700 18px/30px 'Segoe UI',sans-serif; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.4); z-index:6; }
.divider { height:10px; background:#05060a; }
</style></head><body>${body}</body></html>`
}

const browser = await chromium.launch()

async function render(panels, outFile) {
  const totalH = panels.reduce((s, p) => s + p.outH, 0) + (panels.length - 1) * 10
  const page = await browser.newPage({ viewport: { width: OUT_W, height: totalH }, deviceScaleFactor: 1 })
  await page.setContent(buildHtml(panels), { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(DIR, outFile) })
  console.log('OK', outFile, `${OUT_W}x${totalH}`)
}

const badGood = [
  panel({
    file: '_raw-bad.png', cropY1: 660,
    box: { x: 972, y: 60, w: 240, h: 50 }, num: 1,
    label: '① 爛提示詞', labelColor: { bg: 'rgba(10,10,18,0.72)', border: 'rgba(154,163,178,0.55)', fg: '#c7ccd6' },
  }),
  panel({
    file: '_raw-good.png', cropY1: 520,
    box: { x: 673, y: 68, w: 537, h: 86 }, num: 2,
    label: '② 好提示詞', labelColor: { bg: 'rgba(251,191,36,0.16)', border: 'rgba(251,191,36,0.7)', fg: '#fbbf24' },
  }),
]

const point2 = [
  panel({
    file: '_raw-code-bad.png', cropY1: 780,
    box: { x: 675, y: 64, w: 222, h: 54 }, num: 1,
    label: '① 模糊需求', labelColor: { bg: 'rgba(10,10,18,0.72)', border: 'rgba(154,163,178,0.55)', fg: '#c7ccd6' },
  }),
  panel({
    file: '_raw-code-good.png', cropY1: 780,
    box: { x: 681, y: 70, w: 516, h: 84 }, num: 2,
    label: '② 具體需求', labelColor: { bg: 'rgba(251,191,36,0.16)', border: 'rgba(251,191,36,0.7)', fg: '#fbbf24' },
  }),
]

await render(badGood, 'bad-vs-good.png')
await render(point2, 'point2-specific.png')

await browser.close()
