// 把 codetools-N slug 改成關鍵字 slug（A 欄），並修正內文中指向舊 slug 的連結（F 欄）。
// 用法：node scripts/rename-codetools-slugs.mjs [--write]　預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const MAP = {
  'codetools': 'internal-tools-nextjs',
  'codetools-2': 'html-cleaner-tool',
  'codetools-3': 'ig-data-tracking',
  'codetools-5': 'google-search-console-api',
  'codetools-6': 'customer-service-bot-rag',
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

const updates = [] // {range, value}

// ① A 欄改 slug
console.log('── ① slug 改名（A 欄）──')
for (const [oldSlug, newSlug] of Object.entries(MAP)) {
  const idx = slugs.indexOf(oldSlug)
  if (idx === -1) { console.log(`✗ ${oldSlug}：找不到`); continue }
  console.log(`→ 第 ${idx + 1} 列 A: ${oldSlug} → ${newSlug}`)
  updates.push({ range: `posts!A${idx + 1}`, value: newSlug })
}

// ③ 內文連結改向（F 欄）：每篇內容把 /blog/<old> 換成 /blog/<new>
console.log('\n── ③ 內文連結改向（F 欄）──')
for (let i = 0; i < rows.length; i++) {
  let c = rows[i][5] ?? ''
  if (!c) continue
  let changed = false
  for (const [oldSlug, newSlug] of Object.entries(MAP)) {
    // 比對 /blog/oldSlug 但不要誤吃更長的 slug（codetools 不可吃 codetools-2）
    const re = new RegExp(`/blog/${oldSlug}(?![-0-9a-z])`, 'g')
    const n = (c.match(re) || []).length
    if (n) { c = c.replace(re, `/blog/${newSlug}`); changed = true; console.log(`→ ${slugs[i]} 內文：/blog/${oldSlug} → /blog/${newSlug} x${n}`) }
  }
  if (changed) updates.push({ range: `posts!F${i + 1}`, value: c })
}

console.log(`\n計畫 ${updates.length} 筆更新。`)
if (!WRITE) { console.log('（dry-run）確認後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  requestBody: { valueInputOption: 'RAW', data: updates.map((u) => ({ range: u.range, values: [[u.value]] })) },
})
console.log('✓ 全部寫入完成。')
