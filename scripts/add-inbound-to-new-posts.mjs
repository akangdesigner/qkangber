// 補「連入」新文章的內鏈：從既有相關文章文末（參考資料之後）加一條延伸閱讀，指向孤兒新文章。
// 只放連結、不加說明句；同一連結已存在就跳過（冪等）。
// 用法：node scripts/add-inbound-to-new-posts.mjs [--write]　預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

// 目標新文章的錨文字（描述目標頁、吃關鍵字）
const ANCHOR = {
  'ai-agent-planning': 'AI Agent 的推理與規劃：為什麼一句指令它就懂',
  'ai-agent-trigger': 'AI Agent 的排程與事件觸發機制',
  'ai-website-development': '不會寫程式也能用 AI 打造專屬網站（2026 建站入門）',
  'claude-design': '用 Claude Design 擺脫 AI 味，讓網站 UI/UX 質感升級',
}

// 來源文章 → 要連出去的目標新文章
const PLAN = {
  'ai-architecture': ['ai-agent-planning', 'ai-agent-trigger'],
  'ai-tool-calling': ['ai-agent-planning'],
  'ai-agent-memory': ['ai-agent-trigger'],
  'n8n-zeabur-beginner-guide': ['ai-website-development'],
  'ai-coding-downsides': ['ai-website-development', 'claude-design'],
  'ai-website-development': ['claude-design'],
}

const link = (slug) => `\n<p>👉 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/${slug}">${ANCHOR[slug]}</a></p>`

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON), scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })
const res = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = res.data.values ?? []
const slugs = rows.map((r) => (r[0] ?? '').trim())

const updates = []
for (const [src, targets] of Object.entries(PLAN)) {
  const idx = slugs.indexOf(src)
  if (idx === -1) { console.log(`✗ ${src}：找不到`); continue }
  let c = rows[idx][5] ?? ''
  const added = []
  for (const t of targets) {
    if (c.includes(`/blog/${t}`)) { console.log(`   ${src} 已連 ${t}，跳過`); continue }
    c += link(t)
    added.push(t)
  }
  if (!added.length) continue
  console.log(`\n→ ${src}（第 ${idx + 1} 列）新增連入：${added.join('、')}`)
  console.log('   末段預覽：', c.slice(-260).replace(/\s+/g, ' '))
  updates.push({ src, rowNum: idx + 1, next: c })
}

console.log(`\n計畫更新 ${updates.length} 篇。`)
if (!WRITE) { console.log('（dry-run）確認後加 --write。'); process.exit(0) }
for (const u of updates) {
  await sheets.spreadsheets.values.update({ spreadsheetId: env.GOOGLE_SHEET_ID, range: `posts!F${u.rowNum}`, valueInputOption: 'RAW', requestBody: { values: [[u.next]] } })
  console.log(`✓ ${u.src} 第 ${u.rowNum} 列已更新`)
}
console.log('完成。')
