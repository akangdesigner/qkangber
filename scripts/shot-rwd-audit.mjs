// RWD 體檢：用 iPhone 寬度 (390px) 截全站主要頁面的完整頁面截圖。
// 用法：node scripts/shot-rwd-audit.mjs
import path from 'path'
import fs from 'fs'
import { chromium } from 'playwright'

const OUT = path.resolve('.rwd-audit')
fs.mkdirSync(OUT, { recursive: true })

const PAGES = [
  { url: 'https://aiqkangber.com/', file: 'mobile-home.png' },
  { url: 'https://aiqkangber.com/services', file: 'mobile-services.png' },
  { url: 'https://aiqkangber.com/blog', file: 'mobile-blog.png' },
  { url: 'https://aiqkangber.com/about', file: 'mobile-about.png' },
  { url: 'https://aiqkangber.com/contact', file: 'mobile-contact.png' },
  { url: 'https://aiqkangber.com/newsletter', file: 'mobile-newsletter.png' },
]

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
for (const p of PAGES) {
  await page.goto(p.url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  // 檢查有沒有水平捲軸（mobile RWD 最常見的破版訊號）
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  await page.screenshot({ path: path.join(OUT, p.file), fullPage: true })
  console.log('OK', p.file, overflow > 0 ? `⚠ 水平溢出 ${overflow}px` : '無水平溢出')
}
await browser.close()
