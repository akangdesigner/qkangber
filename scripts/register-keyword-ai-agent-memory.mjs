// 在「關鍵字編列」分頁登記 ai-agent-memory 這篇的主攻字。
// 用法：node scripts/register-keyword-ai-agent-memory.mjs [--write]
import fs from 'fs'
import { google } from 'googleapis'
const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ if(!line||line.startsWith('#'))continue; const i=line.indexOf('='); if(i===-1)continue; env[line.slice(0,i).trim()]=line.slice(i+1).trim() }
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes:['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({version:'v4',auth})
const SID = env.GOOGLE_SHEET_ID, TAB = '關鍵字編列'

const res = await sheets.spreadsheets.values.get({ spreadsheetId: SID, range: `${TAB}!A1:H400` })
const rows = res.data.values ?? []
const data = rows.slice(1)
const maxOrder = Math.max(...data.map(r=>parseInt(r[0],10)||0))
const subthemes = [...new Set(data.map(r=>(r[1]||'').trim()).filter(Boolean))]
const existKw = new Set(data.map(r=>(r[2]||'').trim().toLowerCase()))

// 欄位：排序 子主題 關鍵字 意圖 對應文章(slug/待寫) 搜尋量(估) 競爭 商業價值
const KW = 'AI Agent 記憶'
const NEW = ['F AI 定義(FAQ)', KW, '資訊(定義)', 'ai-agent-memory ✅ 已上架', '低(待驗)', '低', '中']

console.log('既有子主題：', subthemes.join(' / '))
console.log('目前最大排序：', maxOrder)
if (existKw.has(KW.toLowerCase())){ console.log(`⚠ 「${KW}」已存在，無需新增`); process.exit(0) }
const row = [String(maxOrder+1), ...NEW]
console.log('\n要新增的列：')
console.log('  ' + row.join(' | '))
if (!WRITE){ console.log('\n（dry-run）確認無誤後加 --write 才會寫入。'); process.exit(0) }

await sheets.spreadsheets.values.append({ spreadsheetId: SID, range:`${TAB}!A:H`,
  valueInputOption:'RAW', insertDataOption:'INSERT_ROWS', requestBody:{ values:[row] } })
console.log(`✓ 已登記：${KW} → ai-agent-memory（排序 ${maxOrder+1}）`)
