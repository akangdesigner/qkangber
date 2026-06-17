// 部落格分類重整：兩層（主分類+副分類）→ 扁平單層 5 類。
// 把 posts 分頁每篇的 M 欄（category）改成新分類、O 欄（副分類）清空。
// 用法：node scripts/recategorize-blog.mjs
import fs from 'fs'
import { google } from 'googleapis'

const SPREADSHEET_ID = '1VwGs_i7b-kk9HQtd0gBbkS8bFSO8cU7esKSGhEtJVzM'
const TAB = 'posts'

// slug → 新分類（扁平 5 類）。電商自動化 / AI 趨勢觀點 目前 0 篇，先卡位不指派。
const CATEGORY_BY_SLUG = {
  // 行銷自動化（7）
  'post-produce': '行銷自動化',
  'codetools-3': '行銷自動化',
  'codetools-4': '行銷自動化',
  'codetools-5': '行銷自動化',
  'socailmedia': '行銷自動化',
  'multi-platform-posting': '行銷自動化',
  'n8n-auto-report': '行銷自動化',
  // AI Agent（3）
  'codetools-6': 'AI Agent',
  'claude-mcp': 'AI Agent',
  'ai-architecture': 'AI Agent',
  // AI 軟體開發（7）
  'codetools': 'AI 軟體開發',
  'codetools-2': 'AI 軟體開發',
  'security-vulnerabilities-in-vibe-coding': 'AI 軟體開發',
  'git-repository': 'AI 軟體開發',
  'ai-coding-downsides': 'AI 軟體開發',
  'claude-design': 'AI 軟體開發',
  'engineer-terms': 'AI 軟體開發',
}

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

// 1. 讀 A 欄 slug，建 slug → 列號（1-based，含表頭列1）
const { data } = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: `${TAB}!A2:A`,
})
const rows = data.values || []
const rowBySlug = {}
rows.forEach((r, idx) => {
  const slug = (r[0] || '').trim()
  if (slug) rowBySlug[slug] = idx + 2 // A2 = row 2
})

// 2. 組 batchUpdate：每篇 M 欄寫新分類、O 欄清空
const updates = []
const missing = []
for (const [slug, cat] of Object.entries(CATEGORY_BY_SLUG)) {
  const row = rowBySlug[slug]
  if (!row) { missing.push(slug); continue }
  updates.push({ range: `${TAB}!M${row}`, values: [[cat]] })
  updates.push({ range: `${TAB}!O${row}`, values: [['']] })
}

if (missing.length) {
  console.error('⚠️ 在 posts 分頁找不到這些 slug，未處理：', missing.join(', '))
}

await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: SPREADSHEET_ID,
  requestBody: { valueInputOption: 'RAW', data: updates },
})

const counts = {}
for (const cat of Object.values(CATEGORY_BY_SLUG)) counts[cat] = (counts[cat] || 0) + 1
console.log(`已更新 ${updates.length / 2} 篇（M 欄改分類、O 欄清空）`)
console.log('分佈：', counts)
