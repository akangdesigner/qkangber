#!/usr/bin/env node
// 圖片上傳 ImgBB 前先轉 webp（quality 80，截圖文字仍清晰），減少內文圖檔案大小改善 LCP。
// 用法：
//   node scripts/upload-imgbb.mjs <圖片路徑...>            轉檔＋上傳，印出 ImgBB 網址
//   node scripts/upload-imgbb.mjs --dry-run <圖片路徑...>  只轉檔看壓縮率，不上傳
// 已經是 .webp 的檔案直接上傳不重壓；ImgBB 顯示名稱取自檔名（去副檔名）。
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const files = args.filter((a) => a !== '--dry-run')
if (files.length === 0) {
  console.error('用法：node scripts/upload-imgbb.mjs [--dry-run] <圖片路徑...>')
  process.exit(1)
}

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
if (!dryRun && !env.IMGBB_API_KEY) {
  console.error('找不到 IMGBB_API_KEY（.env.local）')
  process.exit(1)
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

async function toWebp(file) {
  const srcBuf = fs.readFileSync(file)
  if (path.extname(file).toLowerCase() === '.webp') {
    return { buf: srcBuf, srcSize: srcBuf.length, converted: false }
  }
  const buf = await sharp(srcBuf).webp({ quality: 80 }).toBuffer()
  return { buf, srcSize: srcBuf.length, converted: true }
}

async function upload(name, buf) {
  const body = new URLSearchParams({
    key: env.IMGBB_API_KEY,
    name,
    image: buf.toString('base64'),
  })
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body })
  const json = await res.json()
  if (!json.success) throw new Error(`ImgBB 上傳失敗：${JSON.stringify(json.error ?? json)}`)
  return json.data.url
}

for (const file of files) {
  const name = path.basename(file, path.extname(file))
  const { buf, srcSize, converted } = await toWebp(file)
  const ratio = converted ? `（${kb(srcSize)} → ${kb(buf.length)}，省 ${(100 - (buf.length / srcSize) * 100).toFixed(0)}%）` : '（已是 webp，不重壓）'
  if (dryRun) {
    console.log(`${file} ${ratio}`)
    continue
  }
  const url = await upload(name, buf)
  console.log(`${file} ${ratio}`)
  console.log(`  → ${url}`)
}
