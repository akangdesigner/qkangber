// 重畫 multi-platform-posting 架構圖（新流程：AI 產圖文→登記 Sheets→LINE 審核→n8n 分流發→三平台→成功通知）
// 用法：node scripts/gen-arch-diagram.mjs
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { chromium } from 'playwright'

const OUT = path.resolve('blog-drafts/08-multi-platform-posting/images/arch-overview.jpg')
const W = 1600, H = 880

const INK = '#2b3440', SUB = '#8a929c', LINE = '#aab2bd', ORANGE = '#e07b39'

// 一般白卡
const box = (x, y, w, h, title, subs, opt = {}) => {
  const fill = opt.fill || '#ffffff'
  const stroke = opt.stroke || '#e3e6ea'
  const sw = opt.sw || 1.2
  const tcolor = opt.tcolor || INK
  const tsize = opt.tsize || 30
  const cx = x + w / 2
  let ty = y + (h - (subs.length) * 30) / 2 + tsize - 4
  let svg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" filter="url(#sh)"/>`
  svg += `<text x="${cx}" y="${ty}" text-anchor="middle" font-size="${tsize}" font-weight="700" fill="${tcolor}">${title}</text>`
  subs.forEach((s, i) => {
    svg += `<text x="${cx}" y="${ty + 30 + i * 30}" text-anchor="middle" font-size="22" fill="${s.c || SUB}">${s.t}</text>`
  })
  return svg
}
const arrow = (x1, y1, x2, y2, dashed = false) =>
  `<path d="M${x1},${y1} L${x2},${y2}" stroke="${LINE}" stroke-width="2.4" fill="none" marker-end="url(#arr)" ${dashed ? 'stroke-dasharray="7 7"' : ''}/>`

let s = ''
// 主流程四箱
s += box(48, 190, 200, 168, 'AI 產出圖文', [{ t: '圖 + 文先準備好' }])
s += box(300, 190, 232, 168, 'Google Sheets', [{ t: '登記進待發清單' }, { t: '還沒核准不會發' }])
s += box(584, 190, 232, 168, 'LINE 審核', [{ t: '推圖文到手機', c: INK }, { t: '人在迴路把關點', c: ORANGE }], { stroke: ORANGE, sw: 2.4 })
s += box(868, 185, 244, 178, 'n8n', [{ t: '① 核准後抓出那篇' }, { t: '② 帶上發文憑證' }, { t: '③ 分三條線發佈' }], { fill: '#fff4e8', stroke: '#efa14e', sw: 2.4, tcolor: '#d2691e' })
// 三平台
s += box(1320, 178, 232, 66, 'Facebook', [])
s += box(1320, 262, 232, 66, 'Instagram', [])
s += box(1320, 346, 232, 66, 'Threads', [])
// 底列
s += box(840, 540, 312, 120, '發佈結果寫回 Sheets', [{ t: '留底、避免重複發' }])
s += box(1232, 540, 320, 120, '三平台成功 → LINE 通知', [{ t: '「文章發佈成功」push' }])

// 箭頭
let a = ''
a += arrow(248, 274, 298, 274)
a += arrow(532, 274, 582, 274)
a += arrow(816, 274, 866, 274)
a += arrow(1112, 250, 1318, 211)
a += arrow(1112, 274, 1318, 295)
a += arrow(1112, 298, 1318, 379)
a += arrow(990, 363, 990, 538, true)        // n8n 向下到寫回
a += arrow(1438, 412, 1400, 538)             // 平台向下到通知

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000" flood-opacity="0.06"/></filter>
  <marker id="arr" markerWidth="10" markerHeight="10" refX="7" refY="3.2" orient="auto"><path d="M0,0 L7,3.2 L0,6.4 Z" fill="${LINE}"/></marker>
</defs>
<rect width="${W}" height="${H}" fill="#f6f7f9"/>
<text x="${W / 2}" y="86" text-anchor="middle" font-size="46" font-weight="800" fill="${INK}">多平台發文自動化　整體架構</text>
${a}
${s}
<text x="${W / 2}" y="772" text-anchor="middle" font-size="24" fill="#9aa3ad">AI 產出圖文先登記、推 LINE 由人核准才發 —— 要不要對外發聲的判斷權，始終在人手上</text>
</svg>`

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0}svg text{font-family:'Noto Sans TC',sans-serif}</style></head>
<body>${svg}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const png = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } })
await browser.close()
await sharp(png).jpeg({ quality: 92 }).toFile(OUT)
console.log('OK ->', OUT)
