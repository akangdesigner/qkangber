// 驗證 RWD 修復：本機 dev server 截 390px 手機版（about 全頁＋翻面、newsletter、contact）與 1280px 桌機 about。
// 用法：node scripts/shot-rwd-verify.mjs
import path from 'path'
import fs from 'fs'
import { chromium } from 'playwright'

const OUT = path.resolve('.rwd-audit')
fs.mkdirSync(OUT, { recursive: true })
const BASE = 'http://localhost:3000'

const browser = await chromium.launch()

// 手機
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
for (const [p, f] of [['/about', 'fix-about-mobile'], ['/newsletter', 'fix-newsletter-mobile'], ['/contact', 'fix-contact-mobile'], ['/', 'fix-home-mobile']]) {
  await m.goto(BASE + p, { waitUntil: 'networkidle' })
  await m.waitForTimeout(2000)
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  await m.screenshot({ path: path.join(OUT, f + '.png'), fullPage: true })
  console.log('OK', f, overflow > 0 ? `⚠ 水平溢出 ${overflow}px` : '無水平溢出')
}
// about 翻面（點核心理念按鈕）
await m.goto(BASE + '/about', { waitUntil: 'networkidle' })
await m.waitForTimeout(1500)
await m.getByRole('button', { name: /核心理念/ }).click()
await m.waitForTimeout(1200)
await m.screenshot({ path: path.join(OUT, 'fix-about-mobile-back.png') })
console.log('OK fix-about-mobile-back')
await m.close()

// 桌機（確認外觀不變）
const d = await browser.newPage({ viewport: { width: 1280, height: 832 }, deviceScaleFactor: 1 })
await d.goto(BASE + '/about', { waitUntil: 'networkidle' })
await d.waitForTimeout(2000)
await d.screenshot({ path: path.join(OUT, 'fix-about-desktop.png') })
console.log('OK fix-about-desktop')
await d.goto(BASE + '/', { waitUntil: 'networkidle' })
await d.waitForTimeout(2000)
await d.screenshot({ path: path.join(OUT, 'fix-home-desktop.png') })
console.log('OK fix-home-desktop')
await d.close()

await browser.close()
