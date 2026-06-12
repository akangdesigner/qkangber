// 06 文章封面：左（AI 公版、去飽和）vs 右（aiqkangber 實站、鮮豔），斜切分割。
// 用法：node scripts/compose-cover.mjs
// 輸出：blog-drafts/06-claude-code-web-design/cover.jpg（直接覆蓋）
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const DIR = path.resolve('blog-drafts/06-claude-code-web-design/images')
const OUT_PNG = path.resolve('blog-drafts/06-claude-code-web-design/cover.png')
const W = 1600, H = 900

const b64 = (f) => fs.readFileSync(path.join(DIR, f)).toString('base64')

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700;900&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${W}px; height:${H}px; position:relative; overflow:hidden; background:#0a0a12; font-family:'Noto Sans TC',sans-serif; }
.half { position:absolute; top:0; height:100%; overflow:hidden; }
.half img { position:absolute; top:50%; transform:translateY(-50%); width:1000px; }
.left { left:0; width:52%; clip-path:polygon(0 0, 100% 0, calc(100% - 120px) 100%, 0 100%); }
.left img { left:-60px; filter:grayscale(0.92) brightness(0.62) contrast(0.9); }
.right { right:0; width:55%; clip-path:polygon(120px 0, 100% 0, 100% 100%, 0 100%); }
.right img { right:-40px; filter:saturate(1.15) brightness(1.02); }
.divider { position:absolute; top:-40px; left:calc(52% - 130px); width:10px; height:120%; background:linear-gradient(180deg,#fbbf24,#7c5cff); transform:rotate(7.6deg); transform-origin:top center; box-shadow:0 0 44px 10px rgba(251,191,36,0.45); z-index:3; }
.label { position:absolute; z-index:4; padding:10px 22px; border-radius:999px; font-size:26px; font-weight:900; letter-spacing:0.06em; backdrop-filter:blur(6px); }
.label.bad { left:44px; bottom:44px; background:rgba(10,10,18,0.72); color:#9aa3b2; border:1.5px solid rgba(154,163,178,0.45); }
.label.good { right:44px; bottom:44px; background:rgba(251,191,36,0.14); color:#fbbf24; border:1.5px solid rgba(251,191,36,0.65); box-shadow:0 0 26px rgba(251,191,36,0.25); }
.vignette { position:absolute; inset:0; z-index:2; pointer-events:none; background:radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.42) 100%); }
</style></head><body>
<div class="half left"><img src="data:image/png;base64,${b64('04-before-ai-generic.png')}"></div>
<div class="half right"><img src="data:image/png;base64,${b64('05-after-aiqkangber.png')}"></div>
<div class="divider"></div>
<div class="vignette"></div>
<div class="label bad">AI 味公版</div>
<div class="label good">有人做決定的設計</div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.screenshot({ path: OUT_PNG })
await browser.close()
console.log('OK', OUT_PNG)
