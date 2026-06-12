// 社畜行程表梗圖（Threads 用，4:5 直式）。
// 用法：node scripts/gen-schedule-meme.mjs
// 輸出：blog-drafts/06-claude-code-web-design/threads/schedule-meme.png
import path from 'path'
import { chromium } from 'playwright'

const OUT = path.resolve('blog-drafts/06-claude-code-web-design/threads/schedule-meme.png')

const html = `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1350px; background:#0d0f16; font-family:'Noto Sans TC',sans-serif; color:#e2e8f0; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
body::before { content:''; position:absolute; inset:0; background:radial-gradient(60% 40% at 50% 0%, rgba(124,92,255,0.16) 0%, transparent 70%); }
.card { position:relative; z-index:2; width:880px; background:#141826; border:1px solid rgba(255,255,255,0.09); border-radius:32px; padding:64px 60px; box-shadow:0 30px 80px rgba(0,0,0,0.5); }
.head { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:14px; }
h1 { font-size:52px; font-weight:900; color:#fff; }
.date { font-family:'JetBrains Mono',monospace; font-size:24px; color:#64748b; }
.sub { font-size:26px; color:#94a3b8; margin-bottom:44px; }
.row { display:flex; align-items:flex-start; gap:28px; padding:26px 0; border-bottom:1px dashed rgba(255,255,255,0.08); }
.row:last-of-type { border-bottom:none; }
.time { font-family:'JetBrains Mono',monospace; font-size:30px; font-weight:700; color:#7c8494; width:140px; flex-shrink:0; padding-top:3px; }
.what { font-size:32px; font-weight:500; line-height:1.45; }
.what small { display:block; font-size:23px; color:#64748b; margin-top:4px; font-weight:400; }
.row.hot .time { color:#fbbf24; }
.row.hot .what { color:#fbbf24; font-weight:700; }
.foot { margin-top:44px; padding-top:34px; border-top:1px solid rgba(255,255,255,0.09); font-size:28px; color:#94a3b8; line-height:1.6; }
.foot b { color:#fbbf24; font-weight:700; }
.batt { display:inline-flex; align-items:center; gap:10px; margin-top:18px; font-family:'JetBrains Mono',monospace; font-size:24px; color:#ef4444; }
.bshell { width:54px; height:26px; border:3px solid #ef4444; border-radius:6px; position:relative; }
.bshell::after { content:''; position:absolute; right:-9px; top:6px; width:6px; height:8px; background:#ef4444; border-radius:0 2px 2px 0; }
.bfill { position:absolute; left:3px; top:3px; bottom:3px; width:6px; background:#ef4444; }
</style></head><body>
<div class="card">
  <div class="head"><h1>今日行程</h1><span class="date">2026.06.13（五）</span></div>
  <p class="sub">自動化工程師的一天（諷刺的是行程完全沒被自動化）</p>
  <div class="row"><span class="time">08:30</span><div class="what">打卡上班<small>當個稱職的社畜</small></div></div>
  <div class="row"><span class="time">18:00</span><div class="what">下班壓線衝 n8n 企業內訓<small>白天做自動化，晚上教自動化</small></div></div>
  <div class="row"><span class="time">20:00</span><div class="what">一對一線上課教學<small>聲音要聽起來還有電</small></div></div>
  <div class="row"><span class="time">22:30</span><div class="what">寫 Claude Design 心得文<small>半夜寫自動化的文</small></div></div>
  <div class="row hot"><span class="time">02:00</span><div class="what">終於關機，準備躺平<small style="color:rgba(251,191,36,0.7)">明天再跟自己說要早點睡</small></div></div>
  <div class="foot">自動化來自動化去，<b>最不自動的是我本人</b><div class="batt"><span class="bshell"><span class="bfill"></span></span>4%　低電量模式</div></div>
</div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.screenshot({ path: OUT })
await browser.close()
console.log('OK', OUT)
