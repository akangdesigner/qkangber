// 解死巷頁（post-produce/socailmedia 收很多內鏈卻不連出）並啟動 aicommand 交叉連結。
// 每篇：① 前言首次「Claude Code」內鏈到 aicommand 評測頁 ② 文末補一條延伸閱讀。
// 用法：node scripts/fix-deadend-and-aicommand-links.mjs [--write]　預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const CC_URL = 'https://aicommand.aiqkangber.com/tools/claude-code'
const T = {
  'multi-platform-posting': '社群自動發文怎麼做？我捨棄 Buffer，用 n8n 一篇貼文同時發到 FB、IG、Threads',
  'competitor-analysis-automation': '競品分析怎麼做？我用 n8n 自動每週監控競品動態，省下近 4 萬月費',
}
const yslink = (slug) => `\n<p>📖 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/${slug}">${T[slug]}</a></p>`

const PLAN = {
  'post-produce': { ys: 'multi-platform-posting' },
  'socailmedia': { ys: 'competitor-analysis-automation' },
}

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
for (const [slug, plan] of Object.entries(PLAN)) {
  const idx = slugs.indexOf(slug)
  if (idx === -1) { console.log(`✗ ${slug}：找不到`); continue }
  let c = rows[idx][5] ?? ''
  const notes = []

  // ① aicommand 交叉連結：首次「Claude Code」（未連結過才做）
  if (!c.includes('aicommand')) {
    const pos = c.indexOf('Claude Code')
    if (pos !== -1) {
      c = c.slice(0, pos) + `<a href="${CC_URL}">Claude Code</a>` + c.slice(pos + 'Claude Code'.length)
      notes.push('首次 Claude Code → aicommand 評測頁')
    }
  } else notes.push('已含 aicommand，跳過交叉連結')

  // ② 延伸閱讀解死巷（未連過該頁才做）
  if (!c.includes(`/blog/${plan.ys}`)) {
    const block = yslink(plan.ys)
    const b = c.search(/<\/body>/i)
    c = b !== -1 ? c.slice(0, b) + block + '\n' + c.slice(b) : c + block
    notes.push(`延伸閱讀 → ${plan.ys}`)
  } else notes.push(`已連 ${plan.ys}，跳過`)

  console.log(`\n→ ${slug}（第 ${idx + 1} 列）：${notes.join('；')}`)
  const p = c.indexOf(CC_URL); if (p !== -1) console.log('   交叉連結:', c.slice(p - 10, p + 70).replace(/\s+/g, ' '))
  const q = c.indexOf(`/blog/${plan.ys}`); if (q !== -1) console.log('   延伸閱讀:', c.slice(q - 30, q + 50).replace(/\s+/g, ' '))
  updates.push({ slug, rowNum: idx + 1, next: c })
}

console.log(`\n計畫更新 ${updates.length} 篇。`)
if (!WRITE) { console.log('（dry-run）確認後加 --write。'); process.exit(0) }
for (const u of updates) {
  await sheets.spreadsheets.values.update({ spreadsheetId: env.GOOGLE_SHEET_ID, range: `posts!F${u.rowNum}`, valueInputOption: 'RAW', requestBody: { values: [[u.next]] } })
  console.log(`✓ ${u.slug} 第 ${u.rowNum} 列已更新`)
}
console.log('完成。')
