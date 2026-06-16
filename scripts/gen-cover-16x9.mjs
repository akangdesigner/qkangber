// 生 multi-platform-posting 真正的 16:9 封面（不裁切、不柔焦假邊）
// 根因：nano banana 無視文字 16:9，但修圖模式會跟著「輸入圖片比例」走。
// 解法：先把方圖主體貼到 1600x900 米色畫布右側 → 丟回 Gemini outpaint 左側 → 輸出即 16:9。
// 用法：node scripts/gen-cover-16x9.mjs [--regen-subject]
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const envText = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const KEY = (envText.match(/^OPENROUTER_API_KEY=(.+)$/m)?.[1] || '').trim().replace(/^["']|["']$/g, '')
if (!KEY) { console.error('NO OPENROUTER_API_KEY'); process.exit(1) }

const OUTDIR = path.resolve('blog-drafts/08-multi-platform-posting/images')
const URL = 'https://openrouter.ai/api/v1/chat/completions'
const W = 1600, H = 900
const BG = { r: 232, g: 216, b: 200 } // 取樣到的米色

async function gen(messages, label) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'google/gemini-2.5-flash-image', messages, modalities: ['image', 'text'] }),
  })
  const json = await res.json()
  if (!res.ok) { console.error(label, 'HTTP', res.status, JSON.stringify(json).slice(0, 500)); process.exit(1) }
  const url = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url
  if (!url) { console.error(label, 'no image', JSON.stringify(json).slice(0, 500)); process.exit(1) }
  return Buffer.from(url.split(',')[1], 'base64')
}

// 0) 主體方圖：有就重用，加 --regen-subject 才重生
const SUBJ = path.join(OUTDIR, 'cover-square.png')
if (process.argv.includes('--regen-subject') || !fs.existsSync(SUBJ)) {
  const p1 = `A cute friendly white and beige 3D robot mascot with big blue eyes and a small smile, floating, holding a smartphone in one raised hand. Soft glossy 3D social media icons (hearts, thumbs-up likes, chat bubbles, camera) float out of the phone. Smooth warm beige gradient studio background (#e8d8c8), soft shadows, Pixar-style cute 3D render, clean, high quality.`
  console.log('gen subject…')
  fs.writeFileSync(SUBJ, await gen([{ role: 'user', content: p1 }], 'subject'))
}

// 1) 把方圖主體放進 1600x900 米色畫布的「右側」，左側留白給模型補
const subjBuf = fs.readFileSync(SUBJ)
const subj = await sharp(subjBuf).resize(H, H, { fit: 'cover' }).toBuffer() // 900x900 正方主體
const canvas = await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
  .composite([{ input: subj, left: W - H, top: 0 }]) // 貼齊右緣
  .png().toBuffer()
fs.writeFileSync(path.join(OUTDIR, 'cover-canvas.png'), canvas)

// 2) outpaint 左側（輸入是 16:9 → 輸出跟著 16:9）
const p2 = `This is a wide 16:9 banner. The cute white-and-beige 3D robot holding a smartphone is already placed on the right side — keep it exactly as is, do not move or resize it. Fill the empty beige area on the LEFT with a seamless continuation of the same warm beige gradient background, and add a flowing diagonal trail of the same soft glossy 3D social media icons (hearts, thumbs-up likes, chat bubbles, camera) drifting up and to the left out of the phone across the open space. Match the lighting and 3D Pixar style exactly. Seamless blend, no visible seam, no border, keep the wide 16:9 framing.`
console.log('outpaint 16:9…')
const wide = await gen([{
  role: 'user',
  content: [
    { type: 'text', text: p2 },
    { type: 'image_url', image_url: { url: `data:image/png;base64,${canvas.toString('base64')}` } },
  ],
}], 'wide')
fs.writeFileSync(path.join(OUTDIR, 'cover-wide-raw.png'), wide)

const meta = await sharp(wide).metadata()
console.log('wide raw size', meta.width, 'x', meta.height, '(目標 16:9 =', (meta.width / meta.height).toFixed(3), 'vs 1.778)')

// 3) 轉成標準 1600x900 jpg。若模型已回 16:9，這步只是縮放不會裁掉內容
await sharp(wide).resize(W, H, { fit: 'fill' }).jpeg({ quality: 92 }).toFile(path.join(OUTDIR, 'cover-new.jpg'))
console.log('OK -> cover-canvas.png / cover-wide-raw.png / cover-new.jpg')
