// One-off: 機會頁內鏈救援——press-release-blast / multi-platform-posting / services/customer-service-bot
// 用法：node scripts/add-rescue-inbound-links.mjs [--write]   預設 dry-run。
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')

const PRESS_LINK =
  '<p>📖 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/press-release-blast">新聞稿群發怎麼自動化？我用 n8n 讓 AI 寫稿、我審完一鍵發給整份媒體名單</a></p>'
const MULTI_LINK =
  '<p>📖 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/multi-platform-posting">社群自動發文怎麼做？我捨棄 Buffer，用 n8n 一篇貼文同時發到 FB、IG、Threads</a></p>'
const PILLAR_LINE = '<p>👉 <a href="https://aiqkangber.com/blog/n8n-marketing-applications">'

const EDITS = [
  {
    slug: 'multi-platform-posting',
    find: PILLAR_LINE,
    replace: PRESS_LINK + '\n' + PILLAR_LINE,
    note: '結尾 pillar 連結前插入 press-release-blast 延伸閱讀',
  },
  {
    slug: 'edm-rfm-segmentation',
    find: PILLAR_LINE,
    replace: PRESS_LINK + '\n' + PILLAR_LINE,
    note: '結尾 pillar 連結前插入 press-release-blast 延伸閱讀',
  },
  {
    slug: 'socailmedia',
    find: '<p>📖 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/competitor-analysis-automation">',
    replace:
      MULTI_LINK + '\n<p>📖 <strong>延伸閱讀</strong>：<a href="https://aiqkangber.com/blog/competitor-analysis-automation">',
    note: '結尾延伸閱讀區插入 multi-platform-posting',
  },
  {
    slug: 'competitor-analysis-automation',
    find: PILLAR_LINE,
    replace: MULTI_LINK + '\n' + PILLAR_LINE,
    note: '結尾 pillar 連結前插入 multi-platform-posting 延伸閱讀',
  },
  {
    slug: 'customer-service-bot-rag',
    find: '<a href="https://aiqkangber.com/services" target="_blank" rel="noopener"><strong>智能客服</strong></a>',
    replace:
      '<a href="https://aiqkangber.com/services/customer-service-bot" target="_blank" rel="noopener"><strong>智能客服</strong></a>',
    note: '前言「智能客服」錨文字改指 /services/customer-service-bot',
  },
  {
    slug: 'ai-architecture',
    find: '可以看〈<a href="https://aiqkangber.com/blog/customer-service-bot-rag">客服機器人怎麼建</a>〉。',
    replace:
      '可以看〈<a href="https://aiqkangber.com/blog/customer-service-bot-rag">客服機器人怎麼建</a>〉；想直接找人幫你把客服機器人接上 LINE 或 IG，我有提供<a href="https://aiqkangber.com/services/customer-service-bot">客服 AI 自動回覆服務</a>。',
    note: '記憶段落補客服服務頁導流',
  },
]

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const sheets = google.sheets({ version: 'v4', auth })
const { data } = await sheets.spreadsheets.values.get({ spreadsheetId: env.GOOGLE_SHEET_ID, range: 'posts!A:F' })
const rows = data.values ?? []

for (const e of EDITS) {
  const idx = rows.findIndex((r, i) => i > 0 && (r[0] ?? '').trim() === e.slug)
  if (idx === -1) { console.error(`✗ ${e.slug}：找不到列，略過`); continue }
  const content = rows[idx][5] ?? ''
  const hits = content.split(e.find).length - 1
  console.log(`\n${e.slug}（row ${idx + 1}）：${e.note}`)
  if (hits !== 1) { console.error(`  ✗ 錨點出現 ${hits} 次（需恰好 1 次），跳過`); continue }
  console.log('  ✓ 錨點唯一命中')

  if (!WRITE) continue

  // 慣例防呆：寫回前確保無紅字殘留
  const next = content.replace(e.find, e.replace).replace(/#c0392b/gi, '#fbbf24')
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: `posts!F${idx + 1}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[next]] },
  })
  console.log('  ✓ 已寫回')
}

if (!WRITE) console.log('\n（dry-run）加上 --write 才會寫回 Sheet。')
