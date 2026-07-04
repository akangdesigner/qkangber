// 用 DataForSEO 批次驗關鍵字：月搜量 + 難度(KD) + 競爭度 + 搜尋意圖。
// 一次判斷「有沒有量 × 打不打得贏」，繞過 Keyword Planner 只給廣告競爭的問題。
// 用法：
//   node scripts/keyword-volume-report.mjs "AI 客服推薦" "CRM 自動化" ...   ← 直接帶字
//   node scripts/keyword-volume-report.mjs --file keywords.txt              ← 一行一字
//   再加 --csv 路徑 另存完整結果；--loc 數字 換地區（預設 2158 台灣）；--lang zh-TW
// 認證：.env.local 需有 DATAFORSEO_LOGIN 與 DATAFORSEO_PASSWORD。
import fs from 'fs'

// ── 讀 .env.local ──
const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const login = env.DATAFORSEO_LOGIN
const password = env.DATAFORSEO_PASSWORD
if (!login || !password) {
  console.error('缺 DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD（放進 .env.local）')
  process.exit(1)
}

// ── 解析參數 ──
const args = process.argv.slice(2)
const getFlag = (name) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : null }
const fileArg = getFlag('--file')
const csvPath = getFlag('--csv')
const locationCode = Number(getFlag('--loc')) || 2158        // 2158 = Taiwan
const languageCode = getFlag('--lang') || 'zh-TW'

let keywords = []
if (fileArg) {
  keywords = fs.readFileSync(fileArg, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
} else {
  // 把非 flag、非 flag 值的參數當關鍵字
  const flagVals = new Set([fileArg, csvPath, getFlag('--loc'), getFlag('--lang')].filter(Boolean))
  const flagNames = new Set(['--file', '--csv', '--loc', '--lang'])
  keywords = args.filter((a) => !flagNames.has(a) && !flagVals.has(a))
}
keywords = [...new Set(keywords)]   // 去重
if (!keywords.length) { console.error('沒給關鍵字。用引號帶字或 --file keywords.txt'); process.exit(1) }

// ── 呼叫 DataForSEO Labs keyword_overview（一次最多 700 字）──
const auth = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')
const all = []
for (let i = 0; i < keywords.length; i += 700) {
  const batch = keywords.slice(i, i + 700)
  const res = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_overview/live', {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify([{ keywords: batch, location_code: locationCode, language_code: languageCode }]),
  })
  const json = await res.json()
  if (json.status_code !== 20000) { console.error('API 錯誤：', json.status_code, json.status_message); process.exit(1) }
  const task = json.tasks?.[0]
  if (task?.status_code !== 20000) { console.error('Task 錯誤：', task?.status_code, task?.status_message); process.exit(1) }
  for (const it of task.result?.[0]?.items ?? []) {
    all.push({
      keyword: it.keyword,
      volume: it.keyword_info?.search_volume ?? 0,
      kd: it.keyword_properties?.keyword_difficulty ?? null,
      competition: it.keyword_info?.competition_level ?? '-',
      cpc: it.keyword_info?.cpc ?? null,
      intent: it.search_intent_info?.main_intent ?? '-',
    })
  }
}

// ── 輸出：量大、好打的排前面（量高、KD 低優先）──
all.sort((a, b) => (b.volume - a.volume) || ((a.kd ?? 100) - (b.kd ?? 100)))
const pad = (s, n) => String(s ?? '-').padEnd(n)
console.log(`\nDataForSEO ｜地區 ${locationCode}　語言 ${languageCode}　共 ${all.length} 字\n`)
console.log(pad('keyword', 28), 'vol', '  KD', '  comp', '  cpc', '  intent')
for (const r of all) {
  console.log(
    pad(r.keyword.slice(0, 26), 28),
    pad(r.volume, 5),
    pad(r.kd, 4),
    pad(r.competition, 6),
    pad(r.cpc != null ? r.cpc.toFixed(2) : '-', 6),
    r.intent,
  )
}

if (csvPath) {
  const csv = ['keyword,volume,kd,competition,cpc,intent',
    ...all.map((r) => `"${r.keyword}",${r.volume},${r.kd ?? ''},${r.competition},${r.cpc ?? ''},${r.intent}`)].join('\n')
  fs.writeFileSync(csvPath, csv, 'utf8')
  console.log(`\n完整 ${all.length} 列已存：${csvPath}`)
}
