// 修 convert-cta-to-h4.mjs 第一版的重複連結：
// 少數幾篇的按鈕原本包在 <p> 裡（<p><a style="border:...">看服務</a></p>），
// 轉換時那顆 <p> 被當成文案段落保留下來，又另外產生一行乾淨連結，變成連續兩行同一個連結。
// 這支只刪掉「還帶著 inline style 的那一行」，保留乾淨的那一行。
// 用法：
//   node scripts/fix-cta-h4-dup-link.mjs --drafts [--write]
//   node scripts/fix-cta-h4-dup-link.mjs --sheet  [--write]
import fs from 'node:fs'
import path from 'node:path'

const WRITE = process.argv.includes('--write')
const DRAFTS = process.argv.includes('--drafts')
const SHEET = process.argv.includes('--sheet')
if (!DRAFTS && !SHEET) { console.error('要指定 --drafts 或 --sheet'); process.exit(1) }

// 帶 inline style 的按鈕段落（就是要刪掉的那一行）
const STYLED = /<p[^>]*>\s*<a\s+href="([^"]+)"[^>]*style="[^"]*border:\s*1px solid\s*#(?:c0392b|fbbf24)[^"]*"[^>]*>([\s\S]*?)<\/a>\s*<\/p>\s*/gi

function fix(html) {
  let count = 0
  const out = html.replace(STYLED, (whole, url, label) => {
    // 只有在後面緊接著同網址的乾淨連結時才刪，避免誤砍沒被轉換過的獨立按鈕
    const rest = html.slice(html.indexOf(whole) + whole.length)
    const clean = new RegExp(`^<p style="text-align:center;"><a href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`, 'i')
    if (!clean.test(rest.trimStart())) return whole
    count++
    return ''
  })
  return { out, count }
}

if (DRAFTS) {
  let touched = 0
  for (const dir of fs.readdirSync('blog-drafts', { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    for (const f of fs.readdirSync(path.join('blog-drafts', dir.name))) {
      if (!f.endsWith('.html')) continue
      const file = path.join('blog-drafts', dir.name, f)
      const html = fs.readFileSync(file, 'utf8')
      const { out, count } = fix(html)
      if (!count) continue
      console.log(`${file}  刪掉 ${count} 行重複連結`)
      touched++
      if (WRITE) fs.writeFileSync(file, out)
    }
  }
  console.log(`\n草稿：${touched} 個檔案${WRITE ? ' → 已修' : '（dry-run）'}`)
}

if (SHEET) {
  const { google } = await import('googleapis')
  const env = {}
  for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue
    const i = line.indexOf('='); if (i === -1) continue
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
  const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
  const sheets = google.sheets({ version: 'v4', auth })
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:O' })
  const rows = res.data.values ?? []
  const updates = []
  for (let i = 1; i < rows.length; i++) {
    const { out, count } = fix(rows[i][5] ?? '')
    if (!count) continue
    console.log(`第 ${i + 1} 列 ${rows[i][0]}  刪掉 ${count} 行重複連結`)
    updates.push({ range: `posts!F${i + 1}`, values: [[out]] })
  }
  console.log(`\n線上 posts：${updates.length} 篇${WRITE ? '' : '（dry-run）'}`)
  if (WRITE && updates.length) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      requestBody: { valueInputOption: 'RAW', data: updates },
    })
    console.log(`✓ 已回寫 ${updates.length} 篇`)
  }
}
