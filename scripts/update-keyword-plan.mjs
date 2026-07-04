// 更新「關鍵字編列」分頁：補破千關鍵字的真實搜尋量 + 新增主攻/次要破千字。
// 用法：node scripts/update-keyword-plan.mjs        ← dry-run 預覽
//       node scripts/update-keyword-plan.mjs --write ← 實際寫入
import fs from 'fs'
import { google } from 'googleapis'

const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){
  if(!line||line.startsWith('#'))continue
  const i=line.indexOf('=');if(i===-1)continue
  env[line.slice(0,i).trim()]=line.slice(i+1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes:['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({version:'v4',auth})
const SID = env.GOOGLE_SHEET_ID
const TAB = '關鍵字編列'

// 讀現況
const res = await sheets.spreadsheets.values.get({ spreadsheetId: SID, range: `${TAB}!A1:H400` })
const rows = res.data.values ?? []
const data = rows.slice(1)
const maxOrder = Math.max(...data.map(r=>parseInt(r[0],10)||0))

// 欄位：排序 子主題 關鍵字 意圖 對應文章 搜尋量(估) 競爭 商業價值
// 2 筆更新（搜尋量欄 = F）
const UPDATES = [
  { kw:'vibe coding 是什麼', vol:'高(5000)' },
  { kw:'AI Agent 是什麼',    vol:'高(5000)' },
]
const updateCells = []
for (const u of UPDATES){
  const idx = data.findIndex(r=>(r[2]||'').trim()===u.kw)
  if (idx===-1){ console.log(`⚠ 找不到要更新的字：${u.kw}（跳過）`); continue }
  const sheetRow = idx + 2 // header 佔第 1 列
  updateCells.push({ range:`${TAB}!F${sheetRow}`, values:[[u.vol]], kw:u.kw, old:data[idx][5] })
}

// 11 筆新增（排序接續）
let n = maxOrder
const NEW = [
  ['Pillar',       'vibe coding',         '資訊(定義)/商業','待寫(Pillar)','高(50000)','中','高'],
  ['F AI 定義(FAQ)','ai agent',            '資訊(定義)',     '待寫',        '高(50000)','中','高'],
  ['F AI 定義(FAQ)','mcp 是什麼',           '資訊(定義)',     '待寫',        '高(5000)', '低','中-高'],
  ['I n8n 旗艦',    'n8n 是什麼',           '資訊(定義)',     '待寫',        '高(5000)', '中','高'],
  ['I n8n 旗艦',    'n8n 教學',            '資訊(教學)',     '待寫',        '高(5000)', '中','中-高'],
  ['Pillar',       'ai coding',           '資訊(教學)',     '待寫(Pillar)','高(5000)', '中','中'],
  ['Pillar',       'ai 寫程式',            '資訊(教學)',     '待寫',        '高(5000)', '中','中'],
  ['H AI 開發/架構','prompt engineering',  '資訊(教學)',     '待寫',        '高(5000)', '中','中'],
  ['H AI 開發/架構','google apps script',  '資訊(教學)',     '待寫',        '高(5000)', '低','中'],
  ['K 行銷自動化',  'line bot',            '資訊(教學)',     '待寫',        '高(5000)', '中','中-高'],
  ['F AI 定義(FAQ)','chatgpt 是什麼',       '資訊(定義)',     '待寫',        '高(5000)', '中-高','中'],
]
// 防重複（避免重跑時又塞一次）
const existKw = new Set(data.map(r=>(r[2]||'').trim()))
const appendRows = []
for (const r of NEW){
  if (existKw.has(r[1])){ console.log(`⚠ 已存在，跳過新增：${r[1]}`); continue }
  appendRows.push([String(++n), ...r])
}

// 預覽
console.log(`\n=== 更新搜尋量 ${updateCells.length} 筆 ===`)
updateCells.forEach(u=>console.log(`  ${u.kw}：「${u.old}」→「${u.values[0][0]}」(${u.range})`))
console.log(`\n=== 新增 ${appendRows.length} 筆（排序 ${maxOrder+1}~${n}）===`)
appendRows.forEach(r=>console.log('  '+r.join(' | ')))

if (!WRITE){ console.log('\n（dry-run）確認無誤後加 --write 才會寫入。'); process.exit(0) }

// 寫入
if (updateCells.length){
  await sheets.spreadsheets.values.batchUpdate({ spreadsheetId: SID,
    requestBody: { valueInputOption:'RAW', data: updateCells.map(u=>({range:u.range, values:u.values})) } })
  console.log(`✓ 已更新 ${updateCells.length} 筆搜尋量`)
}
if (appendRows.length){
  await sheets.spreadsheets.values.append({ spreadsheetId: SID, range:`${TAB}!A:H`,
    valueInputOption:'RAW', insertDataOption:'INSERT_ROWS', requestBody:{ values: appendRows } })
  console.log(`✓ 已新增 ${appendRows.length} 筆`)
}
