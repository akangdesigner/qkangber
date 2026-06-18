// 產生「人在迴路 AI 寫作流程」四關示意圖（概念圖，非截圖）。
// 用法：node scripts/make-hitl-flow.mjs
import path from 'path'
import { chromium } from 'playwright'

const OUT = path.resolve('blog-drafts/11-engineer-mindset/images/human-in-loop-flow.jpg')
const W = 1240, H = 560

const STEPS = [
  { n: '01', name: '關鍵字', ai: 'AI 提一批關鍵字', human: '你挑真的有人搜的' },
  { n: '02', name: '標題',   ai: 'AI 想幾個標題',   human: '你選讀者會搜的' },
  { n: '03', name: '大綱',   ai: 'AI 排 H2／H3',    human: '你定骨架對不對' },
  { n: '04', name: '下筆',   ai: 'AI 補成段落',     human: '你逐段改、補經驗' },
]

const cards = STEPS.map((s, i) => `
  <div class="card">
    <div class="cap"><span class="num">${s.n}</span><span class="name">${s.name}</span></div>
    <div class="ai"><span class="ico">🤖</span><span>${s.ai}</span></div>
    <div class="down">↓</div>
    <div class="gate"><span class="check">✓</span><span>${s.human}</span></div>
  </div>
  ${i < STEPS.length - 1 ? '<div class="arrow">›</div>' : '<div class="arrow done">›</div>'}
`).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${W}px; height:${H}px; background:#faf7f2;
  font-family:'Microsoft JhengHei','Segoe UI',sans-serif; padding:46px 40px; }
.head { text-align:center; margin-bottom:34px; }
.head h2 { font-size:27px; color:#1f2430; font-weight:800; letter-spacing:.5px; }
.head h2 b { color:#c0392b; }
.head p { font-size:15px; color:#7a8190; margin-top:9px; }
.row { display:flex; align-items:stretch; justify-content:center; gap:0; }
.card { width:236px; background:#fff; border:1px solid #e7e1d7; border-radius:16px;
  box-shadow:0 6px 18px rgba(60,50,40,0.07); padding:20px 18px 22px; display:flex; flex-direction:column; }
.cap { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.num { font:800 13px/1 'Segoe UI',sans-serif; color:#c0392b; background:#fbeae7;
  padding:5px 8px; border-radius:7px; letter-spacing:1px; }
.name { font-size:21px; font-weight:800; color:#1f2430; }
.ai { display:flex; align-items:center; gap:9px; background:#f4f6fa; border-radius:10px;
  padding:13px 14px; font-size:15px; color:#3a4250; }
.ai .ico { font-size:18px; }
.down { text-align:center; color:#c9b9a6; font-size:20px; margin:7px 0; }
.gate { display:flex; align-items:center; gap:9px; background:#fbeae7; border:1.5px solid #e7a79c;
  border-radius:10px; padding:13px 14px; font-size:15px; font-weight:700; color:#9c2a1e; }
.gate .check { display:inline-flex; width:21px; height:21px; flex:0 0 auto; align-items:center; justify-content:center;
  background:#c0392b; color:#fff; border-radius:50%; font-size:13px; font-weight:700; }
.arrow { display:flex; align-items:center; color:#d8cfc1; font:300 40px/1 'Segoe UI',sans-serif; padding:0 6px; }
.arrow.done { color:#c0392b; }
.foot { text-align:center; margin-top:30px; font-size:14px; color:#8a909c; }
.foot b { color:#c0392b; }
</style></head><body>
  <div class="head">
    <h2>人在迴路的 AI 寫作流程：每一關 <b>你點頭才往下</b></h2>
    <p>AI 負責生成、你負責判斷 —— 不是一條龍自動跑完，而是逐關把關</p>
  </div>
  <div class="row">${cards}</div>
  <div class="foot">方向歪掉的當下就攔住，而不是等成品出來才發現 <b>沒人看</b></div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: OUT.replace(/\.jpg$/, '.png') })
const sharp = (await import('sharp')).default
await sharp(OUT.replace(/\.jpg$/, '.png')).jpeg({ quality: 92 }).toFile(OUT)
;(await import('fs')).unlinkSync(OUT.replace(/\.jpg$/, '.png'))
await browser.close()
console.log('OK', OUT)
