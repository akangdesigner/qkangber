#!/usr/bin/env node
// 去 AI 味自檢：掃 blog-drafts 的 HTML，列出命中黑名單的字詞與片段。
// 用法：node scripts/check-ai-style.mjs blog-drafts/XX-slug
// 規則來源：docs/anti-ai-style.md（唯一來源）
import fs from "fs";
import path from "path";

// 黑名單：[正則, 類別, 說明]
const RULES = [
  // A. 灌水開頭／教科書過渡詞
  [/深入(探討|挖掘|了解)/g, "A 灌水開頭", "AI 灌水開頭，直接講下一件事"],
  [/讓我們深入/g, "A 灌水開頭", "說教式開場"],
  [/值得注意的是/g, "A 灌水開頭", "說教式過渡詞"],
  [/必須記住/g, "A 灌水開頭", "說教式過渡詞"],
  [/(綜上所述|總而言之)/g, "A 灌水開頭", "僵化結尾套話"],
  [/(先)?(誠實|老實|坦白)(講|說)/g, "A 灌水開頭", "宣告式誠實開場，真要誠實的人直接講那件事"],
  [/說(真的|實話)/g, "A 灌水開頭", "宣告式開場，直接講"],
  [/(不得不說|不諱言)/g, "A 灌水開頭", "宣告式開場"],
  [/(我|這篇文?章?|本文|接下來|下面)(會|將)(說|講|告訴|介紹|教你|帶你|分享|談談?)/g, "A 灌水開頭", "宣告式『我會說清楚/這篇會告訴你』，本來就會講不用先昭告，直接講那件事"],
  [/帶你(一起)?(了解|看懂|搞懂|認識|走過|拆解)/g, "A 灌水開頭", "宣告式導引，直接講內容"],
  [/(把)?話(講|說)在?前(面|頭)/g, "A 灌水開頭", "宣告式『把話講在前面』，直接講那件事就好"],
  [/舉個?[^，。！？]{0,8}(例子|案例|例來說)/g, "A 灌水開頭", "宣告式『舉例』報幕，直接把例子講出來不用先昭告"],
  [/比如說/g, "A 灌水開頭", "『比如說』當開場報幕，直接講例子"],
  // B. 浮誇強調詞
  [/至關重要/g, "B 浮誇強調", "用數字或後果代替"],
  [/(樞紐的|關鍵的一(環|步))/g, "B 浮誇強調", "浮誇強調，講具體後果"],
  [/不可磨滅/g, "B 浮誇強調", "空洞誇飾（不可磨滅的印記）"],
  [/凸顯了|強調了/g, "B 浮誇強調", "抽象當主詞"],
  [/(刺眼|觸目驚心|怵目驚心|血淋淋|發人深省|耐人尋味)/g, "B 浮誇強調", "給抽象事物套虛無感官/情緒形容詞，直接講事實"],
  // C. 社群情緒假詞
  [/懂的都懂/g, "C 情緒假詞", "裝熟空話"],
  [/接住(你|妳)的情緒/g, "C 情緒假詞", "做作感性"],
  // D. 經典 AI 句型
  [/這不是[^，。！？]{0,20}，[^，。！？]{0,8}而是/g, "D AI句型", "「這不是…而是…」工整反轉金句"],
  [/不僅是[^，。！？]{0,20}，[^，。！？]{0,8}更是/g, "D AI句型", "「不僅是…更是…」無限昇華"],
  [/從[^，。！？]{1,12}到[^，。！？]{1,12}，/g, "D AI句型", "「從…到…」假範圍（確認跨度合理再保留）"],
  [/——/g, "D AI句型", "破折號濫用，99% 秒判 AI；確認真的需要再保留"],
  // E. 空洞讚美／模糊歸因／格式殘留
  [/(燈塔|見證|文化遺產中心)/g, "E 空洞讚美", "空洞讚美，換可驗證事實"],
  [/批評者認為|有人認為/g, "E 模糊歸因", "歸因要指名"],
  [/\*\*|(?<!#)##(?!#)/g, "E 格式殘留", "Markdown 殘留跑進正文"],
  // F. 抽象化／概念名詞化
  [/(自我的探索|認同感的建構|效率的提升|價值的展現)/g, "F 抽象化", "名詞化換動詞口語"],
  [/某個?(午後|夜晚|時刻)/g, "F 缺錨點", "換真實時間"],
  [/大幅(提升|改善|增加|降低)/g, "F 缺錨點", "換具體數字"],
  // 老形容詞（既有風格規則）
  [/(非常|相當|極為)/g, "風格 贅詞", "避免空形容詞"],
];

const target = process.argv[2];
if (!target) {
  console.error("用法：node scripts/check-ai-style.mjs <資料夾或 .html 路徑>");
  process.exit(2);
}

function collectHtml(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return p.endsWith(".html") ? [p] : [];
  return fs.readdirSync(p).filter((f) => f.endsWith(".html")).map((f) => path.join(p, f));
}

const files = collectHtml(target);
if (files.length === 0) {
  console.error("找不到 .html：" + target);
  process.exit(2);
}

let total = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  // 去標籤後比對，避免 inline style/屬性誤判（但 ## ** 殘留仍掃原文）
  const text = raw.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");
  const hits = [];
  for (const [re, cat, tip] of RULES) {
    const src = cat.startsWith("E 格式") ? raw : text;
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) {
      const i = m.index;
      const ctx = src.slice(Math.max(0, i - 20), i + m[0].length + 20).replace(/\s+/g, " ").trim();
      hits.push({ cat, word: m[0], tip, ctx });
      if (!re.global) break;
    }
  }
  console.log("\n=== " + file + " ===");
  if (hits.length === 0) {
    console.log("  ✓ 無命中");
  } else {
    for (const h of hits) {
      console.log(`  [${h.cat}] 「${h.word}」 — ${h.tip}`);
      console.log(`      …${h.ctx}…`);
    }
    console.log(`  小計：${hits.length} 處`);
  }
  total += hits.length;
}

console.log(`\n總計命中 ${total} 處。` + (total ? " 逐一重寫再交付。" : " 通過。"));
process.exit(total ? 1 : 0);
