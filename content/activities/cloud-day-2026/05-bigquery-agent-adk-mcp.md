---
title: BigQuery 對話式 Agent 開發——ADK 與 MCP 的實戰整合
track: 下午・加值產業轉型與智慧代理
order: 5
speakers:
  - name: Simon Wang
    title: Google Cloud 台灣解決方案架構師
  - name: Happy Lee 李昆謀
    title: 91APP 產品長
cover: /activities/cloud-day-2026/s05-3.webp
summary: 讓 Agent 查詢 BigQuery 有五種做法，從免寫程式到完全客製都有；91APP 用「資料定義治理（Looker）＋確定性檢查用程式碼、不信任 Agent 判斷」的方式，把資料 Agent 做到能給兩萬多客戶安全使用的規模。
---

![Google Cloud Day「BigQuery 對話式 Agent 開發」場次現場投影片](/activities/cloud-day-2026/s05-1.webp)

#### 第一段 · Simon Wang（Google Cloud）

## 五種讓 Agent 查詢 BigQuery 的做法

| 方案 | 做法 | 適合對象 |
| --- | --- | --- |
| **A：BQCA** Conversational Analytics Agent | BigQuery 內建 Agent Hub，選 Table＋下提示詞就能發布一個能對話查資料的 Agent，自動轉 SQL、回傳圖表 | 不寫程式／想快速上手 |
| **B：BQCA API** | 用 API 呼叫已設定好的 Data Agent，整合進自己的 UI（換皮不換裡子） | 有自己前端介面，想保留原有操作習慣 |
| **C：全託管 MCP Server** | Google 提供 BigQuery／Cloud Run／Looker 等原生服務的全託管 MCP Server，直接用 URL 連接，安全性交給 Google Cloud IAM 控管；可設「唯讀模式」防止 Agent 誤刪資料 | 用 ADK／Copilot 類工具寫程式開發，想要標準化串接 |
| **D：Co-agent 掛載** | 把全託管 MCP Server 掛進既有的 Copilot 類工具（如 Antigravity、Claude Code），讓開發時用的助理也能查 BigQuery | 已有慣用的 AI 開發助理 |
| **E：MCP Toolbox** 開源 | Google 開源專案，支援 MySQL/PostgreSQL 等多種資料源，先定義好 SQL Pattern，Agent 只能照這些模板查詢，能力受限但更可控 | 全託管 MCP 出現前的替代方案，或需要嚴格限制查詢範圍 |

官方 BQCA 的 **Agent Catalog** 展示了多種現成範本可直接套用，例如 **Supply chain analyst**（供應鏈分析）、**Financial forecaster**（財務預測），以及企業內自建的 **Ecommerce agent**、**Planner agent**、**Product & Sales agent** 等，顯示這套工具已經涵蓋從供應鏈到財務到電商的多種角色需求。

- **關鍵安全機制**：不管哪種方案，都可以把 MCP 工具設成**唯讀（Read-only）**，Agent 就算「腦筋不清楚」也不可能誤刪或改動資料。
- **可觀測性**：ADK 加一行 Plugin 程式碼，就能把 Agent 的執行紀錄（Token 用量、哪個工具延遲最長）寫進 BigQuery，再用 BQCA 反過來對這份紀錄提問。

---

#### 第二段 · Happy Lee 李昆謀（91APP）

## 從「怎麼查」到「查出來能不能信」

- **背景**：91APP 用同一套 Code Base（SaaS）服務上萬個電商品牌客戶，資料 schema 統一，很早就把資料建置在 GCP／BigQuery 上。
- **踩過的坑：數據定義問題**——「轉換率」「當日訂單數」都不是原始資料，是算出來的；不同團隊各自定義計算方式，同一份資料源卻算出不同數字，導致客戶質疑報表打架。

### 解法一：Looker 成為數據定義核心

![91APP 官方投影片：指標拆分為商業核心、商業行為、商業維度三層，對應 Looker 的 Measure 與 Dimension，並建立 Looker Data Dictionary](/activities/cloud-day-2026/s05-2.webp)

*91APP 官方投影片：指標拆分為商業核心／商業行為／商業維度三層，對應 Looker 裡的 Measure 與 Dimension，並建立 Looker Data Dictionary*

91APP 成立**數據定義委員會**，導入 **Looker** 把所有指標拆成三層：

- **商業核心**：構成指標的最主要維度且具有商業核心特性，例如訂單數、會員數、訪客數
- **商業行為**：基於商業核心增加先決條件或行為動作，例如綁定推薦人（訂單數）、發送線上推廣連結（會員數）、瀏覽（訪客數）
- **商業維度**：對商業核心拆成各分類，例如訂單數可依環境（線上/門市）分為線上訂單數及門市訂單數

三層對應到 Looker 的 **Measure** 與 **Dimension**，並整理成一份 **Looker Data Dictionary**（欄位名稱、說明、LookML Name、型別、SQL 全部對照），例如「不重複瀏覽會員數」對應 `sale_page_view_member_count`（Count distinct），「會員瀏覽轉換率」則用 `SAFE_DIVIDE(...)` 計算——所有應用統一從這份字典拉資料，確保口徑一致，變成「Data Governance as a Service」。

### 解法二：DAA 資料安全管線——AI 只能看、不能動

![91APP 的 DAA（Data Agent Architecture）投影片：AI 放進多層防護管線，AI 負責理解問題，權限與數字由程式把關](/activities/cloud-day-2026/s05-3.webp)

*91APP 的 DAA（Data Agent Architecture）不是把資料丟給 AI，而是把 AI 放進一套多層防護的管線：AI 負責理解問題，權限與數字由程式把關*

91APP 的核心心法是：**DAA 不是把資料丟給 AI，而是把 AI 放進一套多層防護的管線——AI 只負責理解問題，權限與數字判斷一律由程式把關。**完整流程：

使用者提問 → AI 理解問題 → **程式驗證關卡**（授權・唯讀・白名單）→ 資料庫查詢 → 輸出檢查 → 回覆使用者

- **授權在開門時就鎖定**：能查哪些商店的資料，由平台在對話開始時決定並鎖定；AI 不能自行認證，也不能中途擴大範圍。
- **每一筆查詢都過門禁**：送出前由程式（不是 AI 自己）比對查詢範圍必須完全等於授權範圍，不符直接擋下——即使 AI 被誘導，也執行不了。
- **只能讀、不能動**：系統採唯讀設計，不賦予任何修改、刪除、變更權限，且資料的指令一律被程式攔截。
- **AI 拿不到金庫鑰匙**：實際資料結構與連線憑證都不經過 AI；查詢組合完成後還會逐字比對白名單，出現未授權名稱就整句拒絕。

> *「AI 像一位分析師：門禁與金庫鑰匙始終在系統手上，分析師只拿得到被核准的那一份報表。」*

### 導入 Data Agent 的其他實戰細節

- **語意理解與反問**：使用者問「最近業績如何」這種模糊問題，Agent 不會亂猜，而是先**回頭確認**（例：「最近」是否指過去 4 週？「業績」指訂單金額還是別的？），給預設建議讓使用者確認後才執行查詢——避免「牛頭不對馬嘴」的答案。
- **不同角色問法差異很大**：老闆愛問空泛的大哉問（「業績如何」），廣告投手會用推理式提問（「廣告沒減少，為什麼業績下滑」），Agent 需要具備 Domain Know-how（如「廣告投放會影響哪些指標」）才聽得懂行話。
- **資料正確性自我驗證**：每次查詢會自己做抽樣驗算，確保回覆的數字是對的——因為客戶看到漂亮報表就會信任，但無法自行驗算 Agent 算得對不對，這是全新的信任風險。
- **完整循環（Agent 的終極價值）**：不是「給我一張報表」就結束，而是 Agent 主動幫忙定義目標（如「新客」精確定義是什麼）、找出洞察（如 63% 加入會員卻沒消費過）、**直接建議行動方案並排好檔期時程表**，最後問你要不要直接執行——**報表是工具，不是目的，目的是找出可以執行的動作**。

## 總結

1. **選 Agent 查資料的方案時，「唯讀鎖定」是第一道也是最重要的安全閘門**——不管技術多花俏，這條線不能省。
2. **91APP 的核心心法可以直接搬來用**：確定性的檢查（防呆、防注入）永遠用程式碼寫死，不要交給 Agent 自己判斷「這樣做安不安全」；91APP 的 DAA 四層防護（授權鎖定／每筆過門禁／唯讀／AI 拿不到金庫鑰匙）是很具體的落地範本。
3. **資料定義治理（Looker/LookML 這類語意層）要先做，Agent 才有穩固的地基可以問**——這跟數據湖倉場的邏輯一致，反覆出現在多場講座裡，是這次 Cloud Day 最一致的主軸訊息。
4. Agent 主動反問釐清需求、給預設值讓人確認的互動設計，是我們自己若要做客戶自助查詢工具時很值得抄的體驗模式。
