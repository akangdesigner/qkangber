// One-off（第二輪）：縮短 5 篇超過 SERP 版位寬度的文章標題，只動 posts 分頁 B 欄。
// 同時同步對應 publish-*.mjs 的 TITLE 常數，避免日後跑 --update 把修正靜默蓋回。
// 用法：node scripts/update-title-length-fix-2.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const UPDATES = [
  {
    slug: 'google-apps-script',
    title: 'Google Apps Script 能做什麼？4 種用法與免費額度入門教學',
    script: 'scripts/publish-google-apps-script.mjs',
  },
  {
    slug: 'claude-design',
    title: 'Claude Code 做的網頁有 AI 味？Claude Design 讓 UI/UX 質感飛躍',
    script: 'scripts/publish-claude-design.mjs',
  },
  {
    slug: 'git-repository',
    title: 'git 倉庫是什麼？AI 改壞專案時，commit、還原、分支怎麼救',
    script: null, // 這篇沒有對應的發布腳本
  },
  {
    slug: 'ai-agent-trigger',
    title: 'AI Agent 為什麼不用人下指令就能自動工作？排程與事件觸發機制詳解',
    script: 'scripts/publish-ai-agent-trigger.mjs',
  },
  {
    slug: 'ai-architecture',
    title: 'AI Agent 是什麼？用 AI 架構解析它如何從會聊天變成會自己做事',
    script: 'scripts/publish-ai-architecture.mjs',
  },
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
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const sheets = google.sheets({ version: 'v4', auth })

const { data } = await sheets.spreadsheets.values.get({
  spreadsheetId: sheetId,
  range: 'posts!A:B',
})
const rows = data.values ?? []

for (const u of UPDATES) {
  const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === u.slug)
  if (idx === -1) {
    console.error(`✗ 找不到 slug=${u.slug}，略過`)
    continue
  }
  const sheetRow = idx + 1
  console.log(`\nslug=${u.slug}  row=${sheetRow}`)
  console.log(`  舊：${rows[idx][1] ?? ''}`)
  console.log(`  新：${u.title}`)

  if (WRITE) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `posts!B${sheetRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[u.title]] },
    })
    console.log('  ✓ Sheet B 欄已更新')
  }

  if (!u.script) {
    console.log('  －無對應發布腳本')
    continue
  }
  const src = fs.readFileSync(u.script, 'utf8')
  const re = /^const TITLE = '.*'$/m
  if (!re.test(src)) {
    console.error(`  ✗ ${u.script} 找不到 TITLE 常數，請手動確認`)
    continue
  }
  const oldTitle = src.match(re)[0]
  console.log(`  腳本舊：${oldTitle.replace(/^const TITLE = '|'$/g, '')}`)
  if (WRITE) {
    fs.writeFileSync(u.script, src.replace(re, `const TITLE = '${u.title}'`), 'utf8')
    console.log(`  ✓ ${u.script} 已同步`)
  }
}

if (!WRITE) console.log('\n（dry-run）加上 --write 才會實際寫入。')
