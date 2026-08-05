import fs from 'node:fs';
import { google } from 'googleapis';
const env = Object.fromEntries(fs.readFileSync('D:/qkangber/.env.local','utf8').split(/\r?\n/).filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON), scopes:['https://www.googleapis.com/auth/spreadsheets'] });
const sheets = google.sheets({version:'v4', auth});
const id = '1q1GR6bPmZi7sMx8HGtZhHjimwoWbnV9wVHAmfhqY40s';
const r = await sheets.spreadsheets.values.get({ spreadsheetId:id, range:'工作表5' });
const rows = r.data.values || [];
console.log('總列數(含標題):', rows.length);
for (const idx of [4,9,13]) {
  const vals = rows.slice(1).map(x=>x[idx]).filter(v=>v!=null && String(v).trim()!=='');
  console.log(`欄 ${String.fromCharCode(65+idx)} 標題=${JSON.stringify(rows[0][idx])} 非空資料筆數=${vals.length}`, vals.slice(0,5));
}
