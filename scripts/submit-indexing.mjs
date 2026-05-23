import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// 使用方式：node scripts/submit-indexing.mjs <金鑰檔路徑> [csv路徑]
const keyFile = process.argv[2];
const csvPath = process.argv[3] ?? 'C:/Users/asdto/AppData/Local/Temp/Rar$DRa2792.20790/表格.csv';

if (!keyFile) {
  console.error('用法：node scripts/submit-indexing.mjs <service-account.json> [csv路徑]');
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  keyFile: resolve(keyFile),
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const client = await auth.getClient();

const csv = readFileSync(csvPath, 'utf-8');
const lines = csv.trim().split('\n');
const header = lines[0];
const rows = lines.slice(1);

const results = [header];
let success = 0, failed = 0;

for (const row of rows) {
  const [url] = row.split(',');
  const cleanUrl = url.trim();

  try {
    await client.request({
      url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
      method: 'POST',
      data: { url: cleanUrl, type: 'URL_UPDATED' },
    });

    const now = new Date().toISOString().split('T')[0];
    results.push(`${cleanUrl},${now},已提交`);
    console.log(`✓ ${cleanUrl}`);
    success++;
  } catch (err) {
    const msg = err?.response?.data?.error?.message ?? err.message;
    results.push(`${cleanUrl},1970-01-01,失敗: ${msg}`);
    console.error(`✗ ${cleanUrl} — ${msg}`);
    failed++;
  }

  // 避免超過 API 速率限制
  await new Promise(r => setTimeout(r, 200));
}

writeFileSync(csvPath, results.join('\n'), 'utf-8');
console.log(`\n完成：${success} 成功，${failed} 失敗`);
console.log(`結果已更新至 ${csvPath}`);
