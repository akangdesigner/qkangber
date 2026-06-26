// 用 OpenRouter Gemini 生封面/概念圖，自動轉成 1200x630 JPG。
// 用法：node scripts/gen-cover-openrouter.mjs "<英文 prompt>" "<輸出路徑.jpg>" [寬 高]
//   例：node scripts/gen-cover-openrouter.mjs "a flat editorial illustration of ..." "blog-drafts/XX-slug/images/cover.jpg"
// 金鑰讀 .env.local 的 OPENROUTER_API_KEY；Gemini 常回 1024² 方圖，用 sharp fit:cover 裁成目標比例。
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const [, , PROMPT, OUTARG, WARG, HARG] = process.argv
if (!PROMPT || !OUTARG) { console.error('用法: node scripts/gen-cover-openrouter.mjs "<prompt>" "<out.jpg>" [w h]'); process.exit(1) }
const W = parseInt(WARG) || 1200
const H = parseInt(HARG) || 630
const OUT = path.resolve(OUTARG)
fs.mkdirSync(path.dirname(OUT), { recursive: true })

const envText = fs.readFileSync(path.resolve('.env.local'), 'utf8')
const KEY = (envText.match(/^OPENROUTER_API_KEY=(.+)$/m)?.[1] || '').trim().replace(/^["']|["']$/g, '')
if (!KEY) { console.error('NO OPENROUTER_API_KEY in .env.local'); process.exit(1) }

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'google/gemini-2.5-flash-image', messages: [{ role: 'user', content: PROMPT }], modalities: ['image', 'text'] }),
})
const json = await res.json()
if (!res.ok) { console.error('HTTP', res.status, JSON.stringify(json).slice(0, 400)); process.exit(1) }
const url = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url
if (!url) { console.error('no image', JSON.stringify(json).slice(0, 400)); process.exit(1) }
const buf = Buffer.from(url.split(',')[1], 'base64')
const m = await sharp(buf).metadata()
console.log('raw', m.width, 'x', m.height, '->', `${W}x${H}`)
await sharp(buf).resize(W, H, { fit: 'cover' }).jpeg({ quality: 92 }).toFile(OUT)
console.log('OK ->', OUTARG)
