// 重製 Claude Code 介面範例：人在迴路的 AI 寫作流程（四關 + 真實改稿對話 + 工具箱）。
// 用法：node scripts/make-cc-hitl.mjs
import path from 'path'
import { chromium } from 'playwright'

const OUT = path.resolve('blog-drafts/11-engineer-mindset/images/human-in-loop-flow.jpg')
const W = 1200, H = 500

const GATES = [
  { name: '關鍵字', state: 'done' },
  { name: '標題',   state: 'done' },
  { name: '大綱',   state: 'now'  },
  { name: '下筆',   state: 'todo' },
]
const gateEls = GATES.map((g, i) => `
  <div class="gate ${g.state}">
    <span class="dot">${g.state === 'done' ? '✓' : g.state === 'now' ? '◉' : ''}</span>
    <span class="gname">${g.name}</span>
  </div>
  ${i < GATES.length - 1 ? '<span class="seg"></span>' : ''}
`).join('')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${W}px; height:${H}px; background:#f0ece4;
  font-family:'Microsoft JhengHei','Segoe UI',sans-serif; padding:30px 34px; }

.win { width:100%; height:100%; background:#1f1d1b; border-radius:14px; overflow:hidden;
  box-shadow:0 18px 50px rgba(40,30,20,0.28); display:flex; flex-direction:column; }

/* 視窗列 */
.bar { height:42px; background:#2a2725; display:flex; align-items:center; padding:0 16px; gap:8px;
  border-bottom:1px solid #38332f; }
.tl { width:12px; height:12px; border-radius:50%; }
.tl.r{background:#ff5f57} .tl.y{background:#febc2e} .tl.g{background:#28c840}
.bar .title { margin-left:12px; color:#b9b1a4; font-size:13px; font-weight:600; letter-spacing:.3px; }
.bar .title b { color:#d97757; }

/* 四關進度條 */
.gates { display:flex; align-items:center; padding:16px 26px; background:#252220; gap:6px;
  border-bottom:1px solid #34302c; }
.gate { display:flex; align-items:center; gap:8px; }
.gate .dot { width:22px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; }
.gate.done .dot { background:#3a7a4e; color:#fff; }
.gate.now  .dot { background:#d97757; color:#fff; box-shadow:0 0 0 4px rgba(217,119,87,0.22); }
.gate.todo .dot { background:transparent; border:2px dashed #5a534b; }
.gate .gname { font-size:15px; color:#8d867b; font-weight:700; }
.gate.done .gname { color:#cfc8bb; }
.gate.now  .gname { color:#f3ad93; }
.seg { flex:1; height:2px; background:#3a352f; }

/* 對話區 */
.body { flex:1; padding:22px 30px; color:#e9e3d7; font-size:15.5px; line-height:1.7; }
.msg { margin-bottom:16px; }
.a-mark { color:#d97757; font-weight:800; margin-right:9px; }
.a-text { color:#e7e1d5; }
.outline { margin:9px 0 4px 26px; color:#c6bfb2; font-size:14.5px; line-height:1.85; }
.outline b { color:#efe9dd; }
.u { background:#2c2926; border-left:3px solid #6b8aff; border-radius:0 8px 8px 0;
  padding:11px 15px; margin:4px 0 4px 0; color:#dfe3ea; }
.u .who { color:#8fa6ff; font-weight:700; margin-right:8px; }
.u .edit { color:#ffd7c7; font-weight:700; }

/* 底部工具箱註記 */
.foot { background:#252220; border-top:1px solid #34302c; padding:15px 30px; display:flex; align-items:center; gap:13px; }
.foot .pin { flex:0 0 auto; background:#d97757; color:#fff; font-size:12px; font-weight:800;
  padding:5px 11px; border-radius:7px; letter-spacing:.5px; }
.foot .ft { color:#b6aea1; font-size:14px; line-height:1.55; }
.foot .ft b { color:#f3ad93; }
.foot .ft .tool { color:#9fc9a8; font-weight:700; }
</style></head><body>
  <div class="win">
    <div class="bar">
      <span class="tl r"></span><span class="tl y"></span><span class="tl g"></span>
      <span class="title"><b>Claude Code</b> — 人在迴路的 AI 寫作流程</span>
    </div>

    <div class="gates">${gateEls}</div>

    <div class="body">
      <div class="msg">
        <span class="a-mark">●</span><span class="a-text">大綱排好了，H2 這樣切你看可以嗎？</span>
        <div class="outline">
          ① 我做過一條全自動寫文工作流<br>
          ② 全自動跑出來的，下場是沒人看<br>
          ③ 我決定回來跟 AI 一起寫<br>
          ④ 寫 code 也一樣：把判斷交出去，吃過大虧
        </div>
      </div>

      <div class="u">
        <span class="who">你</span><span class="edit">標題太技術，改從「會不會被取代」的痛點切。</span>
        ④ 那段要放串珠的真實 code 細節，待會我開工具箱自己補。
      </div>

      <div class="msg" style="margin-top:14px;">
        <span class="a-mark">●</span><span class="a-text">收到。標題改成痛點切入；④ 先標「待補真實細節」，動筆後你在 html-editor 逐段改、補經驗和截圖。</span>
      </div>
    </div>

    <div class="foot">
      <span class="pin">人在迴路</span>
      <span class="ft">不是只按一下核准 —— <b>每一關我都在改標題、改大綱、給方向</b>，草稿最後還會進我自己的 <span class="tool">html-editor 工具箱</span>逐段潤過才上站。</span>
    </div>
  </div>
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
