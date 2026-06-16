// 把近 16:9 的封面再餵回 Gemini：去除垂直接縫、背景抹成單一無縫漸層、左上補圖示。
// 輸入已是 16:9 → 輸出維持 16:9（不裁切）。用法：node scripts/refine-cover.mjs
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const envText = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const KEY = (envText.match(/^OPENROUTER_API_KEY=(.+)$/m)?.[1] || '').trim().replace(/^["']|["']$/g, '')
const OUTDIR = path.resolve('blog-drafts/08-multi-platform-posting/images')
const URL = 'https://openrouter.ai/api/v1/chat/completions'

async function gen(messages) {
  const res = await fetch(URL, { method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'google/gemini-2.5-flash-image', messages, modalities: ['image', 'text'] }) })
  const json = await res.json()
  const url = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url
  if (!url) { console.error('no image', JSON.stringify(json).slice(0, 500)); process.exit(1) }
  return Buffer.from(url.split(',')[1], 'base64')
}

const src = fs.readFileSync(path.join(OUTDIR, 'cover-wide-raw.png'))
const prompt = `Edit this wide 16:9 image. Problem to fix: there is an ugly vertical seam and a flat empty color block on the LEFT half. Make the ENTIRE background one single smooth continuous warm beige gradient with NO vertical seam, NO color block, NO hard edge anywhere. Keep the cute robot on the right exactly as it is. In the upper-left and center area, add a gentle flowing trail of soft glossy 3D social media icons (hearts, thumbs-up likes, chat bubbles, camera) drifting up out of the phone, matching the same 3D Pixar style and lighting. Keep the wide 16:9 framing.`

console.log('refine…')
const out = await gen([{ role: 'user', content: [
  { type: 'text', text: prompt },
  { type: 'image_url', image_url: { url: `data:image/png;base64,${src.toString('base64')}` } },
] }])
fs.writeFileSync(path.join(OUTDIR, 'cover-refined-raw.png'), out)
const m = await sharp(out).metadata()
console.log('refined size', m.width, 'x', m.height, '=', (m.width / m.height).toFixed(3))
await sharp(out).resize(1600, 900, { fit: 'fill' }).jpeg({ quality: 92 }).toFile(path.join(OUTDIR, 'cover-new.jpg'))
console.log('OK -> cover-new.jpg')
