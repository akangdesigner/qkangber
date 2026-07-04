// 用 Playwright 打 Bing（台灣 mkt=zh-TW），抓每個關鍵字前 N 名的網域與標題。
// Google 對自動流量直接給 CAPTCHA，改用 Bing 當「誰在霸榜」的替代訊號。
// 用法：node scripts/serp-scan.mjs --file scripts/keywords.txt [--top 6] [--csv out.csv]
// 純讀取、不點擊、不解 CAPTCHA。
import fs from 'fs'
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const getFlag = (n) => { const i = args.indexOf(n); return i !== -1 ? args[i + 1] : null }
const file = getFlag('--file') || 'scripts/keywords.txt'
const topN = Number(getFlag('--top')) || 6
const csvPath = getFlag('--csv')

const keywords = fs.readFileSync(file, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)

// 大廠/大媒體/SaaS 網域（命中越多＝越難打）
const BIG = ['hubspot', 'salesforce', 'zapier', 'make.com', 'wikipedia', 'medium.com',
  'microsoft', 'line.biz', 'line.me', 'shopify', 'aws.amazon', 'cloud.google',
  'note.com', 'ithome', 'inside.com.tw', 'techorange', 'business.line', 'manychat',
  'gohighlevel', 'monday.com', 'notion.so', 'cyberbiz', 'shopline', '91app', 'oosga',
  'welly.tw', 'gartner', 'g2.com', 'capterra']

function realHost(href) {
  try {
    const u = new URL(href)
    if (u.hostname.includes('bing.com')) {
      let raw = u.searchParams.get('u') || ''
      if (raw.startsWith('a1')) raw = raw.slice(2)
      const dec = Buffer.from(raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
      return new URL(dec).hostname.replace(/^www\./, '')
    }
    return u.hostname.replace(/^www\./, '')
  } catch { return '' }
}

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({
  locale: 'zh-TW', timezoneId: 'Asia/Taipei',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
})
const page = await ctx.newPage()
const rows = []

for (const kw of keywords) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(kw)}&setlang=zh-tw&cc=tw&mkt=zh-TW&count=20`
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(1100 + Math.random() * 700)
    const raw = await page.evaluate(() =>
      [...document.querySelectorAll('#b_results h2 a')].map((a) => ({ href: a.href, title: a.textContent.trim().slice(0, 44) })))
    const seen = new Set()
    const results = []
    for (const r of raw) {
      const host = realHost(r.href)
      if (!host || host.includes('bing.com')) continue
      if (seen.has(host)) continue
      seen.add(host)
      results.push({ host, title: r.title })
      if (results.length >= topN) break
    }
    const bigHits = results.filter((r) => BIG.some((b) => r.host.includes(b))).length
    rows.push({ kw, bigHits, results })
    console.log(`\n■ ${kw}　（大廠/SaaS 命中 ${bigHits}/${results.length}）`)
    results.forEach((r, i) => console.log(`  ${i + 1}. ${r.host.padEnd(26)} ${r.title}`))
  } catch (e) {
    rows.push({ kw, error: String(e).slice(0, 80), results: [] })
    console.log(`[ERR] ${kw} ${String(e).slice(0, 80)}`)
  }
}

await browser.close()

if (csvPath) {
  const lines = ['keyword,bigHits,rank,host,title']
  for (const r of rows) (r.results || []).forEach((x, i) =>
    lines.push(`"${r.kw}",${r.bigHits ?? ''},${i + 1},"${x.host}","${(x.title || '').replace(/"/g, "'")}"`))
  fs.writeFileSync(csvPath, lines.join('\n'), 'utf8')
  console.log(`\nCSV 已存：${csvPath}`)
}
