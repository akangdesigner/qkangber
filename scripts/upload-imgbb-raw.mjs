#!/usr/bin/env node
// 圖片「不轉檔」直接上傳 ImgBB（方格子版用：方格子不吃 webp，jpg/png 原檔直上）。
// 用法：node scripts/upload-imgbb-raw.mjs <圖片路徑...>
import fs from 'node:fs'
import path from 'node:path'

const files = process.argv.slice(2)
if (files.length === 0) { console.error('用法：node scripts/upload-imgbb-raw.mjs <圖片路徑...>'); process.exit(1) }

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
if (!env.IMGBB_API_KEY) { console.error('找不到 IMGBB_API_KEY（.env.local）'); process.exit(1) }

for (const file of files) {
  const name = path.basename(file, path.extname(file))
  const b64 = fs.readFileSync(file).toString('base64')
  const body = new URLSearchParams({ key: env.IMGBB_API_KEY, image: b64, name })
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body })
  const json = await res.json()
  if (!json.success) { console.error(`✗ ${file}：${JSON.stringify(json).slice(0, 200)}`); process.exit(1) }
  console.log(`${file}\n  → ${json.data.url}`)
}
