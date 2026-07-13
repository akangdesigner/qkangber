---
title: Google Agent Development Kit（ADK）最新功能和發展
track: 開發者社群技術專場
order: 7
speakers:
  - name: Thu Ya Kyaw
    title: Senior Developer Relations Engineer, Google Cloud
cover: /activities/cloud-day-2026/s08-2.webp
summary: ADK 是 Google 開源的 AI Agent 開發框架，開放、跨模型、可觀測；2.0 版新增「圖形化工作流」與「動態編排」兩種建構方式，並強化多 Agent 協作與人為審核（Human-in-the-loop）。
---

![Google Cloud Day 開發者社群技術專場「ADK 最新功能和發展」現場投影片](/activities/cloud-day-2026/s08-1.webp)

## ADK 是什麼

- **開放設計的 Agent 開發框架**，開源、適用所有模型——不只 Gemini，也能接開源模型、在 Ollama / vLLM / GKE 上本地部署。
- 可搭配 **A2A、MCP Server**，以及 LangChain、CrewAI 等其他框架一起用。
- **內建可觀測 UI**：看 Token 用量、工具活動、Model↔UI 的延遲時間，方便除錯與優化。

## 2.0 兩大新工作流

- **圖形化工作流（Graph-based Workflow）**：當流程需要嚴格規則、條件分支（yes/no、對/錯）時使用，畫成圖、每個節點職責清楚。
- **動態編排（Dynamic Orchestration）**：不想被綁在圖上時，用接近寫 Python 的方式自由編排，可連續執行；還能設 **checkpoint 斷點續跑**（跑到一半失敗，指定從某步重跑，不用全部重來）。

## 確定性 vs 機率性：Support Concierge 範例

大語言模型是「機率性」的，會有選錯、跑偏的風險。解法：關鍵路由用 **Router**（程式碼，只有 1 或 0）做意圖分類，把「確定性」的判斷交給程式，「理解」交給模型——分類 → 路由 → 對應的 sub-agent。現場示範了一個 **Support Concierge** 範例的 Router 實作：

```
# Router
def router(node_input: types.Content):
    routes = node_input.parts[0].text.split(",")
    routes = [route.strip() for route in routes]
    yield Event(route=routes)
```

這個「確定性交給 tool、理解交給模型」的原則，和 GECX 場統一超商的做法一致——大語言模型負責分類使用者意圖，實際路由到哪個 sub-agent 則完全由程式碼決定，不讓模型自己拍板。

## 多 Agent 協作模式（Collaborative Modes）

![ADK 官方定義的三種多 Agent 協作模式投影片：Chat、Task、Single-turn 各自對應不同使用情境](/activities/cloud-day-2026/s08-2.webp)

*ADK 官方定義的三種多 Agent 協作模式，各自對應不同的使用情境*

| 模式 | 行為 | 範例 |
| --- | --- | --- |
| **Chat** | The specialist takes over the conversation entirely from the coordinator and interacts with users all the way.（專家完全接手對話，全程直接與使用者互動） | Technical Troubleshooter 技術疑難排解 |
| **Task** | The coordinator assigns scoped work. The specialist works with users to finish the task and returns a structured result.（協調者指派範圍明確的工作，專家與使用者互動完成任務後回傳結構化結果） | Making a reservation 訂位／預約 |
| **Single-turn** | The coordinator assigns work that completes with no user interaction. The specialist does its job and returns a result.（協調者指派的工作不需使用者互動即可完成，專家做完直接回傳結果） | Sending an email 寄送郵件 |

## 人為審核與並行執行

- **Human-in-the-loop**：新增 `request input` 功能，關鍵決策讓人介入審批。例：機票改價、艙等升級不讓機器自己決定，要人按下批准。
- **平行與合作**：用 Tuple 並行執行、Join 自動等待所有分支完成、Gather 把多個結果收成一個 array。

## 總結

- ADK 的意義是「**AI Agent 開發正在標準化、低門檻化**」——後端/一般工程師也能快速產出 Agent。未來若要幫客戶做客製 Agent，這是主流工具之一。
- 兩個實務原則值得記：**Human-in-the-loop**（敏感決策留一手給人）與**確定性路由**（別把該用程式判斷的事丟給模型）——Support Concierge 的 Router 範例就是最直接的示範。
- **Chat / Task / Single-turn** 三種協作模式的官方定義，可以直接拿來當作設計多 Agent 系統時「這個子任務該用哪種模式」的判斷依據。
- 因為 ADK 開源又跨模型，導入不會被單一雲廠綁死，彈性高。
