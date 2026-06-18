// 把「文中方框 CTA」補進既有 9 篇文章：草稿插紅框版（#c0392b）、線上 posts 內文插琥珀框版（#fbbf24）。
// 每篇深連對應服務子頁／聯絡／電子報，文案逐篇手寫，錨點＝插在指定 <h2> 之前。
// 用法：node scripts/add-cta-box.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

// anchor = 要插在「之前」的那個 <h2> 標題包含的字串（每篇內唯一）
const ITEMS = [
  { slug: 'security-vulnerabilities-in-vibe-coding', draft: 'blog-drafts/01-vibe-coding-security/01-vibe-coding-security.html',
    target: 'https://aiqkangber.com/services/web-development', label: '看我的網站建置服務', anchor: '常見問題 FAQ',
    text: '用 AI 做網站很快，但資安這關不該自己用猜的。想要一個從第一行就把破口堵好的網站，這正是我在做的事。' },
  { slug: 'git-repository', draft: 'blog-drafts/02-git-repository/02-git-repository.html',
    target: 'https://aiqkangber.com/services/web-development', label: '看我的網站建置服務', anchor: '常見問題 FAQ',
    text: '想用 AI 自己做網站或小工具、又怕改一改救不回來？與其自己慢慢摸版本控制，我可以幫你把一套「邊做邊有保護」的開發流程建好。' },
  { slug: 'ai-coding-downsides', draft: 'blog-drafts/03-ai-coding-downsides/03-ai-coding-downsides.html',
    target: 'https://aiqkangber.com/services/web-development', label: '看我的軟體開發服務', anchor: '常見問題 FAQ',
    text: 'AI 寫程式的甜頭跟代價我都吃過。如果你想用 AI 加速開發、又不想等上線才發現一堆雷，可以把「有人把關」的那部分交給我。' },
  { slug: 'claude-mcp', draft: 'blog-drafts/04-claude-mcp/04-claude-mcp.html',
    target: 'https://aiqkangber.com/services/web-development', label: '看我的軟體開發服務', anchor: '常見問題 FAQ',
    text: '想讓 AI 真的能動手——串上你的 Figma、n8n、資料庫，而不只是聊天？這類客製整合，我可以幫你接起來。' },
  { slug: 'ai-architecture', draft: 'blog-drafts/05-ai-architecture/05-ai-architecture.html',
    target: 'https://aiqkangber.com/contact', label: '找我聊聊你的需求', anchor: '一個我猶豫很久的設計決定',
    text: '看完架構，真正難的是「我的需求到底該用哪一種」。這題不必自己糾結，把你的情況丟給我，我幫你判斷該不該上 AI Agent、怎麼搭最省。' },
  { slug: 'claude-design', draft: 'blog-drafts/06-claude-code-web-design/06-claude-code-web-design.html',
    target: 'https://aiqkangber.com/services/web-development', label: '看我的網站建置服務', anchor: '兩個一起用',
    text: '不想要一個「一看就是 AI 隨手做」的網站？從設計到實作，我可以幫你做出有你風格、又不廉價的成品。' },
  { slug: 'engineer-terms', draft: 'blog-drafts/07-engineer-terms-qa/07-engineer-terms-qa.html',
    target: 'https://aiqkangber.com/newsletter', label: '訂閱電子報', anchor: '總結',
    text: '喜歡這種把工程術語講成人話的內容？我每週會在電子報整理一則 AI 自動化的實作筆記，可以訂起來。' },
  { slug: 'multi-platform-posting', draft: 'blog-drafts/08-multi-platform-posting/08-multi-platform-posting.html',
    target: 'https://aiqkangber.com/services/social-media-automation', label: '看我的社群自動化服務', anchor: '常見問題 FAQ',
    text: '想要一篇定稿自動發上 FB、IG、Threads，又不想自己跟 API 和 token 纏鬥？這套我可以幫你的團隊接起來。' },
  { slug: 'n8n-auto-report', draft: 'blog-drafts/09-n8n-auto-report/09-n8n-auto-report.html',
    target: 'https://aiqkangber.com/services/data-report-automation', label: '看數據報表自動化服務', anchor: '常見問題 FAQ',
    text: '想要每週一早上自動收到這種報表、不用再手動拉數據？這正是我幫客戶建的數據報表自動化。' },
]

const box = (color, target, label, text) =>
  `<div style="border:1px solid ${color}; border-radius:10px; padding:20px 24px; margin:36px 0; text-align:center;">\n  <p style="margin:0 0 14px;">${text}</p>\n  <a href="${target}" style="display:inline-block; border:2px solid ${color}; color:${color}; text-decoration:none; font-weight:700; padding:9px 24px; border-radius:8px;">${label}</a>\n</div>`

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// 在 content 中第一個「<h2>…anchor…</h2>」之前插入 boxHtml；回傳 {ok, out}
function insertBefore(content, anchor, boxHtml) {
  const re = new RegExp('<h2>[^<]*' + esc(anchor) + '[^<]*</h2>')
  const m = content.match(re)
  if (!m) return { ok: false }
  const idx = m.index
  return { ok: true, out: content.slice(0, idx) + boxHtml + '\n\n' + content.slice(idx) }
}

// --- env / auth ---
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
const slugCol = rows.map((r) => (r[0] ?? '').trim())

const liveUpdates = []
for (const it of ITEMS) {
  console.log(`\n### ${it.slug}`)
  // --- 草稿（紅框）---
  let draftMsg = '草稿：'
  if (!fs.existsSync(it.draft)) draftMsg += '⚠ 找不到檔'
  else {
    const d = fs.readFileSync(it.draft, 'utf8')
    if (d.includes(it.text)) draftMsg += '已有（跳過）'
    else {
      const r = insertBefore(d, it.anchor, box('#c0392b', it.target, it.label, it.text))
      if (!r.ok) draftMsg += `⚠ 錨點「${it.anchor}」找不到`
      else { if (WRITE) fs.writeFileSync(it.draft, r.out); draftMsg += `插在「${it.anchor}」前 ✓` }
    }
  }
  console.log('  ' + draftMsg)

  // --- 線上 posts F 欄（琥珀框）---
  let liveMsg = '線上：'
  const ri = slugCol.indexOf(it.slug)
  if (ri === -1) liveMsg += '⚠ posts 找不到 slug'
  else {
    const content = rows[ri][5] ?? ''
    if (content.includes(it.text)) liveMsg += '已有（跳過）'
    else {
      const r = insertBefore(content, it.anchor, box('#fbbf24', it.target, it.label, it.text))
      if (!r.ok) liveMsg += `⚠ 錨點「${it.anchor}」找不到`
      else { liveUpdates.push({ rowNum: ri + 1, content: r.out }); liveMsg += `插在「${it.anchor}」前 → ${it.target} ✓` }
    }
  }
  console.log('  ' + liveMsg)
}

console.log(`\n要寫入的線上列數：${liveUpdates.length}`)
if (!WRITE) { console.log('（dry-run）確認無誤後加 --write 才會寫入草稿＋線上。'); process.exit(0) }

for (const u of liveUpdates) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: `posts!F${u.rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[u.content]] },
  })
  console.log(`✓ 已更新 posts F${u.rowNum}`)
}
console.log('完成。')
