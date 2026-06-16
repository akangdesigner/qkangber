// 把真實工作流 自動抓threads(gT6O23nsZROHJhD6) 渲染成 n8n 風格節點圖（token 續期）
// 節點名＋連線取自 live workflow（n8n-mcp structure），不渲染任何憑證/token。
// 用法：node scripts/gen-n8n-token-shot.mjs
import path from 'path'
import sharp from 'sharp'
import { chromium } from 'playwright'

const OUT = path.resolve('blog-drafts/08-multi-platform-posting/images/token-refresh.jpg')
const W = 2560, H = 600, INK = '#2b3440', SUB = '#9aa3ad', LINE = '#b3bac4'

const TYPE = {
  scheduleTrigger: { c: '#8B5CF6', t: 'Schedule Trigger' },
  httpRequest:     { c: '#6B4FBB', t: 'HTTP Request' },
  filter:          { c: '#3F87F5', t: 'Filter' },
  code:            { c: '#FF6D5A', t: 'Code' },
}
const CW = 240, CH = 82, STEP = 312, Y = 290
const order = [
  ['每月1日排程', 'scheduleTrigger'],
  ['取得所有客戶', 'httpRequest'],
  ['過濾有 Threads Token', 'filter'],
  ['Refresh Threads Token', 'httpRequest'],
  ['確認 Refresh 成功', 'filter'],
  ['更新 Threads Token', 'httpRequest'],
  ['統計結果', 'code'],
  ['通知完成', 'httpRequest'],
]
const N = order.map(([name, type], i) => ({ name, type, x: 70 + i * STEP, y: Y }))

const card = (n) => {
  const ty = TYPE[n.type]
  return `<g>
    <rect x="${n.x}" y="${n.y}" width="${CW}" height="${CH}" rx="15" fill="#fff" stroke="#e3e6ea" stroke-width="1.4" filter="url(#sh)"/>
    <rect x="${n.x}" y="${n.y + 14}" width="6" height="${CH - 28}" rx="3" fill="${ty.c}"/>
    <circle cx="${n.x + 40}" cy="${n.y + CH / 2}" r="17" fill="${ty.c}" opacity="0.16"/>
    <circle cx="${n.x + 40}" cy="${n.y + CH / 2}" r="6.5" fill="${ty.c}"/>
    <text x="${n.x + 70}" y="${n.y + 35}" font-size="20" font-weight="700" fill="${INK}">${n.name}</text>
    <text x="${n.x + 70}" y="${n.y + 59}" font-size="15" fill="${SUB}">${ty.t}</text>
  </g>`
}
const edge = (a, b) => {
  const x1 = a.x + CW, y1 = a.y + CH / 2, x2 = b.x, y2 = b.y + CH / 2, mx = (x1 + x2) / 2
  return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" stroke="${LINE}" stroke-width="2.4" fill="none" marker-end="url(#arr)"/>`
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000" flood-opacity="0.07"/></filter>
  <marker id="arr" markerWidth="10" markerHeight="10" refX="7" refY="3.2" orient="auto"><path d="M0,0 L7,3.2 L0,6.4 Z" fill="${LINE}"/></marker>
  <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#e3e6ea"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="#f6f7f9"/>
<rect width="${W}" height="${H}" fill="url(#dots)"/>
<text x="60" y="70" font-size="34" font-weight="800" fill="${INK}">自動抓threads ── token 續期工作流：每月自動換新，不用手動顧</text>
${N.slice(0, -1).map((n, i) => edge(n, N[i + 1])).join('\n')}
${N.map(card).join('\n')}
<text x="60" y="${H - 38}" font-size="22" fill="#8a929c">每月 1 日自動跑：撈出所有客戶 → 篩出有 Threads token 的 → 跟平台換一張新的長期 token → 確認成功 → 寫回 → 統計後通知。</text>
</svg>`

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0}svg text{font-family:'Noto Sans TC',sans-serif}</style></head><body>${svg}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const png = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } })
await browser.close()
await sharp(png).resize(1800).jpeg({ quality: 92 }).toFile(OUT)
console.log('OK ->', OUT)
