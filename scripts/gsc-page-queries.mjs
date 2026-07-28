// 查「單一頁面」是靠哪些 query 拿到曝光的（page 維度 + query 維度交叉）。
// 用法：node scripts/gsc-page-queries.mjs <slug|路徑片段> [天數]
//   例：node scripts/gsc-page-queries.mjs claude-design 90
// 注意：GSC 對低頻 query 會匿名化，量小的頁抓到的列數會遠少於實際曝光。
import fs from 'fs'
import { google } from 'googleapis'

const SITE = 'sc-domain:aiqkangber.com'
const args = process.argv.slice(2)
const needle = args.find((a) => !/^\d+$/.test(a))
const days = Number(args.find((a) => /^\d+$/.test(a))) || 90
if (!needle) {
  console.error('用法：node scripts/gsc-page-queries.mjs <slug> [天數]')
  process.exit(1)
}

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
})
const sc = google.searchconsole({ version: 'v1', auth })

const end = new Date(Date.now() - 2 * 86400000)
const start = new Date(end.getTime() - days * 86400000)
const fmt = (d) => d.toISOString().slice(0, 10)

const res = await sc.searchanalytics.query({
  siteUrl: SITE,
  requestBody: {
    startDate: fmt(start),
    endDate: fmt(end),
    dimensions: ['query'],
    dimensionFilterGroups: [
      { filters: [{ dimension: 'page', operator: 'contains', expression: needle }] },
    ],
    rowLimit: 500,
    dataState: 'all',
  },
})

const rows = (res.data.rows ?? [])
  .map((r) => ({
    q: r.keys[0],
    imp: r.impressions,
    clk: r.clicks,
    ctr: +(r.ctr * 100).toFixed(1),
    pos: +r.position.toFixed(1),
  }))
  .sort((a, b) => b.imp - a.imp)

console.log(`\n頁面含「${needle}」　${fmt(start)} → ${fmt(end)}（${days} 天）`)
console.log(
  `抓到 ${rows.length} 個 query　曝光合計 ${rows.reduce((s, r) => s + r.imp, 0)}　點擊合計 ${rows.reduce((s, r) => s + r.clk, 0)}`,
)
console.log('（低頻 query 會被 GSC 匿名化，合計低於頁面實際曝光是正常的）\n')
const pad = (s, n) => String(s).padEnd(n)
console.log(pad('query', 40), 'imp', ' clk', ' ctr%', ' pos')
for (const r of rows.slice(0, 60)) {
  console.log(pad(r.q.slice(0, 38), 40), pad(r.imp, 4), pad(r.clk, 4), pad(r.ctr, 5), r.pos)
}
if (!rows.length) console.log('（沒有任何未匿名化的 query，代表這頁曝光全來自低頻長尾）')
