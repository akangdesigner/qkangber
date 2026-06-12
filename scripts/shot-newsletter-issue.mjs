// 截最新一期電子報公開頁（內文起始處，給 Threads 宣傳用）。
// 用法：node scripts/shot-newsletter-issue.mjs
import path from 'path'
import { chromium } from 'playwright'

const OUT = path.resolve('blog-drafts/06-claude-code-web-design/threads/issue-0608.png')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 }, deviceScaleFactor: 2 })
await page.goto('https://aiqkangber.com/newsletter/q-kangber-weekly-2026-06-08', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.screenshot({ path: OUT })
await browser.close()
console.log('OK', OUT)
