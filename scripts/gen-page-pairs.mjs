// 產生服務頁／電子報頁的 AI 公版反例，並與實頁截圖合成「上公版／下實頁」對比圖。
// 用法：node scripts/gen-page-pairs.mjs
// 輸出：images/07-services-before-after.png、images/08-newsletter-before-after.png
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const BASE_DIR = path.resolve('blog-drafts/06-claude-code-web-design')
const LIVE = path.join(BASE_DIR, '_live')
const IMAGES = path.join(BASE_DIR, 'images')

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">`
const BASE = `* { margin:0; padding:0; box-sizing:border-box; } body { font-family:'Inter','Noto Sans TC',sans-serif; min-height:100vh; overflow:hidden; }`

// ── AI 公版服務頁：置中漸層大標＋三張等寬服務卡 ──
const slopServices = `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
body { background:#0b0a14; color:#e2e8f0; position:relative; }
body::before { content:''; position:absolute; inset:0; background:radial-gradient(55% 45% at 50% 0%, rgba(124,92,255,0.25) 0%, transparent 70%); pointer-events:none; }
nav { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; max-width:1160px; margin:0 auto; padding:22px 32px; }
.logo { display:flex; align-items:center; gap:10px; font-weight:700; font-size:18px; color:#fff; }
.logo .dot { width:26px; height:26px; border-radius:8px; background:linear-gradient(135deg,#7c5cff,#3b82f6); }
.nav-links { display:flex; gap:26px; font-size:14px; color:#94a3b8; }
.nav-cta { background:linear-gradient(135deg,#7c5cff,#3b82f6); color:#fff; padding:9px 18px; border-radius:12px; font-size:14px; font-weight:600; border:none; }
.head { position:relative; z-index:2; max-width:720px; margin:48px auto 40px; text-align:center; padding:0 24px; }
.badge { display:inline-flex; padding:7px 16px; border-radius:999px; background:rgba(124,92,255,0.1); border:1px solid rgba(124,92,255,0.25); font-size:13px; color:#c4b5fd; margin-bottom:22px; }
h1 { font-size:52px; line-height:1.15; font-weight:900; color:#fff; margin-bottom:16px; }
h1 .grad { background:linear-gradient(90deg,#a78bfa,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.sub { font-size:17px; line-height:1.7; color:#94a3b8; }
.cards { position:relative; z-index:2; display:grid; grid-template-columns:repeat(3,1fr); gap:22px; max-width:1100px; margin:0 auto; padding:0 24px; }
.card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:30px; text-align:left; }
.ic { width:48px; height:48px; border-radius:12px; background:rgba(124,92,255,0.12); display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:18px; }
.card h3 { font-size:19px; font-weight:700; color:#fff; margin-bottom:14px; }
.card li { list-style:none; display:flex; gap:8px; font-size:14px; color:#94a3b8; margin-bottom:10px; }
.card li::before { content:'✓'; color:#a78bfa; font-weight:700; }
.card button { width:100%; margin-top:14px; background:rgba(124,92,255,0.12); border:1px solid rgba(124,92,255,0.3); color:#c4b5fd; padding:11px 0; border-radius:12px; font-size:14px; font-weight:600; }
</style></head><body>
<nav><div class="logo"><span class="dot"></span> SmartFlow</div><div class="nav-links"><span>首頁</span><span>服務</span><span>案例</span><span>關於</span></div><button class="nav-cta">聯絡我們</button></nav>
<div class="head"><span class="badge">✦ 專業服務</span><h1>我們的<span class="grad">專業服務</span></h1><p class="sub">一站式解決方案，助您的企業數位轉型，提升效率、降低成本。</p></div>
<div class="cards">
<div class="card"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div><h3>流程自動化導入</h3><ul><li>需求分析與規劃</li><li>系統整合串接</li><li>自動化流程建置</li></ul><button>了解更多 →</button></div>
<div class="card"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg></div><h3>AI 應用開發</h3><ul><li>客製化 AI 解決方案</li><li>智慧客服機器人</li><li>數據分析儀表板</li></ul><button>了解更多 →</button></div>
<div class="card"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></div><h3>顧問諮詢服務</h3><ul><li>數位轉型策略</li><li>技術選型建議</li><li>團隊教育訓練</li></ul><button>了解更多 →</button></div>
</div></body></html>`

// ── AI 公版電子報頁：置中訂閱卡＋漸層按鈕＋社會證明 ──
const slopNewsletter = `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
body { background:#0b0a14; color:#e2e8f0; position:relative; display:flex; align-items:center; justify-content:center; }
body::before { content:''; position:absolute; inset:0; background:radial-gradient(50% 50% at 50% 35%, rgba(124,92,255,0.22) 0%, transparent 70%); }
.box { position:relative; z-index:2; max-width:640px; width:100%; margin:0 24px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:26px; padding:56px 52px; text-align:center; }
.ic { width:76px; height:76px; border-radius:50%; background:linear-gradient(135deg,rgba(124,92,255,0.25),rgba(59,130,246,0.25)); display:flex; align-items:center; justify-content:center; font-size:34px; margin:0 auto 24px; }
h1 { font-size:40px; font-weight:900; color:#fff; margin-bottom:14px; }
h1 .grad { background:linear-gradient(90deg,#a78bfa,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.sub { font-size:16px; line-height:1.7; color:#94a3b8; margin-bottom:30px; }
.row { display:flex; gap:12px; margin-bottom:18px; }
input { flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:15px 18px; font-size:15px; color:#e2e8f0; }
.btn { background:linear-gradient(135deg,#7c5cff,#3b82f6); color:#fff; padding:15px 28px; border-radius:14px; font-size:15px; font-weight:700; border:none; box-shadow:0 10px 26px rgba(124,92,255,0.4); white-space:nowrap; }
.proof { display:flex; align-items:center; justify-content:center; gap:12px; font-size:13px; color:#94a3b8; }
.avs { display:flex; }
.av { width:30px; height:30px; border-radius:50%; border:2px solid #0b0a14; margin-left:-8px; background:linear-gradient(135deg,#7c5cff,#3b82f6); }
.av:first-child { margin-left:0; }
</style></head><body>
<div class="box"><div class="ic"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div><h1>訂閱我們的<span class="grad">電子報</span></h1><p class="sub">獲取最新 AI 趨勢、自動化技巧與獨家內容，每週直送您的信箱。隨時可以取消訂閱。</p>
<div class="row"><input placeholder="輸入您的 Email"><button class="btn">立即訂閱 →</button></div>
<div class="proof"><div class="avs"><span class="av"></span><span class="av"></span><span class="av"></span><span class="av"></span></div>已有 10,000+ 訂閱者加入</div>
</div></body></html>`

const b64 = (p) => fs.readFileSync(p).toString('base64')

const PAIRS = [
  { name: '07-services-before-after', slop: slopServices, live: 'live-services.png', title: '服務頁' },
  { name: '08-newsletter-before-after', slop: slopNewsletter, live: 'live-newsletter.png', title: '電子報頁' },
]

const browser = await chromium.launch()
const shot = await browser.newPage({ viewport: { width: 1280, height: 832 }, deviceScaleFactor: 2 })

for (const pair of PAIRS) {
  // 1. 截公版
  await shot.setContent(pair.slop, { waitUntil: 'networkidle' })
  await shot.waitForTimeout(400)
  const slopPng = path.join(LIVE, `slop-${pair.name}.png`)
  await shot.screenshot({ path: slopPng })

  // 2. 上下合成＋標籤
  const compose = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500;900&display=swap" rel="stylesheet">
  <style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Noto Sans TC',sans-serif; background:#111317; padding:26px; width:1400px; }
  section { margin-bottom:26px; } section:last-child { margin-bottom:0; }
  .tag { display:inline-flex; padding:8px 20px; border-radius:999px; font-size:22px; font-weight:900; margin-bottom:12px; }
  .tag.bad { background:rgba(154,163,178,0.12); color:#9aa3b2; border:1.5px solid rgba(154,163,178,0.4); }
  .tag.good { background:rgba(251,191,36,0.12); color:#fbbf24; border:1.5px solid rgba(251,191,36,0.55); }
  .shot { border-radius:14px; overflow:hidden; border:1px solid rgba(255,255,255,0.12); box-shadow:0 10px 30px rgba(0,0,0,0.45); }
  .shot img { display:block; width:100%; }
  </style></head><body>
  <section><span class="tag bad">AI 公版${pair.title}</span><div class="shot"><img src="data:image/png;base64,${b64(slopPng)}"></div></section>
  <section><span class="tag good">aiqkangber.com 的${pair.title}</span><div class="shot"><img src="data:image/png;base64,${b64(path.join(LIVE, pair.live))}"></div></section>
  </body></html>`

  const comp = await browser.newPage({ viewport: { width: 1400, height: 400 }, deviceScaleFactor: 1 })
  await comp.setContent(compose, { waitUntil: 'networkidle' })
  await comp.waitForTimeout(400)
  await comp.screenshot({ path: path.join(IMAGES, `${pair.name}.png`), fullPage: true })
  await comp.close()
  console.log('OK', `${pair.name}.png`)
}
await browser.close()
