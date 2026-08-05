import fs from 'node:fs';
import { google } from 'googleapis';

const env = Object.fromEntries(
  fs.readFileSync('D:/qkangber/.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

const id = '1q1GR6bPmZi7sMx8HGtZhHjimwoWbnV9wVHAmfhqY40s';
const SHEET_ID = 1320390211;

// 三個空白垃圾欄（已確認 174 列全空）：E「單位 」、J（無標題）、N「 天氣_實際」
// 由右往左處理，避免索引位移
const requests = [13, 9, 4].map((i) => ({
  deleteDimension: {
    range: { sheetId: SHEET_ID, dimension: 'COLUMNS', startIndex: i, endIndex: i + 1 },
  },
}));

await sheets.spreadsheets.batchUpdate({ spreadsheetId: id, requestBody: { requests } });

const r = await sheets.spreadsheets.values.get({ spreadsheetId: id, range: '工作表5!1:1' });
console.log('處理後標題列:', JSON.stringify(r.data.values[0]));
