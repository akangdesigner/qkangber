// 補 3 條語意內鏈指向 engineer-mindset（解全站唯一孤兒、傳權重給想排的頁）。
// 用法：node scripts/link-to-engineer-mindset.mjs [--write]　預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const EM_URL = 'https://aiqkangber.com/blog/engineer-mindset'
const EM_TITLE = 'AI 會取代工程師嗎？我關掉全自動寫文工作流，決定回來跟它一起動手'
const LINK = `<a href="${EM_URL}">${EM_TITLE}</a>`
const BLOCK = `\n<p>📖 <strong>延伸閱讀</strong>：${LINK}</p>`

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

// 每篇的處理：merge=把連結併進既有「延伸閱讀」行；append=文末補一條
const PLAN = {
  'ai-coding-downsides': {
    mode: 'merge',
    // 既有延伸閱讀行末：…版本控制</a></p> → …版本控制</a>、<新連結></p>
    find: 'git 倉庫是什麼？文組開發者血淚經驗分享：我被 AI 改爛專案後，才終於搞懂版本控制</a></p>',
    repl: 'git 倉庫是什麼？文組開發者血淚經驗分享：我被 AI 改爛專案後，才終於搞懂版本控制</a>、' + LINK + '</p>',
  },
  'git-repository': { mode: 'append' },
  'security-vulnerabilities-in-vibe-coding': { mode: 'append' },
}

const updates = []
for (const [slug, plan] of Object.entries(PLAN)) {
  const idx = slugs.indexOf(slug)
  if (idx === -1) { console.log(`✗ ${slug}：找不到`); continue }
  const content = rows[idx][5] ?? ''
  if (content.includes(EM_URL)) { console.log(`• ${slug}：已連 engineer-mindset，跳過`); continue }

  let next
  if (plan.mode === 'merge') {
    if (!content.includes(plan.find)) { console.log(`⚠ ${slug}：找不到 merge 錨點，改用文末 append`); next = content + BLOCK }
    else next = content.replace(plan.find, plan.repl)
  } else {
    // 若內文有 </body></html> 包裹，插在 </body> 前；否則直接 append
    const bodyClose = content.search(/<\/body>/i)
    if (bodyClose !== -1) next = content.slice(0, bodyClose) + BLOCK + '\n' + content.slice(bodyClose)
    else next = content + BLOCK
  }
  console.log(`\n→ ${slug}（第 ${idx + 1} 列，${plan.mode}）內文 ${content.length} → ${next.length}`)
  // 印出變更附近 160 字
  const at = next.indexOf(EM_URL)
  console.log('   ', next.slice(Math.max(0, at - 90), at + 80).replace(/\s+/g, ' '))
  updates.push({ slug, rowNum: idx + 1, next })
}

console.log(`\n計畫更新 ${updates.length} 篇。`)
if (!WRITE) { console.log('（dry-run）確認後加 --write 才寫入。'); process.exit(0) }
for (const u of updates) {
  await sheets.spreadsheets.values.update({ spreadsheetId: env.GOOGLE_SHEET_ID, range: `posts!F${u.rowNum}`, valueInputOption: 'RAW', requestBody: { values: [[u.next]] } })
  console.log(`✓ ${u.slug} 第 ${u.rowNum} 列 F 欄已更新`)
}
console.log('完成。')
