import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI X 自動化指南',
  description: 'n8n、AI Agent、RAG、Prompt Engineering 常見技術問題解答。從架構選型到實際踩坑，全部說清楚。',
  alternates: { canonical: 'https://aiqkangber.com/faq' },
}

const BASE_URL = 'https://aiqkangber.com'

const faqs = [
  {
    category: 'n8n 工作流',
    items: [
      {
        q: 'n8n 和 Zapier、Make 有什麼差別？',
        a: '最大差別是 n8n 可以 self-hosted，資料完全在自己的機器或雲端上，不經過第三方伺服器。Zapier 和 Make 是訂閱制 SaaS，任務量一上去費用很快就飛起來。n8n 開源版本免費，如果你的流程會處理敏感資料，或任務量高，n8n self-hosted 幾乎是唯一選擇。',
      },
      {
        q: 'Webhook 和 Polling 有什麼差別，我該用哪個？',
        a: 'Webhook 是「有事發生時通知你」，Polling 是「定時去問有沒有事發生」。能用 Webhook 就用——即時、省資源、不浪費 API 配額。Polling 適合不支援 Webhook 的服務，或是需要定時批次處理的場景（例如每天早上 8 點跑報表）。',
      },
      {
        q: 'n8n 流程失敗怎麼排查？',
        a: '先看 Execution 記錄，點進失敗那筆，每個 node 都可以看 input/output。大部分問題是：1) API 回傳格式和預期不同，2) 認證失效（token 過期），3) Rate limit 被踢。建議流程加上 Error Trigger node，失敗時直接推 Slack 或 Email 通知，不然你根本不知道壞了。',
      },
      {
        q: 'Self-hosted n8n 要多少資源？',
        a: '512MB RAM、1 vCPU 就能跑起來。流程量大、concurrent executions 多的話建議 2GB RAM。資料庫強烈建議換成 PostgreSQL 而不是預設的 SQLite，穩定性差很多。用 Docker Compose 部署是最省事的方式。',
      },
    ],
  },
  {
    category: 'AI Agent 架構',
    items: [
      {
        q: 'AI Agent 和普通的 API 呼叫有什麼差別？',
        a: '普通 API 呼叫是你寫死「做什麼」，Agent 是你告訴它「達成什麼目標」，讓它自己決定要用哪些工具、呼叫幾次。差別在於 Agent 有推理能力和工具使用能力。Anthropic Claude 在 tool use 這塊目前是業界頂尖，推理準確、遵循格式指令的能力很強。',
      },
      {
        q: 'Multi-agent 系統什麼時候才需要？',
        a: '單一任務拆不開、或是上下文太長 token 不夠用的時候。常見場景：一個 orchestrator agent 分派任務給多個 specialized agent（一個查資料、一個寫文字、一個審查輸出）。門檻不低，先把單 agent 做穩再考慮拆。',
      },
      {
        q: 'Agent 的 Memory 怎麼設計？',
        a: '短期記憶就是 conversation history，長期記憶通常存在向量資料庫（RAG 模式）或結構化資料庫。如果 agent 需要記住用戶偏好或歷史互動，建議把重要資訊整理成 summary 存下來，而不是塞整段對話。Token 貴，精煉比原始保存省錢。',
      },
    ],
  },
  {
    category: 'RAG 與向量資料庫',
    items: [
      {
        q: 'RAG 是什麼，和直接把資料塞進 Prompt 有什麼差別？',
        a: 'RAG（Retrieval-Augmented Generation）是先從知識庫搜尋出相關段落，再把那段塞進 Prompt。差別：Context window 有上限，幾千頁文件塞不進去，RAG 只取最相關的；準確度更高，因為答案有明確來源；知識庫可以隨時更新，不用重新訓練模型。',
      },
      {
        q: 'Pinecone、pgvector、Qdrant 怎麼選？',
        a: '如果你已經在用 PostgreSQL，pgvector 是最省事的選擇，不需要多一個服務。Qdrant 是 self-hosted 向量資料庫裡最好用的，效能好、界面清晰。Pinecone 是雲端服務，不用管基礎設施，但費用比較高。資料量不大（< 100 萬筆向量）的話三者差異不明顯，選你最熟悉的就好。',
      },
      {
        q: 'Embedding 模型要怎麼選？',
        a: 'OpenAI text-embedding-3-small 是 CP 值最高的選擇，便宜、效果好、支援多語言。繁體中文效果要求高可以考慮 Cohere multilingual。自己跑 embedding 模型（如 bge-m3）只有在資料敏感或量大到 API 費用吃不消時才值得。',
      },
    ],
  },
  {
    category: 'Prompt Engineering',
    items: [
      {
        q: 'System prompt 和 User prompt 的分工是什麼？',
        a: 'System prompt 是「這個 AI 是誰、有什麼限制、輸出格式是什麼」——用來設定角色和規則。User prompt 是「這次具體要做什麼」。規則和格式放 system，任務和資料放 user。Claude 對 system prompt 的遵循能力特別強，值得好好設計。',
      },
      {
        q: '輸出格式不穩定、每次不一樣怎麼辦？',
        a: '強制要求 JSON 輸出，並在 prompt 裡給範例（few-shot）。Claude 支援 tool use 和 structured output，可以直接要求它填進一個定義好的 schema，比 prompt 要求更可靠。如果還是不穩，加 validation + retry 邏輯，輸出不符格式就重試。',
      },
      {
        q: '什麼情況下用 Claude Opus 而不是 Sonnet？',
        a: 'Opus 推理能力更強，適合複雜判斷、多步驟規劃、需要深度理解的任務。Sonnet 速度更快、費用更低，適合高頻率任務或簡單的分類、摘要工作。建議先用 Sonnet 跑通，只在 Sonnet 表現不夠好的地方換 Opus，不要一開始就全用 Opus。',
      },
    ],
  },
  {
    category: '合作與服務',
    items: [
      {
        q: '怎麼開始合作？',
        a: '直接寄信到 asdtodd42@gmail.com，或透過頁面底部的「免費諮詢」。我會在 1–2 個工作天內回覆，安排一次免費的線上需求訪談（約 30–60 分鐘）。',
      },
      {
        q: '定價怎麼算？',
        a: '每個專案依整合系統數量、複雜度、功能範圍報固定價，不是按時計費。服務頁面上的價格為起始參考價，實際報價在需求訪談後確認。',
      },
      {
        q: '從諮詢到上線大概要多久？',
        a: '依專案複雜度而定，一般 n8n 流程自動化約 1–3 週；AI 應用開發約 2–6 週。需求訪談後會提供更準確的時程。',
      },
      {
        q: '上線後如果有問題怎麼辦？',
        a: '上線後有 2 週免費調整期，期間發現的問題免費修復。之後可以選擇維護合約，或依實際狀況按次報價。',
      },
    ],
  },
]

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }))
    ),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'AI X 自動化指南', item: `${BASE_URL}/faq` },
    ],
  }

  return (
    <main className="relative max-w-3xl mx-auto px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(124,92,255,0.08), transparent 60%)' }}
      />

      <nav aria-label="breadcrumb" className="mb-8">
        <ol className="flex items-center gap-1.5 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-slate-300 transition-colors">首頁</Link></li>
          <li><span className="text-slate-700">/</span></li>
          <li><span className="text-slate-300">AI X 自動化指南</span></li>
        </ol>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
        <span
          className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
          style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Technical Guide
        </span>
      </div>

      <h1 className="text-4xl font-semibold text-white tracking-[-0.02em] mb-3">AI X 自動化指南</h1>
      <p className="text-slate-400 mb-14">
        n8n、AI Agent、RAG、Prompt Engineering 的實戰問答。有其他問題歡迎
        <a href="mailto:asdtodd42@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors ml-1">直接問我</a>。
      </p>

      <div className="space-y-14">
        {faqs.map((cat) => (
          <section key={cat.category}>
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
              <span>{cat.category}</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </h2>
            <div className="space-y-4">
              {cat.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl overflow-hidden"
                  style={{ background: '#0d0e1a', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-white font-medium text-sm select-none hover:text-violet-300 transition-colors">
                    {item.q}
                    <span className="text-slate-500 group-open:rotate-180 transition-transform duration-200 flex-shrink-0">▾</span>
                  </summary>
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm text-slate-500">
          想直接讓人幫你做？{' '}
          <Link href="/services" className="text-violet-400 hover:text-violet-300 transition-colors">查看服務項目</Link>
          {' '}或{' '}
          <a href="mailto:asdtodd42@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors">免費諮詢</a>。
        </p>
      </div>
    </main>
  )
}
