// 把文中方框 CTA 換成「h4 一句話＋置中連結」。
// 原因：方格子貼上會剝掉 inline style，整個 <div style="border:..."> 框會消失，
//       只剩一段字加一個連結，跟前後內文糊在一起。改 h4 後方格子至少留得住語意。
//
// 舊：<div style="border:1px solid #c0392b;...">
//       <p style="...">一句話</p>
//       <a href="URL" style="...">按鈕文字</a>
//     </div>
// 新：<h4 style="text-align:center;">一句話</h4>
//     <p style="text-align:center;"><a href="URL">按鈕文字</a></p>
//
// 用法：
//   node scripts/convert-cta-to-h4.mjs --drafts          dry-run 掃 blog-drafts
//   node scripts/convert-cta-to-h4.mjs --drafts --write   實際改草稿
//   node scripts/convert-cta-to-h4.mjs --sheet            dry-run 掃線上 posts F 欄
//   node scripts/convert-cta-to-h4.mjs --sheet --write    實際回寫 posts
// 草稿是紅字 #c0392b，線上 posts 發布時已轉琥珀金 #fbbf24，兩色都認。
import fs from 'node:fs'
import path from 'node:path'

const WRITE = process.argv.includes('--write')
const DRAFTS = process.argv.includes('--drafts')
const SHEET = process.argv.includes('--sheet')
if (!DRAFTS && !SHEET) { console.error('要指定 --drafts 或 --sheet'); process.exit(1) }

// 方框開頭：<div style="border:1px solid #c0392b 或 #fbbf24 ...（各篇 padding/radius 有差異，不寫死）
const BOX_OPEN = /<div style="border:\s*1px solid\s*#(?:c0392b|fbbf24)[^"]*">/i

// 從 BOX_OPEN 位置往後找配對的 </div>（CTA 方框內不會再有巢狀 div，直接找下一個即可，
// 但還是掃一遍計數，之後有人加巢狀才不會默默切錯）
function findBox(html, from) {
  const m = BOX_OPEN.exec(html.slice(from))
  if (!m) return null
  const start = from + m.index
  let i = start + m[0].length
  let depth = 1
  while (depth > 0) {
    const nextOpen = html.indexOf('<div', i)
    const nextClose = html.indexOf('</div>', i)
    if (nextClose === -1) return null
    if (nextOpen !== -1 && nextOpen < nextClose) { depth++; i = nextOpen + 4 }
    else { depth--; i = nextClose + 6 }
  }
  return { start, end: i, inner: html.slice(start + m[0].length, i - 6) }
}

function convert(html) {
  let out = html
  let count = 0
  let cursor = 0
  for (;;) {
    const box = findBox(out, cursor)
    if (!box) break
    // 有幾篇的按鈕是包在 <p> 裡的（<p><a style="...">看服務</a></p>），那顆 <p> 不能算成
    // 文案段落，否則會跟下面重新產生的連結行重複輸出兩次。
    const paras = [...box.inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((m) => m[1].trim())
      .filter((p) => !/<a\s/i.test(p))
    const link = box.inner.match(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)
    if (!paras.length || !link) {
      // 結構不符預期就跳過，不要硬改
      console.warn('  ⚠ 跳過一個結構不符的方框')
      cursor = box.end
      continue
    }
    const [, url, label] = link
    const extra = paras.slice(1).map((p) => `\n<p style="text-align:center;">${p}</p>`).join('')
    const replacement =
      `<h4 style="text-align:center;">${paras[0]}</h4>${extra}\n` +
      `<p style="text-align:center;"><a href="${url}">${label.trim()}</a></p>`
    out = out.slice(0, box.start) + replacement + out.slice(box.end)
    cursor = box.start + replacement.length
    count++
  }
  return { out, count }
}

// --- 草稿 ---
if (DRAFTS) {
  // --skip=34-foo,35-bar：跳過指定草稿資料夾（例如另一個 session 正在編輯的那篇，
  // 同時寫檔會蓋掉對方的修改）
  const skip = (process.argv.find((a) => a.startsWith('--skip='))?.slice(7) ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean)
  const files = []
  for (const dir of fs.readdirSync('blog-drafts', { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    if (skip.includes(dir.name)) { console.log(`（跳過 ${dir.name}）`); continue }
    for (const f of fs.readdirSync(path.join('blog-drafts', dir.name))) {
      if (f.endsWith('.html')) files.push(path.join('blog-drafts', dir.name, f))
    }
  }
  let touched = 0, boxes = 0
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8')
    if (!BOX_OPEN.test(html)) continue
    const { out, count } = convert(html)
    if (!count) continue
    console.log(`${file}  ${count} 個方框`)
    touched++; boxes += count
    if (WRITE) fs.writeFileSync(file, out)
  }
  console.log(`\n草稿：${touched} 個檔案、${boxes} 個方框${WRITE ? ' → 已改寫' : '（dry-run，加 --write 才寫入）'}`)
}

// --- 線上 posts ---
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
    const slug = (rows[i][0] ?? '').trim()
    const content = rows[i][5] ?? ''
    if (!BOX_OPEN.test(content)) continue
    const { out, count } = convert(content)
    if (!count) continue
    console.log(`第 ${i + 1} 列 ${slug}  ${count} 個方框`)
    updates.push({ range: `posts!F${i + 1}`, values: [[out]] })
  }
  console.log(`\n線上 posts：${updates.length} 篇${WRITE ? '' : '（dry-run，加 --write 才寫入）'}`)
  if (WRITE && updates.length) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      requestBody: { valueInputOption: 'RAW', data: updates },
    })
    console.log(`✓ 已回寫 ${updates.length} 篇`)
  }
}
