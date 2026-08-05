// 把 blog-drafts 的裸 HTML 草稿包上接近官網的深色版型，產生 _preview.html 方便校稿。
// 用法：node scripts/make-preview.mjs blog-drafts/32-claude-code-beginner-tips/32-claude-code-beginner-tips.html
import fs from 'node:fs'
import path from 'node:path'

const SRC = process.argv[2]
if (!SRC) { console.error('用法：node scripts/make-preview.mjs <草稿.html>'); process.exit(1) }
const src = path.resolve(SRC)
const html = fs.readFileSync(src, 'utf8')

const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''
const desc = html.match(/<meta name="description" content="([\s\S]*?)">/)?.[1] ?? ''
const body = html.match(/<body>([\s\S]*)<\/body>/)?.[1] ?? html

const out = path.join(path.dirname(src), '_preview.html')
fs.writeFileSync(out, `<!DOCTYPE html>
<html lang="zh-TW"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>預覽｜${title}</title>
<style>
  :root { --bg:#0b0c10; --fg:#e5e7eb; --muted:#9aa0aa; --line:#2a2d36; --accent:#a78bfa; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); line-height:1.9;
    font-family:"Microsoft JhengHei","PingFang TC",system-ui,sans-serif; font-size:17px; }
  .meta { max-width:820px; margin:0 auto; padding:28px 20px 0; color:var(--muted); font-size:13px;
    border-bottom:1px dashed var(--line); }
  .meta b { color:var(--accent); }
  main { max-width:820px; margin:0 auto; padding:8px 20px 80px; }
  h1 { font-size:32px; line-height:1.45; margin:32px 0 8px; }
  h2 { font-size:25px; line-height:1.5; margin:52px 0 14px; padding-bottom:10px; border-bottom:1px solid var(--line); }
  h3 { font-size:20px; margin:34px 0 10px; color:var(--accent); }
  p { margin:16px 0; }
  ul, ol { padding-left:1.4em; }
  li { margin:8px 0; }
  code { background:#1a1d26; padding:2px 7px; border-radius:5px; font-size:15px; color:#fbbf24; }
  figure { margin:26px 0; text-align:center; }
  img, svg { max-width:100%; height:auto; border-radius:10px; }
  figcaption { color:var(--muted); font-size:14px; margin-top:10px; }
  table { width:100%; border-collapse:collapse; margin:22px 0; font-size:15px; }
  th, td { border:1px solid var(--line); padding:10px 12px; text-align:left; }
  th { background:#161922; }
  a { color:var(--accent); }
  span[style*="c0392b"] { color:#fbbf24 !important; }
  div[style*="c0392b"] { border-color:#fbbf24 !important; }
  div[style*="c0392b"] a { border-color:#fbbf24 !important; color:#fbbf24 !important; }
</style></head>
<body>
<div class="meta">
  <div>title（${[...title].reduce((n, c) => n + (c.charCodeAt(0) > 255 ? 2 : 1), 0)} 半形寬）：<b>${title}</b></div>
  <div style="margin:6px 0 14px;">description（${[...desc].reduce((n, c) => n + (c.charCodeAt(0) > 255 ? 2 : 1), 0)} 半形寬）：${desc}</div>
</div>
<main>${body}</main>
</body></html>`)
console.log('OK', out)
