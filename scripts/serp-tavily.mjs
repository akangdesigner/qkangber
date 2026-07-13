#!/usr/bin/env node
// 寫文前 SERP 競品調查：用 Tavily 查主關鍵字，看排前面的文章怎麼寫
// 用法：node scripts/serp-tavily.mjs "<關鍵字>" [--n 8] [--raw 3]
//   --n    回傳前幾名結果（預設 8）
//   --raw  前幾名附內文節錄（預設 3，設 0 關閉）
// 金鑰讀 .env.local 的 TAVILY_API_KEY（不印出金鑰）
import fs from 'node:fs';

const args = process.argv.slice(2);
const query = args.find((a) => !a.startsWith('--'));
if (!query) {
  console.error('用法：node scripts/serp-tavily.mjs "<關鍵字>" [--n 8] [--raw 3]');
  process.exit(1);
}
const getOpt = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : dflt;
};
const n = getOpt('--n', 8);
const rawN = getOpt('--raw', 3);

let key = '';
try {
  const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  key = (env.match(/^TAVILY_API_KEY\s*=\s*(.+)$/m)?.[1] || '').trim().replace(/^["']|["']$/g, '');
} catch {}
if (!key) {
  console.error('缺 TAVILY_API_KEY：請在 .env.local 加一行 TAVILY_API_KEY=tvly-xxx（Tavily 後台可查）');
  process.exit(1);
}

const r = await fetch('https://api.tavily.com/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
  body: JSON.stringify({
    query,
    search_depth: 'advanced',
    max_results: n,
    include_raw_content: rawN > 0,
  }),
});
if (!r.ok) {
  console.error('Tavily API 失敗', r.status, await r.text());
  process.exit(1);
}
const data = await r.json();
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

console.log(`SERP：「${query}」（前 ${data.results.length} 名）\n`);
for (const [i, res] of data.results.entries()) {
  console.log(`#${i + 1} ${res.title}`);
  console.log(`   ${res.url}`);
  console.log(`   摘要：${clean(res.content).slice(0, 300)}`);
  if (i < rawN && res.raw_content) {
    console.log(`   內文節錄：${clean(res.raw_content).slice(0, 2500)}`);
  }
  console.log('');
}
