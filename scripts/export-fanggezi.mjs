// 產「方格子轉貼版」：把草稿的本地圖以 jpg 原格式直傳 ImgBB（不轉 webp，方格子不吃 webp），
// 產出 _fanggezi.html 到草稿資料夾——瀏覽器打開全選複製，貼進方格子圖就不會掉。
// 用法：node scripts/export-fanggezi.mjs blog-drafts/22-google-apps-script/22-google-apps-script.html
import fs from 'node:fs'
import path from 'node:path'

const SRC = process.argv[2]
if (!SRC) { console.error('用法：node scripts/export-fanggezi.mjs <草稿.html>'); process.exit(1) }

const envText = fs.readFileSync('.env.local', 'utf8')
const KEY = (envText.match(/^IMGBB_API_KEY=(.+)$/m)?.[1] || '').trim()
if (!KEY) { console.error('缺 IMGBB_API_KEY'); process.exit(1) }

const dir = path.dirname(SRC)
let html = fs.readFileSync(SRC, 'utf8')
const locals = [...html.matchAll(/src="images\/([^"]+)"/g)].map((m) => m[1])
const uniq = [...new Set(locals)]
console.log(`找到 ${uniq.length} 張本地圖，jpg 原格式直傳 ImgBB…`)

for (const file of uniq) {
  const p = path.join(dir, 'images', file)
  if (!fs.existsSync(p)) { console.error(`✗ 找不到 ${p}，跳過`); continue }
  const b64 = fs.readFileSync(p).toString('base64')
  const body = new URLSearchParams({ key: KEY, image: b64, name: file.replace(/\.[a-z]+$/i, '') + '-jpg' })
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body })
  const json = await res.json()
  if (!json.success) { console.error(`✗ ${file} 上傳失敗：`, JSON.stringify(json).slice(0, 200)); process.exit(1) }
  const url = json.data.url
  html = html.replaceAll(`src="images/${file}"`, `src="${url}"`)
  console.log(`  ${file} → ${url}`)
}

const out = path.join(dir, '_fanggezi.html')
fs.writeFileSync(out, html)
console.log(`✓ 方格子版 → ${out}（瀏覽器打開全選複製）`)
