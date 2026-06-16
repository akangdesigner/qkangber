// 把真實工作流 ai自動發文api(M0cDq21cWnBjAQgB) 的結構渲染成 n8n 風格節點圖（多平台串接）
// 節點名＋連線取自 live workflow（n8n-mcp structure），不渲染任何憑證/token/試算表 ID。
// 用法：node scripts/gen-n8n-workflow-shot.mjs
import path from 'path'
import sharp from 'sharp'
import { chromium } from 'playwright'

const OUT = path.resolve('blog-drafts/08-multi-platform-posting/images/n8n-workflow.jpg')
const W = 3040, H = 720
const INK = '#2b3440', SUB = '#9aa3ad', LINE = '#b3bac4'

const TYPE = {
  code:        { c: '#FF6D5A', t: 'Code' },
  googleSheets:{ c: '#0F9D58', t: 'Google Sheets' },
  set:         { c: '#3F87F5', t: 'Edit Fields' },
  httpRequest: { c: '#6B4FBB', t: 'HTTP Request' },
  wait:        { c: '#E8973A', t: 'Wait' },
  merge:       { c: '#14B8A6', t: 'Merge' },
}
// [name, type, x, y]（readable 版面，非 n8n 原座標；拓樸完全照真實）
const CW = 222, CH = 80
const N = {
  sheet:  ['貼上客戶社群文章表單', 'googleSheets', 60, 360],
  pull:   ['抓最新一篇', 'code', 380, 360],
  token:  ['發文token', 'set', 700, 360],
  fb:     ['fb發文', 'httpRequest', 1020, 255],
  igid:   ['抓ig的id', 'httpRequest', 1305, 255],
  igc:    ['IG 建立媒體容器', 'httpRequest', 1590, 255],
  igw:    ['Wait IG Media', 'wait', 1875, 255],
  ig:     ['IG發文', 'httpRequest', 2160, 255],
  thc:    ['Threads 建立容器', 'httpRequest', 1020, 465],
  thw:    ['Wait Threads Media', 'wait', 1305, 465],
  th:     ['Threads 發文', 'httpRequest', 1590, 465],
  merge:  ['Merge1', 'merge', 2480, 360],
  notify: ['通知客戶2', 'httpRequest', 2765, 360],
}
const E = [
  ['sheet','pull'],['pull','token'],
  ['token','fb'],['token','thc'],
  ['fb','igid'],['igid','igc'],['igc','igw'],['igw','ig'],['ig','merge'],
  ['thc','thw'],['thw','th'],['th','merge'],
  ['merge','notify'],
]

const card = (n) => {
  const [name, type, x, y] = n
  const ty = TYPE[type]
  return `<g>
    <rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="15" fill="#fff" stroke="#e3e6ea" stroke-width="1.4" filter="url(#sh)"/>
    <rect x="${x}" y="${y + 14}" width="6" height="${CH - 28}" rx="3" fill="${ty.c}"/>
    <circle cx="${x + 40}" cy="${y + CH / 2}" r="17" fill="${ty.c}" opacity="0.16"/>
    <circle cx="${x + 40}" cy="${y + CH / 2}" r="6.5" fill="${ty.c}"/>
    <text x="${x + 70}" y="${y + 34}" font-size="23" font-weight="700" fill="${INK}">${name}</text>
    <text x="${x + 70}" y="${y + 58}" font-size="15" fill="${SUB}">${ty.t}</text>
  </g>`
}
const edge = ([a, b]) => {
  const s = N[a], t = N[b]
  const x1 = s[2] + CW, y1 = s[3] + CH / 2
  const x2 = t[2], y2 = t[3] + CH / 2
  const mx = (x1 + x2) / 2
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
<text x="60" y="70" font-size="34" font-weight="800" fill="${INK}">ai自動發文api ── 真實工作流：一篇貼文同時串上 FB／IG／Threads</text>
${E.map(edge).join('\n')}
${Object.values(N).map(card).join('\n')}
<text x="60" y="${H - 36}" font-size="22" fill="#8a929c">FB 一個節點直接發；IG 要「抓 ID → 建容器 → 等待 → 發文」；Threads 要「建容器 → 等待 → 發文」── 三條線長度不同，正是三平台 API 不一樣的地方。</text>
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
