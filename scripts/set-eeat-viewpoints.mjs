// 在電子報試算表的「EEAT」分頁寫入 D 欄「觀點與主張」（餵給電子報點評 prompt）。
// 用法：node scripts/set-eeat-viewpoints.mjs
import fs from 'fs'
import { google } from 'googleapis'

const SPREADSHEET_ID = '1VwGs_i7b-kk9HQtd0gBbkS8bFSO8cU7esKSGhEtJVzM'
const TAB = 'EEAT'

const VIEWPOINTS = [
  '「能跑」不等於「沒問題」：AI 讓人很快做出東西，但代價是延後爆發的技術債；評一個工具先看它把問題藏到哪、什麼時候連本帶利討回來。',
  '誠實優先，不當推銷員：沒用過就說沒用過，看衰就講理由，做不到的地方要講白，不每則都喊讚。',
  '只信第一手經驗：判斷都來自我親手做過的東西（AICommand、自己的官網與工具、n8n 工作流），不堆理論、不轉述沒驗證的說法。',
  '掌控權比速度重要：看不懂、改不動、把判斷外包給統計平均值才是真風險；人要留在迴路裡做決定（送出前人工核准、每步可回滾）。',
  '反 AI 味、反公版：AI 給的「變化」常是假的，差別在「有沒有人做選擇」；刻意的決定才是你的東西。',
  '判斷力 > 工具：工具會換，把元件組起來的判斷力不會過期；看重「怎麼搭」勝過「學會某個按鈕」。',
  '白話除魅、不寫通用文：術語要拆給沒有工程師的人聽懂；商品化的入門教學不稀奇，有真實踩坑、差異化角度才值得寫。',
  '務實又顧成本：能用免費／低成本方案串起來就不堆砌；對外功能一定要設上限（API 帳單、垃圾灌爆、資安門鎖）。',
].join('\n')

const env = {}
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('='); if (i === -1) continue
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
}
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

await sheets.spreadsheets.values.update({
  spreadsheetId: SPREADSHEET_ID,
  range: `${TAB}!D1:D2`,
  valueInputOption: 'RAW',
  requestBody: { values: [['觀點與主張'], [VIEWPOINTS]] },
})
console.log('已寫入 EEAT!D1:D2（觀點與主張）')
