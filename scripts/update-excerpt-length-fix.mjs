// One-off：把 24 篇 excerpt 超過 78 字的文章縮到 65-78 字（關鍵字前置），只動 E 欄。
// 用法：node scripts/update-excerpt-length-fix.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const UPDATES = [
  { slug: 'claude-mcp', excerpt: 'MCP 讓 Claude 不只給建議，直接讀你的 Figma、操作 n8n。白話講清楚 MCP 是什麼、怎麼接上第一個 server，附真實串接心得。' },
  { slug: 'claude-design', excerpt: 'Claude Code 做的網頁充滿 AI 味？用自己網站實測 Claude Design 協同設計，把罐頭版型救成有個性 UI/UX，並誠實講限制。' },
  { slug: 'ai-agent-trigger', excerpt: '為什麼有些 AI 不用你開口，就會自己定時整理報表、收到訂單自動處理？拆解 AI Agent 的排程與事件觸發機制，看懂主動式 AI 怎麼開始工作。' },
  { slug: 'ai-coding-downsides', excerpt: 'AI 寫程式的缺點有哪些？親手用 vibe coding 做了一個網站，整理出 8 個致命問題：看不懂、會幻覺、改 A 壞 B、資安沒人顧，教你怎麼自保。' },
  { slug: 'ai-tool-calling', excerpt: 'ChatGPT 不只會聊天，還能查資料、寄信、操作資料庫，靠的是 Tool Calling。拆解 AI 怎麼決定用不用工具、完整執行流程。' },
  { slug: 'prompt-engineering', excerpt: 'AI 給的答案不夠準？多半是提示詞沒寫好。用爛提示詞改成好提示詞的對照，講清楚 prompt engineering 的 5 大重點，中英文都適用。' },
  { slug: 'ai-website-deploy', excerpt: 'AI 做好的網站只有自己看得到，要怎麼讓全世界都連得到？用 Claude Code、Git、買網域、Zeabur 四步驟，帶你把網站真正送上線。' },
  { slug: 'ai-coding-tools', excerpt: '2026 AI 寫程式工具怎麼選？10 款工具（Cursor、Claude Code、Lovable）分三賽道比價格，新手工程師怎麼挑。' },
  { slug: 'n8n-apps-script', excerpt: 'n8n 和 Google Apps Script 怎麼搭配？用 IG 監控工具當例子，Apps Script 顧資料進表、n8n 串跨服務流程全自動。' },
  { slug: 'google-apps-script', excerpt: 'Google Apps Script 能做什麼？入門教學一次認識 4 種常見用法：自訂函式、定時觸發器、自動寄信、網頁應用程式，附免費額度與部署過程。' },
  { slug: 'ai-agent-planning', excerpt: '為什麼你只講一句話，AI 就自己拆解、一步步把任務做完？看懂 AI Agent 的推理與規劃：先想清楚問題、再排出步驟的運作方式。' },
  { slug: 'claude-code-github', excerpt: '想學 Claude Code 教學卻不知道從何開始？從安裝、建立專案、Git 版本控制到推上 GitHub 一次教完，全程用提示詞不用背指令。' },
  { slug: 'multi-platform-posting', excerpt: '社群自動發文怎麼做？分享我為什麼捨棄 Buffer，改用 n8n 把一篇定稿自動發到 FB、IG、Threads，含 token 過期問題。' },
  { slug: 'git-repository', excerpt: '身為文組，我用 vibe coding 搭網站時被 AI 改爛專案、回不去，才學會 git。白話講清楚 git 倉庫、commit、還原怎麼運作。' },
  { slug: 'ai-website-development', excerpt: '不會寫程式也想要專屬網站？白話搞懂什麼是 Vibe Coding，實測比較 Claude Code、Cursor、Codex，帶你從零做到上線。' },
  { slug: 'claude-code-commands', excerpt: '想學 Claude Code 指令卻不知道從哪打起？照實際開發情境整理 30 個必學指令的使用時機與常見錯誤，不用死背指令清單。' },
  { slug: 'competitor-analysis-automation', excerpt: '競品分析怎麼做才不用花大錢？企業級輿情工具月費近 4 萬還要簽一年，教你用 n8n 自己做一套輕量競品分析，每週自動生成監控週報。' },
  { slug: 'ai-agent-memory', excerpt: 'AI 為什麼老是忘記你說過的話？拆解 AI Agent 的記憶機制：LLM 為何「無狀態」、短期記憶與長期記憶差在哪，以及三種記憶類型。' },
  { slug: 'n8n-marketing-applications', excerpt: 'n8n 在行銷可以做什麼？整理行銷團隊必備的 5 大 n8n 應用：新聞稿群發、多平台發文、競品分析、RFM／EDM、自動週報。' },
  { slug: 'n8n-auto-report', excerpt: 'GA4 報表每週手動拉到崩潰？用 n8n 自動報表的實戰流程，一把服務帳號接遍 GSC、GA4、Sheets，每週自動生成行銷數據週報。' },
  { slug: 'edm-rfm-segmentation', excerpt: 'EDM 自動化怎麼做？拿一個電商客戶一整年的 Shopline 訂單做 RFM 顧客分群，發現近九成只買一次，用 n8n 精準發信給對的人。' },
  { slug: 'n8n-zeabur-beginner-guide', excerpt: 'n8n 教學從 0 到 40 分新手友善攻略：入門核心概念、Zeabur 部署步驟、8 個基本節點，看完就能動手做出第一個自動化流程。' },
  { slug: 'engineer-terms', excerpt: '環境變數、CI/CD、PR、git rebase、Linter……這些工程師術語到底在說什麼？20 個開發行話全部用白話解釋，一篇看懂。' },
  { slug: 'ai-architecture', excerpt: 'AI Agent 是什麼？用 AI 架構四個元件白話拆解，帶你看懂它怎麼從會聊天進化到會自己做事，判斷你的需求該不該用 AI Agent。' },
]

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

const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'posts!A:E' })
const rows = data.values ?? []

let notFound = 0
for (const u of UPDATES) {
  const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === u.slug)
  if (idx === -1) {
    console.error(`✗ 找不到 slug=${u.slug}，略過`)
    notFound++
    continue
  }
  const sheetRow = idx + 1
  const oldLen = [...(rows[idx][4] ?? '')].length
  const newLen = [...u.excerpt].length
  console.log(`\nslug=${u.slug}  row=${sheetRow}  ${oldLen}字 → ${newLen}字`)

  if (!WRITE) continue

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `posts!E${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[u.excerpt]] },
  })
  console.log(`  ✓ 已更新 excerpt(E)`)
}

console.log(`\n共 ${UPDATES.length} 筆，找不到 ${notFound} 筆`)
if (!WRITE) console.log('（dry-run）加上 --write 才會寫回 Sheet。')
