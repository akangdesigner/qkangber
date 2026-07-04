// One-off: 更新 posts 分頁的 claude-mcp 文章：新標題 + 新內文（紅 #c0392b → 琥珀 #fbbf24）+ excerpt。
// 用法：node scripts/update-claude-mcp-post.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const SLUG = 'claude-mcp'
const TITLE = 'MCP 是什麼？讓 Claude 不只給建議、還能直接動手改你的 Figma 和 n8n'
const EXCERPT = 'MCP（Model Context Protocol）讓 Claude 不只給你建議，而是直接讀你的 Figma、操作你的 n8n。用白話講清楚 MCP 是什麼、三層架構怎麼運作、怎麼動手接上第一個 server，並分享實際串 n8n、Figma MCP 的真實心得。'

// 重寫版去重官網內容：抽 body、去 h1、紅 #c0392b → 琥珀 #fbbf24（與其他 publish 腳本同慣例）
const raw = fs.readFileSync('blog-drafts/04-claude-mcp/04-claude-mcp.rewrite.html', 'utf8')
const bodyM = raw.match(/<body>([\s\S]*?)<\/body>/i)
const content = (bodyM ? bodyM[1] : raw).replace(/<h1>[\s\S]*?<\/h1>/i, '').trim().replace(/#c0392b/gi, '#fbbf24')
const stillRed = (content.match(/#c0392b/gi) ?? []).length

// --- load .env.local ---
const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}

const sheetId = env.GOOGLE_SHEET_ID
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'posts!A:N' })
const rows = data.values ?? []
const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === SLUG)
if (idx === -1) {
  console.error(`找不到 slug=${SLUG}。現有 slug：`)
  console.error(rows.slice(1).map((r) => '  ' + (r[0] ?? '')).join('\n'))
  process.exit(1)
}

const sheetRow = idx + 1 // 1-based
const oldTitle = rows[idx][1] ?? ''
const oldAmber = (content.match(/#fbbf24/gi) ?? []).length
console.log(`slug=${SLUG}  sheet row=${sheetRow}`)
console.log(`舊標題：${oldTitle}`)
console.log(`新標題：${TITLE}`)
console.log(`內文 #fbbf24 共 ${oldAmber} 處；轉換後殘留 #c0392b ${stillRed} 處`)

if (!WRITE) { console.log('（dry-run）加上 --write 才會寫回 Sheet。'); process.exit(0) }

await sheets.spreadsheets.values.update({
  spreadsheetId: sheetId,
  range: `posts!B${sheetRow}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[TITLE]] },
})
await sheets.spreadsheets.values.update({
  spreadsheetId: sheetId,
  range: `posts!E${sheetRow}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[EXCERPT]] },
})
await sheets.spreadsheets.values.update({
  spreadsheetId: sheetId,
  range: `posts!F${sheetRow}`,
  valueInputOption: 'RAW',
  requestBody: { values: [[content]] },
})
console.log(`已更新 posts row ${sheetRow}：標題(B) / excerpt(E) / 內文(F) ✓`)
