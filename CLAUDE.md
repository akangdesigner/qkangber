@AGENTS.md

# 網站內容與 SEO 原則

## TKD 框架
所有頁面內容必須符合 TKD 三層結構：
- **Topic（主題）**：每頁只專注一個明確主題，不混雜多個不相關內容
- **Keyword（關鍵字）**：每頁鎖定一組主關鍵字 + 語意相關的長尾詞，自然融入標題、段落、meta
- **Depth（深度）**：內容要比競品更完整，覆蓋使用者可能追問的子問題，不寫表面文章

## EEAT 原則
Google 以 EEAT 評估頁面品質，所有內容必須體現：
- **Experience（實際經驗）**：展示真實案例、截圖、操作過程，不寫純理論
- **Expertise（專業知識）**：使用正確術語，解釋原理，展現對 n8n 自動化與 AI 應用開發領域的深度理解
- **Authoritativeness（權威性）**：作者資訊清楚，品牌 Q kangber 一致出現，引用可信來源
- **Trustworthiness（可信度）**：聯絡方式明確，隱私政策、服務條款完整，頁面無錯誤資訊

## 執行規則
- 新增或修改任何頁面內容前，先確認該頁符合上述 TKD + EEAT 標準
- meta title / description 必須包含主關鍵字且對人類有意義，不堆砌關鍵字
- meta description 中文寫作目標抓 65–78 字（含標點），核心關鍵字與最重要資訊放在前 60 字內（手機版顯示空間更小）；低於 60 字等於沒把 SERP 版位用滿，跟寫太長一樣是浪費。繁中字寬約是英文字母的 2 倍，字數比照英文站的 155 字標準會被 Google SERP 攔腰截斷變成「…」
- meta title（含後綴「— Q kangber」）建議中文本身控制在 25–30 字內，核心關鍵字與問句放最前面 15 字內。title 被截斷不是單純字數問題——Google 常依查詢字詞、頁面 H1 自行改寫 SERP 標題顯示，字數壓短只能降低風險、不保證不被動；title 要跟頁面 H1 語意一致，避免 Google 改寫後跟內容對不上
- 圖片必須有描述性 alt 文字
- 內部連結要有語意，錨文字要描述目標頁內容

# RWD 響應式設計原則

## 基本規則
- 所有頁面外層 padding 使用 `px-4 sm:px-6`，垂直 padding 使用 `py-12 sm:py-20`（不直接用 `px-6` 或 `py-20`）
- 標題字級必須搭配響應式前綴，不可單獨使用大字級：
  - `text-5xl` → `text-3xl sm:text-5xl`
  - `text-4xl` → `text-2xl sm:text-4xl`
- Grid 欄數必須從手機單欄開始：`grid-cols-2` → `grid-cols-1 sm:grid-cols-2`
- 固定高度 layout（如編輯器）只在 `lg:` 以上套用：`lg:h-[68vh] lg:min-h-[520px]`
- 行動版需補上明確高度：`h-56 sm:h-72 lg:h-auto lg:min-h-0`
