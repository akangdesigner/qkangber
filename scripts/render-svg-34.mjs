// 把 34 篇草稿裡的 inline SVG 用 Playwright 2x 渲染成 jpg（方格子版要用；sharp 直吃 SVG 中文會空白）。
// 用法：node scripts/render-svg-34.mjs
// 輸出：blog-drafts/34-google-apps-script-syntax/images/svg-code-blocks.jpg
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const DRAFT = 'blog-drafts/34-google-apps-script-syntax/34-google-apps-script-syntax.html'
const OUTDIR = path.resolve('blog-drafts/34-google-apps-script-syntax/images')
const NAMES = ['svg-code-blocks.jpg']

const html = fs.readFileSync(DRAFT, 'utf8')
const svgs = html.match(/<svg[\s\S]*?<\/svg>/g) ?? []
if (svgs.length !== NAMES.length) throw new Error(`草稿有 ${svgs.length} 張 SVG，預期 ${NAMES.length}`)

const browser = await chromium.launch()
for (let i = 0; i < svgs.length; i++) {
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 2 })
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
    <style>*{margin:0;padding:0}body{width:1024px;height:768px;overflow:hidden}svg{display:block;width:1024px;height:768px;border-radius:0!important}</style>
    </head><body>${svgs[i]}</body></html>`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const out = path.join(OUTDIR, NAMES[i])
  await page.screenshot({ path: out, type: 'jpeg', quality: 94 })
  await page.close()
  console.log('OK', out)
}
await browser.close()
