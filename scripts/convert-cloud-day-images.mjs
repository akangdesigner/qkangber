// 一次性：把 docs/activities-source/cloud-day-2026 的 22 張現場投影片 jpg
// 轉成 public/activities/cloud-day-2026/sNN-M.webp（sNN=場次序、M=該場圖序）。
// webp q80 沿用 upload-imgbb.mjs 的驗證結論：截圖文字仍清晰、檔案省約 8 成。
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const srcRoot = path.resolve('docs/activities-source/cloud-day-2026')
const outDir = path.resolve('public/activities/cloud-day-2026')
fs.mkdirSync(outDir, { recursive: true })

const dirs = fs.readdirSync(srcRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

let total = 0
for (const dir of dirs) {
  const session = dir.slice(0, 2) // 資料夾以 01~08 開頭
  const jpgs = fs.readdirSync(path.join(srcRoot, dir))
    .filter((f) => /^img-\d+\.jpg$/i.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10))
  for (const jpg of jpgs) {
    const n = jpg.match(/\d+/)[0]
    const out = path.join(outDir, `s${session}-${n}.webp`)
    const info = await sharp(path.join(srcRoot, dir, jpg))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out)
    total++
    console.log(`s${session}-${n}.webp  ${(info.size / 1024).toFixed(0)}KB`)
  }
}
console.log(`done: ${total} images -> ${outDir}`)
