// AI 味網站粗暴大賞 v2：6 種「不同流派」的 AI 公版 landing page 並截圖。
// 用法：node scripts/gen-ai-slop-gallery.mjs
// 輸出：blog-drafts/06-claude-code-web-design/_ai-slop-gallery/*.html + *.png
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const OUT_DIR = 'blog-drafts/06-claude-code-web-design/_ai-slop-gallery'
fs.mkdirSync(OUT_DIR, { recursive: true })

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">`
const BASE = `* { margin:0; padding:0; box-sizing:border-box; } body { font-family:'Inter','Noto Sans TC',sans-serif; min-height:100vh; overflow:hidden; }`

const SITES = []

// ── 流派 1：深色紫光 SaaS（經典款）──────────────────────────
SITES.push({ file: '01-dark-saas', html: `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
body { background:#0a0a12; color:#e2e8f0; position:relative; }
body::before { content:''; position:absolute; inset:0; background:radial-gradient(60% 50% at 50% 0%, rgba(124,92,255,0.28) 0%, transparent 70%), radial-gradient(40% 40% at 80% 30%, rgba(59,130,246,0.18) 0%, transparent 70%); pointer-events:none; }
nav { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; max-width:1180px; margin:0 auto; padding:22px 32px; }
.logo { display:flex; align-items:center; gap:10px; font-weight:700; font-size:18px; color:#fff; }
.logo .dot { width:26px; height:26px; border-radius:8px; background:linear-gradient(135deg,#7c5cff,#3b82f6); }
.nav-links { display:flex; gap:28px; font-size:14px; color:#94a3b8; }
.nav-cta { background:linear-gradient(135deg,#7c5cff,#3b82f6); color:#fff; padding:9px 18px; border-radius:12px; font-size:14px; font-weight:600; border:none; }
.hero { position:relative; z-index:2; max-width:820px; margin:64px auto 0; text-align:center; padding:0 24px; }
.badge { display:inline-flex; padding:7px 16px; border-radius:999px; background:rgba(124,92,255,0.1); border:1px solid rgba(124,92,255,0.25); font-size:13px; color:#c4b5fd; margin-bottom:28px; }
h1 { font-size:62px; line-height:1.1; font-weight:800; color:#fff; margin-bottom:24px; }
h1 .grad { background:linear-gradient(90deg,#a78bfa,#60a5fa,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.sub { font-size:19px; line-height:1.7; color:#94a3b8; max-width:560px; margin:0 auto 36px; }
.btns { display:flex; gap:14px; justify-content:center; margin-bottom:72px; }
.bp { background:linear-gradient(135deg,#7c5cff,#3b82f6); color:#fff; padding:15px 30px; border-radius:14px; font-size:15px; font-weight:600; border:none; box-shadow:0 12px 32px rgba(124,92,255,0.4); }
.bg2 { background:rgba(255,255,255,0.04); color:#e2e8f0; border:1px solid rgba(255,255,255,0.12); padding:15px 30px; border-radius:14px; font-size:15px; font-weight:600; }
.cards { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; max-width:1080px; margin:0 auto; padding:0 24px; }
.card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:28px; }
.ic { width:46px; height:46px; border-radius:12px; background:rgba(124,92,255,0.12); display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
.card h3 { font-size:18px; font-weight:600; color:#fff; margin-bottom:8px; }
.card p { font-size:14px; line-height:1.65; color:#94a3b8; }
svg { stroke:#a78bfa; }
</style></head><body>
<nav><div class="logo"><span class="dot"></span> MoneyFlow</div><div class="nav-links"><span>功能</span><span>方案</span><span>客戶案例</span><span>關於</span></div><button class="nav-cta">開始使用</button></nav>
<section class="hero"><span class="badge">✨ AI 驅動的智慧記帳</span><h1>用 AI 掌握<br><span class="grad">你的每一筆錢</span></h1><p class="sub">強大、直覺、好上手。讓記帳不再是負擔，把繁瑣交給自動化。</p><div class="btns"><button class="bp">免費開始 →</button><button class="bg2">預約展示</button></div></section>
<section class="cards">
<div class="card"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div><h3>快速高效</h3><p>毫秒級同步你的每一筆消費，不再等待。</p></div>
<div class="card"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div><h3>安全可靠</h3><p>銀行級的資料保護，讓你安心託付財務。</p></div>
<div class="card"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg></div><h3>數據洞察</h3><p>即時儀表板，把每一個消費決策建立在數據之上。</p></div>
</section></body></html>` })

// ── 流派 2：淺色乾淨 SaaS（假瀏覽器 mockup + trusted-by）─────
SITES.push({ file: '02-light-saas', html: `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
body { background:#ffffff; color:#0f172a; }
nav { display:flex; align-items:center; justify-content:space-between; max-width:1180px; margin:0 auto; padding:20px 32px; }
.logo { display:flex; align-items:center; gap:9px; font-weight:700; font-size:18px; }
.logo .dot { width:24px; height:24px; border-radius:7px; background:#2563eb; }
.nav-links { display:flex; gap:26px; font-size:14px; color:#64748b; }
.nav-cta { background:#2563eb; color:#fff; padding:9px 20px; border-radius:10px; font-size:14px; font-weight:600; border:none; }
.hero { max-width:760px; margin:56px auto 0; text-align:center; padding:0 24px; }
.badge { display:inline-flex; padding:6px 14px; border-radius:999px; background:#eff6ff; color:#2563eb; font-size:13px; font-weight:600; margin-bottom:24px; }
h1 { font-size:54px; line-height:1.15; font-weight:800; letter-spacing:-0.02em; margin-bottom:20px; }
h1 .blue { color:#2563eb; }
.sub { font-size:18px; line-height:1.7; color:#64748b; max-width:540px; margin:0 auto 32px; }
.btns { display:flex; gap:12px; justify-content:center; margin-bottom:28px; }
.bp { background:#2563eb; color:#fff; padding:14px 28px; border-radius:10px; font-size:15px; font-weight:600; border:none; }
.bg2 { background:#fff; color:#0f172a; border:1px solid #e2e8f0; padding:14px 28px; border-radius:10px; font-size:15px; font-weight:600; }
.trust { font-size:13px; color:#94a3b8; margin-bottom:14px; }
.logos { display:flex; gap:36px; justify-content:center; align-items:center; margin-bottom:44px; }
.lg { width:96px; height:22px; border-radius:5px; background:#e2e8f0; }
.mock { max-width:920px; margin:0 auto; border:1px solid #e2e8f0; border-radius:16px 16px 0 0; box-shadow:0 24px 60px rgba(15,23,42,0.10); overflow:hidden; }
.mbar { display:flex; gap:7px; padding:13px 16px; background:#f8fafc; border-bottom:1px solid #e2e8f0; }
.mdot { width:11px; height:11px; border-radius:50%; }
.mbody { display:flex; }
.mside { width:200px; padding:18px; border-right:1px solid #f1f5f9; }
.msl { height:11px; border-radius:6px; background:#f1f5f9; margin-bottom:12px; }
.mmain { flex:1; padding:18px; }
.mrow { display:flex; gap:14px; margin-bottom:14px; }
.mcardx { flex:1; height:74px; border-radius:10px; background:#f8fafc; border:1px solid #f1f5f9; }
.mchart { height:120px; border-radius:10px; background:linear-gradient(180deg,#eff6ff,#fff); border:1px solid #f1f5f9; }
</style></head><body>
<nav><div class="logo"><span class="dot"></span> LawBot</div><div class="nav-links"><span>產品</span><span>解決方案</span><span>定價</span><span>資源</span></div><button class="nav-cta">免費試用</button></nav>
<section class="hero"><span class="badge">🚀 LawBot 2.0 全新上線</span><h1>讓 AI 看懂<span class="blue">每一份合約</span></h1><p class="sub">3 分鐘完成合約審閱，揪出隱藏風險條款。法務團隊的效率，從未如此簡單。</p><div class="btns"><button class="bp">免費開始使用</button><button class="bg2">觀看示範 ▶</button></div>
<p class="trust">受到 10,000+ 法務團隊信賴</p>
<div class="logos"><div class="lg"></div><div class="lg"></div><div class="lg"></div><div class="lg"></div><div class="lg"></div></div></section>
<div class="mock"><div class="mbar"><span class="mdot" style="background:#fda4af"></span><span class="mdot" style="background:#fde047"></span><span class="mdot" style="background:#86efac"></span></div>
<div class="mbody"><div class="mside"><div class="msl" style="width:80%"></div><div class="msl" style="width:60%"></div><div class="msl" style="width:70%"></div><div class="msl" style="width:50%"></div><div class="msl" style="width:65%"></div></div>
<div class="mmain"><div class="mrow"><div class="mcardx"></div><div class="mcardx"></div><div class="mcardx"></div></div><div class="mchart"></div></div></div></div>
</body></html>` })

// ── 流派 3：Bento 格子版 ─────────────────────────────────────
SITES.push({ file: '03-bento', html: `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
body { background:#fafaf9; color:#1c1917; }
.wrap { max-width:1080px; margin:0 auto; padding:28px 32px; }
nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:40px; }
.logo { font-weight:800; font-size:19px; }
.nav-cta { background:#1c1917; color:#fff; padding:9px 20px; border-radius:999px; font-size:14px; font-weight:600; border:none; }
.head { text-align:center; margin-bottom:36px; }
.badge { display:inline-flex; padding:6px 14px; border-radius:999px; background:#fff; border:1px solid #e7e5e4; font-size:13px; margin-bottom:18px; }
h1 { font-size:46px; font-weight:900; letter-spacing:-0.02em; }
h1 .grad { background:linear-gradient(90deg,#f97316,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.bento { display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:128px; gap:16px; }
.bx { background:#fff; border:1px solid #e7e5e4; border-radius:22px; padding:22px; position:relative; overflow:hidden; }
.b1 { grid-column:span 2; grid-row:span 2; background:linear-gradient(135deg,#fff7ed,#fdf2f8); }
.b1 .emoji { font-size:54px; margin-bottom:12px; }
.b1 h3 { font-size:22px; font-weight:800; margin-bottom:8px; }
.b1 p { font-size:14px; color:#78716c; line-height:1.6; }
.num { font-size:38px; font-weight:900; background:linear-gradient(90deg,#f97316,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.lbl { font-size:13px; color:#78716c; margin-top:4px; }
.b4 { grid-row:span 2; }
.bar { height:9px; border-radius:6px; background:#f5f5f4; margin-top:12px; position:relative; }
.bar i { position:absolute; inset:0; width:var(--w); border-radius:6px; background:linear-gradient(90deg,#f97316,#ec4899); }
.b6 { grid-column:span 2; background:#1c1917; color:#fff; display:flex; align-items:center; justify-content:space-between; }
.b6 h3 { font-size:19px; font-weight:700; }
.b6 button { background:#fff; color:#1c1917; padding:10px 22px; border-radius:999px; font-weight:700; font-size:14px; border:none; }
</style></head><body><div class="wrap">
<nav><div class="logo">🐾 PawCare</div><button class="nav-cta">下載 App</button></nav>
<div class="head"><span class="badge">🐶 毛孩爸媽都在用</span><h1>毛孩健康，<span class="grad">AI 全都記</span></h1></div>
<div class="bento">
<div class="bx b1"><div class="emoji">🐾</div><h3>智慧健康追蹤</h3><p>從飲食、散步到睡眠，AI 自動幫你記錄毛孩的每一天，異常立刻提醒。</p></div>
<div class="bx"><div class="num">98%</div><div class="lbl">飼主滿意度</div></div>
<div class="bx"><div class="num">50k+</div><div class="lbl">毛孩使用中</div></div>
<div class="bx b4"><h3 style="font-size:15px;font-weight:700;margin-bottom:4px;">本週活動量</h3><div class="bar"><i style="--w:82%"></i></div><div class="bar"><i style="--w:64%"></i></div><div class="bar"><i style="--w:91%"></i></div><div class="bar"><i style="--w:45%"></i></div><div class="bar"><i style="--w:73%"></i></div></div>
<div class="bx"><div class="num">24/7</div><div class="lbl">AI 健康守護</div></div>
<div class="bx"><div class="num">3 秒</div><div class="lbl">完成一筆記錄</div></div>
<div class="bx b6"><h3>準備好寵愛升級了嗎？</h3><button>免費開始 →</button></div>
</div></div></body></html>` })

// ── 流派 4：玻璃擬態 + 漸層霧底 ──────────────────────────────
SITES.push({ file: '04-glass', html: `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
body { background:#3b0764; position:relative; color:#fff; }
body::before { content:''; position:absolute; inset:0; background:radial-gradient(45% 55% at 20% 25%, rgba(236,72,153,0.55) 0%, transparent 70%), radial-gradient(50% 50% at 85% 20%, rgba(249,115,22,0.45) 0%, transparent 70%), radial-gradient(55% 55% at 60% 90%, rgba(59,130,246,0.5) 0%, transparent 70%); }
nav { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; max-width:1120px; margin:0 auto; padding:22px 32px; }
.logo { font-weight:800; font-size:19px; }
.pill { background:rgba(255,255,255,0.14); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:9px 20px; border-radius:999px; font-size:14px; font-weight:600; }
.glass { position:relative; z-index:2; max-width:680px; margin:64px auto 36px; background:rgba(255,255,255,0.1); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.22); border-radius:28px; padding:52px 48px; text-align:center; box-shadow:0 24px 80px rgba(0,0,0,0.25); }
.badge { display:inline-flex; padding:6px 16px; border-radius:999px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); font-size:13px; margin-bottom:22px; }
h1 { font-size:48px; font-weight:900; line-height:1.15; margin-bottom:18px; }
.sub { font-size:17px; line-height:1.7; color:rgba(255,255,255,0.85); margin-bottom:30px; }
.bp { background:#fff; color:#3b0764; padding:15px 34px; border-radius:999px; font-size:15px; font-weight:800; border:none; }
.row { position:relative; z-index:2; display:flex; gap:18px; max-width:920px; margin:0 auto; padding:0 24px; }
.gc { flex:1; background:rgba(255,255,255,0.08); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.18); border-radius:20px; padding:22px; text-align:center; }
.gc .e { font-size:30px; margin-bottom:10px; }
.gc h3 { font-size:15px; font-weight:700; margin-bottom:5px; }
.gc p { font-size:13px; color:rgba(255,255,255,0.75); line-height:1.6; }
</style></head><body>
<nav><div class="logo">☕ BrewLab</div><button class="pill">加入會員</button></nav>
<div class="glass"><span class="badge">✨ AI 精品咖啡訂閱</span><h1>每一杯，<br>都是為你挑的</h1><p class="sub">AI 風味演算法 × 職人烘焙。回答 5 個問題，下週開始喝到真正懂你的咖啡。</p><button class="bp">開始風味測驗 →</button></div>
<div class="row">
<div class="gc"><div class="e">🎯</div><h3>風味精準配對</h3><p>AI 從 200+ 風味標籤找出你的命定豆。</p></div>
<div class="gc"><div class="e">📦</div><h3>每月新鮮直送</h3><p>烘豆後 48 小時內出貨，鎖住最佳賞味期。</p></div>
<div class="gc"><div class="e">🔄</div><h3>越喝越懂你</h3><p>每次評分都讓下一袋更接近完美。</p></div>
</div></body></html>` })

// ── 流派 5：左右分欄粉彩款（✓ 清單 + 假手機框）───────────────
SITES.push({ file: '05-split-pastel', html: `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
body { background:#ecfdf5; color:#064e3b; }
nav { display:flex; align-items:center; justify-content:space-between; max-width:1140px; margin:0 auto; padding:22px 32px; }
.logo { display:flex; align-items:center; gap:9px; font-weight:800; font-size:19px; }
.logo .dot { width:26px; height:26px; border-radius:50%; background:#10b981; }
.nav-links { display:flex; gap:26px; font-size:14px; color:#047857; }
.nav-cta { background:#10b981; color:#fff; padding:10px 22px; border-radius:999px; font-size:14px; font-weight:700; border:none; }
.split { display:flex; align-items:center; gap:48px; max-width:1140px; margin:40px auto 0; padding:0 32px; }
.left { flex:1.15; }
.badge { display:inline-flex; padding:7px 16px; border-radius:999px; background:#d1fae5; color:#047857; font-size:13px; font-weight:700; margin-bottom:22px; }
h1 { font-size:50px; line-height:1.15; font-weight:900; letter-spacing:-0.02em; margin-bottom:18px; }
h1 .grad { background:linear-gradient(90deg,#10b981,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.sub { font-size:17px; line-height:1.7; color:#047857; margin-bottom:24px; max-width:440px; }
.checks { list-style:none; margin-bottom:30px; }
.checks li { display:flex; align-items:center; gap:10px; font-size:15px; font-weight:600; margin-bottom:12px; }
.ck { width:22px; height:22px; border-radius:50%; background:#10b981; color:#fff; font-size:13px; display:flex; align-items:center; justify-content:center; }
.bp { background:#10b981; color:#fff; padding:16px 34px; border-radius:14px; font-size:16px; font-weight:800; border:none; box-shadow:0 14px 30px rgba(16,185,129,0.35); }
.note { font-size:13px; color:#34d399; margin-top:12px; }
.right { flex:1; display:flex; justify-content:center; }
.phone { width:280px; height:540px; background:#fff; border-radius:38px; border:1px solid #d1fae5; box-shadow:0 30px 70px rgba(6,78,59,0.15); padding:18px; }
.ph { height:44px; border-radius:14px; background:#ecfdf5; margin-bottom:14px; display:flex; align-items:center; padding:0 14px; font-size:13px; font-weight:800; color:#10b981; }
.pc { height:86px; border-radius:16px; background:#f0fdf4; border:1px solid #d1fae5; margin-bottom:12px; padding:14px; }
.pl { height:10px; border-radius:6px; background:#d1fae5; margin-bottom:8px; }
.ring { width:130px; height:130px; margin:10px auto; border-radius:50%; background:conic-gradient(#10b981 0 72%, #ecfdf5 72% 100%); display:flex; align-items:center; justify-content:center; }
.ring i { width:96px; height:96px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; font-style:normal; font-weight:900; font-size:22px; color:#10b981; }
</style></head><body>
<nav><div class="logo"><span class="dot"></span> FitGenius</div><div class="nav-links"><span>課表</span><span>方案</span><span>學員見證</span></div><button class="nav-cta">下載 App</button></nav>
<div class="split"><div class="left">
<span class="badge">💪 30 萬人的 AI 私人教練</span>
<h1>健身計畫，<br><span class="grad">AI 幫你排好了</span></h1>
<p class="sub">不用再煩惱今天練什麼。回答幾個問題，專屬課表自動生成，跟著做就對了。</p>
<ul class="checks"><li><span class="ck">✓</span>每日課表自動生成</li><li><span class="ck">✓</span>動作姿勢 AI 即時糾正</li><li><span class="ck">✓</span>飲食熱量一拍就記</li></ul>
<button class="bp">免費開始 7 天 →</button><div class="note">不需綁定信用卡 · 隨時取消</div>
</div><div class="right"><div class="phone"><div class="ph">今日訓練 💪</div><div class="ring"><i>72%</i></div><div class="pc"><div class="pl" style="width:70%"></div><div class="pl" style="width:45%"></div></div><div class="pc"><div class="pl" style="width:60%"></div><div class="pl" style="width:80%"></div></div></div></div></div>
</body></html>` })

// ── 流派 6：個人品牌 portfolio 公版 ──────────────────────────
SITES.push({ file: '06-portfolio', html: `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
body { background:#0f172a; color:#e2e8f0; position:relative; }
body::before { content:''; position:absolute; inset:0; background:radial-gradient(50% 40% at 50% 10%, rgba(56,189,248,0.16) 0%, transparent 70%); }
.wrap { position:relative; z-index:2; max-width:760px; margin:0 auto; text-align:center; padding:64px 24px 0; }
.avatar { width:108px; height:108px; border-radius:50%; background:linear-gradient(135deg,#38bdf8,#a78bfa); display:flex; align-items:center; justify-content:center; font-size:50px; margin:0 auto 22px; border:4px solid rgba(255,255,255,0.1); }
.hi { font-size:19px; color:#94a3b8; margin-bottom:10px; }
h1 { font-size:50px; font-weight:900; letter-spacing:-0.02em; color:#fff; margin-bottom:14px; }
h1 .grad { background:linear-gradient(90deg,#38bdf8,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.sub { font-size:17px; line-height:1.7; color:#94a3b8; max-width:520px; margin:0 auto 26px; }
.pills { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-bottom:34px; }
.pill { padding:8px 18px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); font-size:13px; font-weight:600; color:#cbd5e1; }
.btns { display:flex; gap:14px; justify-content:center; margin-bottom:44px; }
.bp { background:linear-gradient(135deg,#38bdf8,#a78bfa); color:#0f172a; padding:14px 30px; border-radius:14px; font-size:15px; font-weight:800; border:none; }
.bg2 { background:transparent; color:#e2e8f0; border:1px solid rgba(255,255,255,0.18); padding:14px 30px; border-radius:14px; font-size:15px; font-weight:600; }
.projs { position:relative; z-index:2; display:flex; gap:18px; max-width:880px; margin:0 auto; padding:0 24px; }
.pj { flex:1; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:18px; padding:22px; text-align:left; }
.thumb { height:108px; border-radius:12px; background:linear-gradient(135deg,rgba(56,189,248,0.25),rgba(167,139,250,0.25)); display:flex; align-items:center; justify-content:center; font-size:34px; margin-bottom:16px; }
.pj h3 { font-size:16px; font-weight:700; color:#fff; margin-bottom:6px; }
.pj p { font-size:13px; color:#94a3b8; line-height:1.6; }
</style></head><body><div class="wrap">
<div class="avatar">👨‍💻</div>
<p class="hi">Hi，我是阿哲 👋</p>
<h1>全端工程師 ×<br><span class="grad">AI 應用開發者</span></h1>
<p class="sub">熱愛把想法變成產品。專注於 Web 開發與 AI 整合，相信好的程式碼能改變世界。</p>
<div class="pills"><span class="pill">React</span><span class="pill">Next.js</span><span class="pill">TypeScript</span><span class="pill">Tailwind</span><span class="pill">Python</span><span class="pill">OpenAI API</span></div>
<div class="btns"><button class="bp">查看作品 →</button><button class="bg2">聯絡我</button></div>
</div>
<div class="projs">
<div class="pj"><div class="thumb">🤖</div><h3>AI 聊天機器人</h3><p>整合 GPT 的智慧客服系統，回覆準確率 95%。</p></div>
<div class="pj"><div class="thumb">📊</div><h3>數據儀表板</h3><p>即時視覺化平台，服務 1,000+ 活躍用戶。</p></div>
<div class="pj"><div class="thumb">🛒</div><h3>電商平台</h3><p>從零打造的全端電商，支援金流與庫存管理。</p></div>
</div></body></html>` })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 832 }, deviceScaleFactor: 2 })
for (const s of SITES) {
  const htmlPath = path.join(OUT_DIR, `${s.file}.html`)
  fs.writeFileSync(htmlPath, s.html)
  await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const pngPath = path.join(OUT_DIR, `${s.file}.png`)
  await page.screenshot({ path: pngPath })
  console.log('OK', pngPath)
}
await browser.close()
console.log('done:', SITES.length, '張')
