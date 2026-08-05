// 覆蓋「日記本」分頁裡的 FocuSee 業配 Threads 草稿（主貼文＋2 則留言）
// 用法：node scripts/_tmp-diary-focusee.mjs [--write]
import fs from 'fs'
import { google } from 'googleapis'
const WRITE = process.argv.includes('--write')
const env = {}
for (const line of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ if(!line||line.startsWith('#'))continue; const i=line.indexOf('='); if(i===-1)continue; env[line.slice(0,i).trim()]=line.slice(i+1).trim() }
const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
const auth = new google.auth.GoogleAuth({ credentials, scopes:['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({version:'v4',auth})
const SID = env.GOOGLE_SHEET_ID, TAB = '日記本'

const res = await sheets.spreadsheets.values.get({ spreadsheetId: SID, range: `${TAB}!A1:E200` })
const rows = res.data.values ?? []

const idx = rows.findIndex(r => (r[0] || '') === '2026-08-05' && (r[1] || '').includes('FocuSee'))
if (idx === -1) { console.error('⚠ 找不到 2026-08-05 的 FocuSee 那列，停止'); process.exit(1) }
const rowNum = idx + 1
console.log(`找到第 ${rowNum} 列，現有 B 欄開頭：`, (rows[idx][1] || '').slice(0, 30) + '…')

const POST = `很高興收到 FocuSee 的試用邀請，今天來分享我實際拿它錄一支教學影片的心得。

錄教學影片最麻煩的不是錄，是錄完之後。我在做工具箱的新聞轉發控制台，想錄一段 demo 給人看流程。以前這種片子我得自己剪關鍵幀、一個一個放大點擊的地方，錄三分鐘後製半小時。

這次用 FocuSee 錄，游標點到哪它自己放大到哪，停下來就縮回去，錄完直接是可以貼出去的成品。另一個意外好用的是人聲自動升級，我什麼都沒調，錄完聲音就比原檔乾淨。

AI 虛擬人的互動感也做得不錯，只是動漫風格的選項比較少，這支影片就沒放上來對比。字幕一鍵生成偶爾會漏字，但用改的比從頭打快。

連結跟沒後製的原版都放留言。

—— 留言 1 ——
FocuSee 合作連結：https://imobie.sjv.io/c/7567244/2231409/10066

—— 留言 2 ——
這是同一段、什麼都沒開的原始錄影。沒有放大追蹤，滑鼠點哪要自己猜。`

const MEDIA = `主貼文影片：D:\\FocuSee\\Video\\news-demo-after-1920x1080.mp4
留言 2 影片：D:\\FocuSee\\Video\\news-demo-before-1920x1080.mp4`

const newRow = ['2026-08-05', POST, '草稿', MEDIA]
console.log(`\n準備覆蓋第 ${rowNum} 列 A:D`)

if (!WRITE) { console.log('（dry-run）確認無誤後加 --write。'); process.exit(0) }

await sheets.spreadsheets.values.update({
  spreadsheetId: SID, range: `${TAB}!A${rowNum}:D${rowNum}`, valueInputOption: 'RAW',
  requestBody: { values: [newRow] },
})
console.log(`✓ 已覆蓋第 ${rowNum} 列`)
