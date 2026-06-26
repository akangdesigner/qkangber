// 在 6 篇 spoke 文章內補一條「延伸閱讀」回指 pillar（n8n-marketing-applications），閉集群迴路。
// 用法：node scripts/add-pillar-backlinks.mjs [--write]
//   預設 dry-run，印出每篇的現況與計畫動作；--write 才寫回 posts 分頁。
// 策略（安全優先）：已含 pillar 連結→跳過；有「延伸閱讀」→把 <li> 插進其後第一個 <ul>；否則→在結尾 append 一個延伸閱讀區塊。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const PILLAR_SLUG = 'n8n-marketing-applications'
const PILLAR_URL = `https://aiqkangber.com/blog/${PILLAR_SLUG}`
const PILLAR_ANCHOR = 'n8n 應用：行銷團隊必備的 6 大自動化工具'
const LI = `<li><a href="${PILLAR_URL}">${PILLAR_ANCHOR}</a></li>`
// 行內款（配合 press-release/multi-platform/n8n-auto-report 那種「📖 延伸閱讀：<a>」格式）
const BLOCK = `\n<p>📖 <strong>延伸閱讀</strong>：<a href="${PILLAR_URL}">${PILLAR_ANCHOR}</a></p>`

const SPOKES = [
  'press-release-blast',
  'multi-platform-posting',
  'competitor-analysis-automation',
  'edm-rfm-segmentation',
  'n8n-auto-report',
  'n8n-zeabur-beginner-guide',
]

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const existing = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
const rows = existing.data.values ?? []
const slugs = rows.map((r) => (r[0] ?? '').trim())

const updates = []
for (const slug of SPOKES) {
  const idx = slugs.indexOf(slug)
  if (idx === -1) { console.log(`✗ ${slug}：posts 找不到，跳過`); continue }
  const content = rows[idx][5] ?? ''
  if (content.includes(PILLAR_URL)) { console.log(`• ${slug}：已含 pillar 連結，跳過`); continue }

  let action, next
  if (/延伸閱讀/.test(content)) {
    // 插進「延伸閱讀」後第一個 <ul> 開頭
    const m = content.match(/延伸閱讀[\s\S]*?<ul[^>]*>/i)
    if (m) {
      const at = m.index + m[0].length
      next = content.slice(0, at) + LI + content.slice(at)
      action = '插進現有「延伸閱讀」清單'
    } else {
      next = content + BLOCK
      action = '有「延伸閱讀」字樣但找不到 <ul>，改在結尾 append 區塊'
    }
  } else {
    next = content + BLOCK
    action = '結尾 append 新的「延伸閱讀」區塊'
  }
  console.log(`→ ${slug}（第 ${idx + 1} 列）：${action}｜內文 ${content.length} → ${next.length}`)
  updates.push({ slug, rowNum: idx + 1, next })
}

console.log(`\n計畫更新 ${updates.length} 篇。`)
if (!WRITE) { console.log('（dry-run）確認無誤後加 --write 才會寫入。'); process.exit(0) }

for (const u of updates) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: `posts!F${u.rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[u.next]] },
  })
  console.log(`✓ ${u.slug} 第 ${u.rowNum} 列 F 欄已更新`)
}
console.log('完成。')
