// 用掌上靈珠 App 的真實素材（木盤＋珠子 PNG）排出串珠盤成果。
// 珠子沿木盤圓形凹槽排成一圈、大小不一，對應 App 的 calculateCircularPosition。
// 用法：node scripts/compose-beadtray.mjs
import sharp from 'sharp'
import path from 'path'

const H = 'D:/handmade/public/'
const OUT = path.resolve('blog-drafts/11-engineer-mindset/images/bead-animation.jpg')

// 木盤凹槽中心與半徑（對應 1328x1328 原圖）
const cx = 663, cy = 663, R = 295
const DEBUG_GUIDE = process.env.GUIDE === '1'

// 依序排一圈的珠子（檔名 + 直徑px），刻意大中小混搭
const RING = [
  ['white-pearl-ID20.png', 122],
  ['red-bead-ID5.png',     148],
  ['gold-bead-ID21.png',   108],
  ['indigo-bead-ID13.png', 124],
  ['aquamarine-bead-ID25.png', 142],
  ['orange-bead-ID3.png',  108],
  ['dark-purple-bead-ID8.png', 124],
  ['mint-green-bead-ID2.png',  144],
  ['pink-bead-ID11.png',   110],
  ['light-blue-bead-ID15.png',  124],
  ['silver-bead-ID22.png', 142],
  ['moonstone-bead-ID26.png',  114],
]

const fallback = ['light-pink-bead-ID1.png','red-bead-ID5.png']

async function loadBead(file, size) {
  let f = H + file
  try {
    // 先 trim 掉透明邊距，讓球體置中、各珠視覺中心一致
    return await sharp(f).trim({ threshold: 10 })
      .resize(size, size, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toBuffer()
  } catch (e) {
    return await sharp(H + fallback[0]).trim({ threshold: 10 }).resize(size, size, { fit:'contain', background:{r:0,g:0,b:0,alpha:0} }).png().toBuffer()
  }
}

const N = RING.length
const composites = []
for (let i = 0; i < N; i++) {
  const [file, size] = RING[i]
  const angle = (2 * Math.PI / N) * i - Math.PI / 2 // 從 12 點開始順時針
  const x = Math.round(cx + Math.cos(angle) * R - size / 2)
  const y = Math.round(cy + Math.sin(angle) * R - size / 2)
  let buf
  try { buf = await loadBead(file, size) }
  catch { buf = await loadBead(fallback[1], size) }
  composites.push({ input: buf, top: y, left: x })
}

// 第一段：在原生 1328 解析度合成（sharp 的 composite 一律在 resize 之後執行，
// 所以一定要在這一段就用 1328 座標、不要在同一條 pipeline 接 resize）
const composedBuf = await sharp(H + 'wooden-tray.png')
  .composite(composites)
  .png()
  .toBuffer()

// 第二段：另開 pipeline 才縮放 + 轉 jpg
await sharp(composedBuf)
  .resize(900) // web 尺寸
  .flatten({ background: '#e8eaed' })
  .jpeg({ quality: 88 })
  .toFile(OUT)

console.log('OK', OUT)
