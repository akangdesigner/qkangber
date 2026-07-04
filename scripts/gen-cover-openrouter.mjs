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
// 先拿 text 再 parse：OpenRouter 出錯（502/限流）常回 HTML，直接 res.json() 會
// 丟 SyntaxError 蓋掉真正的 HTTP 錯誤
const bodyText = await res.text()
if (!res.ok) { console.error('HTTP', res.status, bodyText.slice(0, 400)); process.exit(1) }
let json
try { json = JSON.parse(bodyText) } catch { console.error('non-JSON response:', bodyText.slice(0, 400)); process.exit(1) }
const url = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url
if (!url) { console.error('no image', JSON.stringify(json).slice(0, 400)); process.exit(1) }
const buf = Buffer.from(url.split(',')[1], 'base64')
const m = await sharp(buf).metadata()

// 防呆：Gemini 有時把插畫畫在留白畫布上、四周帶白邊。
// 內建 sharp.trim() 對「只有左右(或只有上下)留白」這種非完整外框無效，
// 改用掃描白色 bounding box 自己裁；滿版無白邊的圖會原樣返回（不誤砍）。
async function trimWhite(srcBuf) {
  const { data, info } = await sharp(srcBuf).raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels: ch } = info
  const isW = (x, y) => { const i = (y * w + x) * ch; return data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235 }
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!isW(x, y)) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y }
  if (maxX < 0) return srcBuf // 全白，放棄
  // 內縮 2px 去掉白→暗的反鋸齒淺灰邊
  const inset = 2
  minX = Math.min(minX + inset, maxX); minY = Math.min(minY + inset, maxY)
  maxX = Math.max(maxX - inset, minX); maxY = Math.max(maxY - inset, minY)
  const cw = maxX - minX + 1, cyh = maxY - minY + 1
  if (cw >= w - 3 && cyh >= h - 3) return srcBuf // 幾乎沒白邊可裁，原樣返回
  console.log('trimWhite', `${w}x${h} -> ${cw}x${cyh}（去白邊）`)
  return await sharp(srcBuf).extract({ left: minX, top: minY, width: cw, height: cyh }).toBuffer()
}

const clean = await trimWhite(buf)
console.log('raw', m.width, 'x', m.height, '->', `${W}x${H}`)
await sharp(clean).resize(W, H, { fit: 'cover' }).jpeg({ quality: 92 }).toFile(OUT)
console.log('OK ->', OUTARG)
