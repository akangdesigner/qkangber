// 截 aiqkangber.com 服務頁與電子報頁的實況首屏。
// 用法：node scripts/shot-live-pages.mjs
import path from 'path'
import { chromium } from 'playwright'

const OUT = path.resolve('blog-drafts/06-claude-code-web-design/_live')
import fs from 'fs'
fs.mkdirSync(OUT, { recursive: true })

const PAGES = [
  { url: 'https://aiqkangber.com/services', file: 'live-services.png' },
  { url: 'https://aiqkangber.com/newsletter', file: 'live-newsletter.png' },
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 832 }, deviceScaleFactor: 2 })
for (const p of PAGES) {
  await page.goto(p.url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: path.join(OUT, p.file) })
  console.log('OK', p.file)
}
await browser.close()
