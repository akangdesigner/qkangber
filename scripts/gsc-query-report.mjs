// 原生 Search Console API 拉搜尋明細，繞過壞掉的 GSC MCP（逐列格式化 bug）。
// 用法：node scripts/gsc-query-report.mjs [天數] [--page] [--csv 路徑]
//   天數預設 90；--page 改成以頁面維度彙整；--csv 另存完整結果。
// 認證沿用 .env.local 的 GOOGLE_SERVICE_ACCOUNT_JSON（需該 SA 已加進 GSC 資源）。
import fs from 'fs'
import { google } from 'googleapis'

const SITE = 'sc-domain:aiqkangber.com'
const days = Number(process.argv.find((a) => /^\d+$/.test(a))) || 90
const byPage = process.argv.includes('--page')
const csvIdx = process.argv.indexOf('--csv')
const csvPath = csvIdx !== -1 ? process.argv[csvIdx + 1] : null

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
})
const sc = google.searchconsole({ version: 'v1', auth })

const end = new Date(Date.now() - 2 * 86400000) // GSC 約延遲 2 天
const start = new Date(end.getTime() - days * 86400000)
const fmt = (d) => d.toISOString().slice(0, 10)
const dimension = byPage ? 'page' : 'query'

const res = await sc.searchanalytics.query({
  siteUrl: SITE,
  requestBody: {
    startDate: fmt(start),
    endDate: fmt(end),
    dimensions: [dimension],
    rowLimit: 1000,
    dataState: 'all',
  },
})

const rows = (res.data.rows ?? []).map((r) => ({
  key: r.keys[0],
  clicks: r.clicks,
  impressions: r.impressions,
  ctr: +(r.ctr * 100).toFixed(1),
  position: +r.position.toFixed(1),
}))
rows.sort((a, b) => b.impressions - a.impressions)

console.log(`\n${SITE}  ${fmt(start)} → ${fmt(end)}（${days} 天）｜維度=${dimension}`)
console.log(`不重複 ${dimension}：${rows.length}　總曝光 ${rows.reduce((s, r) => s + r.impressions, 0)}　總點擊 ${rows.reduce((s, r) => s + r.clicks, 0)}\n`)
const pad = (s, n) => String(s).padEnd(n)
console.log(pad(dimension, byPage ? 60 : 34), 'imp', ' clk', ' ctr%', ' pos')
for (const r of rows.slice(0, 60)) {
  console.log(pad((r.key ?? '').slice(0, byPage ? 58 : 32), byPage ? 60 : 34), pad(r.impressions, 4), pad(r.clicks, 4), pad(r.ctr, 5), r.position)
}

if (csvPath) {
  const csv = [`${dimension},clicks,impressions,ctr,position`, ...rows.map((r) => `"${r.key}",${r.clicks},${r.impressions},${r.ctr},${r.position}`)].join('\n')
  fs.writeFileSync(csvPath, csv, 'utf8')
  console.log(`\n完整 ${rows.length} 列已存：${csvPath}`)
}
