---
title: 購物體驗再進化：讓大語言模型真正讀懂商品與消費者需求，通過 GECX 打造 AI 時代全新消費者體驗
track: 下午・加值產業轉型與智慧代理
order: 7
speakers:
  - name: Josie Cheng
    title: Google Cloud 台灣 AI 解決方案資深協理
  - name: Felix Chin 覃志宗
    title: Engineering Manager，統一超商
summary: 零售正從「使用者自己動手搜尋」的 Digital 時代，進入「告訴 Agent 目標、它幫你完成」的 Agentic Commerce 時代；商品資料要為 AI 重寫，安全與評測是導入的必修課。
---

![Google Cloud Day「購物體驗再進化：GECX 與 Agentic Commerce」場次現場投影片](/activities/cloud-day-2026/s07-1.webp)

#### 第一段 · Josie Cheng（Google Cloud）

## 為什麼零售需要 AI Agent

- **市場數據**：全球零售客戶已有 **51%** 導入 AI Agent，其中 **37%** 部署超過 10 個 Agent。
- **痛點**：**82%** 的消費者若在數位體驗上感到不好，就會直接流失；提供個人化服務則能提高轉化。
- **典範轉移**：過去 Digital 雖簡化流程，但使用者仍要自己「瀏覽→搜尋→篩選→比較→下單」；導入 Agent 後，只要說出**目標**，其餘步驟交給 Agent 代勞。

## Agentic Commerce 的應用場景

- **模糊需求探索**：拍冰箱照片給 AI →「我有這些食材想做晚餐」→ AI 推薦料理並列出要加購的商品。
- **跨渠道一致**：電話客服 → 網頁 → 手機，同一個 Agent 都記得你、延續脈絡。
- **個人化參照**：依歷史訂單回答「這件衣服對照你上次買的尺寸」「這房間比你上次住的大」。
- **目標導向 + Agentic Payment**：設定「降到某價格就通知我／直接幫我下單」，Agent 自動追蹤並成交，解決「看到通知時已缺貨」的問題。

## 零售「人、貨、場」的重構

| 要素 | Digital 時代 | Agentic AI 時代 |
| --- | --- | --- |
| **人** | 用演算法「猜」使用者喜好 | 大模型理解當下意圖＋短期上下文＋長期記憶 |
| **貨** | 商品打標籤、關鍵字/推薦演算法、SEO | 商品資料 enrich（場景化長描述）、符合 UCP 協議、SEO→GEO 生成式優化 |
| **場** | 瀏覽型、探索型、搜尋 | 任務／目標導向 |

## GECX 與 Universal Commerce Protocol

> **官方定位文案**
>
> **Gemini Enterprise for CX** 作為主動式數位管家，串接從初步探索到售後支援的完整流程。**The Universal Commerce Protocol（UCP）**是一項為未來商務設計的開放標準，讓您能將 AI 互動轉化為即時銷售。透過將 UCP 作為通用的商務語言，GECX 能深入理解客戶歷史，不僅能立即辨識用戶，還能在 Google 生態系統與更廣泛的 AI 生態中，全面掌握並維持品牌形象的一致性。

- **四大能力**：複雜對話 training、多模態互動（圖/聲音 in-out）、互操作性（串接各系統完成交易）、授權機制（碰到金流等敏感行為要確認 user 授權）。
- **產品：GECX（Gemini Enterprise Platform — Customer Experience）**，end-to-end 支援探索→購買→售後，涵蓋電商、餐飲點餐、生鮮下單。內含：
  - **Agent Studio**：low-code 拖拉建 Agent，內建模擬器可即時測試（也支援 high-code）。
  - **A2UI 協議**：對話中自動生成商品卡片、輪播 UI，不只乾巴巴的文字。
  - **UCP 協議**：商品符合統一協議，可被跨平台（甚至 Google 生態）調用。
  - **Gemini Live**：原生語音（免 STT/TTS），支援中英日韓與東南亞語系。
  - **Eval 工具 + Guardrails**：協助評測、防 Prompt Injection、限制回答範疇。
- **FDE 團隊**：Google 成立 Forward Deployed Engineer 團隊，協助客戶從定義探索到正式上線。

---

#### 第二段 · Felix Chin 覃志宗（統一超商，最精華）

## iOPENMall Shopping Agent 實際流程

![iOPENMall Shopping Agent 實機截圖：01 進入官號／熱門推薦、02 需求收斂、03 商品推薦、04 加入購物車的完整購物旅程](/activities/cloud-day-2026/s07-2.webp)

*01 進入官號／熱門推薦 → 02 需求收斂 → 03 商品推薦 → 04 加入購物車，實機截圖示範完整購物旅程*

官方 POC 展示了完整四步驟：**01 進入官號／熱門推薦**（進入 iOPENMall 官方帳號，AI 主動打招呼「Hi，我是您的購物助理小蟹！告訴我你想買什麼，我幫你找」）→ **02 需求收斂**（AI 反問「今天想買什麼呢？你可以點選下方情境，或直接輸入需求喔！」提供如「端午節熱門送禮粽子」「外出旅遊～防曬防蚊必備」等情境選項）→ **03 商品推薦**（依使用者選的價格區間，如 500–1000 元，推薦對應商品，例如抹茶粉、抹茶筅等）→ **04 加入購物車**（直接彈出商品卡片，含口味、尺寸、數量選擇，一鍵加入購物車）。

## 統一超商 UniOpen 背景

- **背景**：統一集團 **2,000 萬**會員，UniOpen 生活平台（2024 底網頁版、2025 新 App）；AI Agent 主打**官方帳號**，串起整個集團。與 Poko 合作打造 **GECX agent + OpenMall shopping agent**。
- **踩過的坑（兩年 POC 血淚）**：
  - **Data enrichment**：商品細節多藏在**圖片**裡，Agent 讀不懂 → 要先 enrich 再打標籤；且 enrichment 是**持續工程**，只對特定分類有效。
  - **Prompt Injection**：有人用「軟爛 context」情緒勒索，讓 shopping agent 跑去寫程式、講笑話；也可能被誘導改價格、洩漏系統。
  - **Session**：兩面刃，開太長容易被攻擊。
  - **Memory**：記憶會過時（記了生日/年紀，明年就不對）。
  - **Eval**：機率性模型當確定性用的風險——舉航空公司案例，Agent 誤答「機票可打折」造成糾紛（模型沒幻覺，但引用到錯資料）。
- **解法**：Root Agent + Sub Agent 分層架構、確定性的事交給 tool、Scenario 回歸測試、回覆用 **Callback 清洗**、設 **Private List**（最低價/醫療保健/違法商品不回答）、User 隱私資料**絕不進 Agent**（只透過 session 參數打 API）。

## UCP 如何讓「新增一個 Agent」的成本趨近於零

![統一超商投影片：沒有 UCP 之前各 agent 要對接商品、搜尋、購物車共 6 條線 6 種寫法；接上 UCP schema 後所有 agent 只對接同一套 schema](/activities/cloud-day-2026/s07-3.webp)

*沒有 UCP 之前：uniopen agent、iOPENMall shopping agent 各自要對接商品／搜尋／購物車，6 條線、6 種寫法；接上 UCP schema 後：所有 agent 只需對接同一套 schema，新增 agent 的整合成本趨近於零*

Felix 用一張技術圖解釋 UCP 的實際效益：**現在（沒有 UCP）**——agent 各自接，各自寫 wrapper：uniopen agent、iOPENMall agent 要分別跟「商品／搜尋／購物車」三個系統對接，等於 **6 條線、6 種寫法**；**接上 UCP schema 後**——新 agent 只接一次：所有 agent 跟系統都講同一種 schema，「之後每加一個新 agent，接的成本趨近於零」。這是這場少數把「導入標準協議的實際工程效益」講得非常具體的例子。

> *「做一個 Agent 給 100 人用是一回事，給 2,000 萬人用，完全是另一回事。」*

## 總結

1. **電商客戶的商品資料要「為 AI 重寫」**：enrich、長描述、場景化標籤——這正是 **SEO→GEO** 的延伸，方向完全一致，可以包成服務。
2. **UCP 協議值得關注**：未來商品要能被 Google 跨平台調用，結構化商品資料會是勝負關鍵；統一超商的「6 條線 vs 一套 schema」案例，是說服客戶投資標準化的好素材。
3. **Agent 導購／客服是可落地的服務題材**：從官方帳號切入（統一就是這樣做），門檻比想像低。
4. **安全與 Guardrails 是必修**：幫客戶做 AI Agent，Prompt Injection 防護、Private List、隱私隔離要在第一天就設計。
