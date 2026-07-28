// 偵測 scripts/publish-*.mjs 的 TITLE／EXCERPT 常數是否已跟線上 posts 分頁脫節。
// 脫節的腳本一旦再跑 --write --update，會把線上的 SEO 修正靜默蓋回舊版。
// 用法：node scripts/check-publish-drift.mjs [--fix]   預設只報告，--fix 才回填常數。
import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'

const FIX = process.argv.includes('--fix')
const DIR = 'scripts'

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})
const sheets = google.sheets({ version: 'v4', auth })

const { data } = await sheets.spreadsheets.values.get({
  spreadsheetId: env.GOOGLE_SHEET_ID,
  range: 'posts!A:E',
})
const live = new Map()
for (const r of (data.values ?? []).slice(1)) {
  const slug = (r[0] ?? '').trim()
  if (slug) live.set(slug, { title: r[1] ?? '', excerpt: (r[4] ?? '').trim() })
}

// 常數可能是單引號或反引號（多行 excerpt），兩種都要抓。
const constRe = (name) =>
  new RegExp(`^const ${name} = (?:'((?:[^'\\\\]|\\\\.)*)'|\`([\\s\\S]*?)\`)$`, 'm')

const files = fs
  .readdirSync(DIR)
  .filter((f) => /^publish-.*\.mjs$/.test(f))
  .sort()

let drifted = 0
let missing = 0
const report = []

for (const f of files) {
  const p = path.join(DIR, f)
  const src = fs.readFileSync(p, 'utf8')
  const slugM = src.match(constRe('SLUG'))
  if (!slugM) {
    report.push(`?  ${f}  找不到 SLUG 常數，跳過`)
    continue
  }
  const slug = slugM[1] ?? slugM[2]
  const row = live.get(slug)
  if (!row) {
    missing++
    report.push(`✗  ${f}  slug=${slug} 不在線上 posts（未發布或 slug 不符）`)
    continue
  }

  const issues = []
  for (const [name, liveVal] of [
    ['TITLE', row.title],
    ['EXCERPT', row.excerpt],
  ]) {
    const m = src.match(constRe(name))
    if (!m) continue // 該腳本沒有這個常數就不管
    const localVal = (m[1] ?? m[2]).replace(/\\'/g, "'")
    if (localVal.trim() !== liveVal.trim()) {
      issues.push({ name, localVal, liveVal, raw: m[0] })
    }
  }

  if (!issues.length) {
    report.push(`ok ${f}`)
    continue
  }

  drifted++
  report.push(`\n⚠  ${f}  (slug=${slug})`)
  let next = src
  for (const it of issues) {
    report.push(`     ${it.name} 本機：${it.localVal.slice(0, 60)}${it.localVal.length > 60 ? '…' : ''}`)
    report.push(`     ${it.name} 線上：${it.liveVal.slice(0, 60)}${it.liveVal.length > 60 ? '…' : ''}`)
    if (FIX) {
      const escaped = it.liveVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      next = next.replace(it.raw, `const ${it.name} = '${escaped}'`)
    }
  }
  if (FIX) {
    fs.writeFileSync(p, next, 'utf8')
    report.push(`     ✓ 已回填 ${issues.map((i) => i.name).join('、')}`)
  }
}

console.log(report.join('\n'))
console.log(
  `\n合計 ${files.length} 支腳本：${drifted} 支常數過期、${missing} 支 slug 對不到線上、${files.length - drifted - missing} 支正常`,
)
if (drifted && !FIX) console.log('加上 --fix 會用線上現值回填本機常數。')
