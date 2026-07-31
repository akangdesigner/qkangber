// 關鍵字字群擴充：用 seed 拉出 DataForSEO 資料庫裡「所有含這個字」的關鍵字。
// 跟 keyword-volume-report.mjs 的差別：那支是「驗你想到的字」，這支是「把你沒想到的字挖出來」。
// 選題第一關先跑這支，避免靠腦補猜字造成「這主題沒量」的誤判。
// 用法：
//   node scripts/keyword-expand.mjs "apps script"                      ← 單一 seed
//   node scripts/keyword-expand.mjs "app script" "google script"       ← 多 seed 自動去重合併
//   加 --min 30 過濾低量（預設 10）；--limit 1000 每個 seed 抓幾筆；--csv 路徑 另存
//   --loc 數字 換地區（預設 2158 台灣）；--lang 語言（預設 zh-TW，台灣地區僅此語言有資料）
// 認證：.env.local 需有 DATAFORSEO_LOGIN 與 DATAFORSEO_PASSWORD。
import fs from 'node:fs'

// ── 讀 .env.local（相對本檔，從任何目錄跑都可以）──
const env = {}
for (const line of fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
if (!env.DATAFORSEO_LOGIN || !env.DATAFORSEO_PASSWORD) {
  console.error('缺 DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD（放進 .env.local）')
  process.exit(1)
}
const auth = 'Basic ' + Buffer.from(`${env.DATAFORSEO_LOGIN}:${env.DATAFORSEO_PASSWORD}`).toString('base64')

// ── 解析參數 ──
const args = process.argv.slice(2)
const FLAGS = new Set(['--min', '--limit', '--loc', '--lang', '--csv'])
const getFlag = (n) => { const i = args.indexOf(n); return i !== -1 ? args[i + 1] : null }
const flagVals = new Set([...FLAGS].map(getFlag).filter(Boolean))
const seeds = args.filter((a) => !FLAGS.has(a) && !flagVals.has(a))
const min = Number(getFlag('--min') ?? 10)
const limit = Number(getFlag('--limit')) || 1000
const locationCode = Number(getFlag('--loc')) || 2158
const languageCode = getFlag('--lang') || 'zh-TW'
const csvPath = getFlag('--csv')

if (!seeds.length) {
  console.error('用法：node scripts/keyword-expand.mjs "<seed 關鍵字>" [更多 seed...] [--min 10] [--csv out.csv]')
  process.exit(1)
}

// ── 逐 seed 打 keyword_suggestions（回傳所有「包含 seed」的字）──
const rows = new Map()
for (const seed of seeds) {
  const res = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live', {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify([{
      keyword: seed,
      location_code: locationCode,
      language_code: languageCode,
      limit,
      include_seed_keyword: true,
      order_by: ['keyword_info.search_volume,desc'],
    }]),
  })
  const json = await res.json()
  const task = json.tasks?.[0]
  if (task?.status_code !== 20000) {
    console.error(`[${seed}] 失敗：`, task?.status_code, task?.status_message)
    continue
  }
  const items = task.result?.[0]?.items ?? []
  console.error(`[${seed}] 回 ${items.length} 字`)
  for (const it of items) {
    const vol = it.keyword_info?.search_volume ?? 0
    if (vol < min) continue
    // 同字被多個 seed 撈到時取較高量（不同 seed 的資料版本可能差一版）
    const prev = rows.get(it.keyword)
    if (!prev || prev.vol < vol) {
      rows.set(it.keyword, {
        kw: it.keyword,
        vol,
        kd: it.keyword_properties?.keyword_difficulty ?? null,
        intent: it.search_intent_info?.main_intent ?? '-',
      })
    }
  }
}

const all = [...rows.values()].sort((a, b) => (b.vol - a.vol) || ((a.kd ?? 100) - (b.kd ?? 100)))
const pad = (s, n) => String(s ?? '-').padEnd(n)
console.log(`\nDataForSEO 字群擴充｜seed ${seeds.length} 個　地區 ${locationCode}　語言 ${languageCode}　月搜 >= ${min}　共 ${all.length} 字\n`)
console.log(pad('keyword', 44), 'vol', '  KD', '  intent')
for (const r of all) console.log(pad(r.kw.slice(0, 42), 44), pad(r.vol, 5), pad(r.kd, 4), r.intent)

// 提醒：DataForSEO 會把「google 試算表 / google試算表 / google 試算 表」當三個字各自計量，
// 判斷字群大小時要自己合併空格變體，不能把它們相加。
console.log('\n※ 空格/寫法變體（「apps script教學」vs「apps script 教學」）是同一群需求，估量時合併看不要相加。')

if (csvPath) {
  const csv = ['keyword,volume,kd,intent', ...all.map((r) => `"${r.kw}",${r.vol},${r.kd ?? ''},${r.intent}`)].join('\n')
  fs.writeFileSync(csvPath, csv, 'utf8')
  console.log(`完整 ${all.length} 列已存：${csvPath}`)
}
