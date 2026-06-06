import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI 是什麼？n8n 能做什麼？AI 自動化常見問題',
  description: '什麼是 AI、AI Agent、RAG？n8n 能幫企業做什麼？整理 AI 與自動化最常被問的問題，用白話一次說清楚——從觀念、實際應用到導入企業。',
  keywords: ['ai 是什麼', '人工智慧定義', 'n8n 是什麼', 'ai 應用', 'rag 是什麼', 'ai agent 是什麼'],
  alternates: { canonical: 'https://aiqkangber.com/faq' },
}

const BASE_URL = 'https://aiqkangber.com'

const faqs = [
  {
    category: 'AI 基礎觀念',
    items: [
      {
        q: '什麼是 AI（人工智慧）？簡單講它能做什麼',
        a: 'AI（人工智慧）是讓電腦模仿人類「理解、判斷、生成」能力的技術。換句話說，人工智慧的定義，就是讓機器具備原本只有人才有的理解與生成能力。現在大家在用的 ChatGPT、Claude 這類生成式 AI，本質是讀過海量文字後，能聽懂你的話、幫你寫文章、寫程式、分析資料、回答問題。對企業來說重點不是「AI 多聰明」，而是它能把原本要人花時間做的重複腦力工作——分類郵件、整理報表、回覆客服、草擬文案——接手處理。你負責出題和把關，它負責把量做出來。',
      },
      {
        q: 'AI 可以幫企業做什麼？有哪些用途和實際應用例子？',
        a: 'AI 的用途，最實際的幾類是：客服自動回覆（讀懂問題、從你的資料庫找答案）、文件與報表自動整理（把雜亂的訂單、發票、Email 變成結構化資料）、內容生成（產品描述、社群貼文、電子報草稿）、資料分析（從一堆數字裡抓趨勢和異常）。以電商為例，最常見的應用例子是訂單自動匯入、自動對帳、客訴自動分類派工。判斷一個應用值不值得做，看「這件事每天/每週重複幾次」——越高頻、越規則化，自動化的回報越大。',
      },
      {
        q: 'AI Agent 是什麼？和一般 AI 聊天機器人差在哪？',
        a: '一般聊天機器人是「你問一句、它答一句」，每次都要你下完整指令。AI Agent 則是你給它一個「目標」，它會自己拆步驟、決定用哪些工具、呼叫幾次，直到完成。差別在它有「推理＋使用工具」的能力——能自己查資料、讀資料庫、呼叫 API、再把結果丟回去判斷。例如你說「把這週訂單對帳並寄報表給會計」，聊天機器人只會教你怎麼做，AI Agent 會真的去抓訂單、比對、產報表、寄信。代價是設計門檻高、要控制它別亂跑，所以實務上先從單一明確任務做起。',
      },
    ],
  },
  {
    category: 'n8n 工作流自動化',
    items: [
      {
        q: 'n8n 是什麼？可以拿來做什麼？',
        a: 'n8n 是一套「工作流程自動化」工具，把不同軟體服務串在一起，讓資料自動在它們之間流動。你用拖拉節點的方式設計流程：某件事發生（例如收到一筆蝦皮訂單）→ 自動做下一步（寫進 Google Sheets → 通知 Slack → 寄確認信）。常見用途：訂單匯入、自動對帳、客服分流、定時抓報表、把 AI 接進流程裡自動分類或回覆。n8n 最大的特色是可以「自架（self-hosted）」，資料完全在你自己的伺服器上、不經過第三方，而且開源版本免費。',
      },
      {
        q: 'n8n 和 Zapier、Make 有什麼差別？',
        a: '三者都是把服務串起來的自動化工具，最大差別在「資料放哪」和「費用結構」。Zapier、Make 是訂閱制雲端服務，上手快，但任務量一大費用很快飛起來，資料也會經過它們的伺服器。n8n 可以自架，資料完全留在你自己手上，開源版免費，量再大也不按次收費。流程會碰敏感資料（個資、訂單、財務）或任務量高、想長期省成本，n8n 自架幾乎是唯一划算解；只是輕量偶爾跑，Zapier、Make 上手更快。',
      },
      {
        q: '沒有寫程式基礎，也能用 n8n 嗎？',
        a: '基本流程可以。n8n 是視覺化拖拉介面，常見串接（表單→試算表、訂單→通知、定時抓資料）點一點就能完成，不用寫 code。但老實說，當流程變複雜（資料格式要轉換、串沒有現成節點的 API、加判斷邏輯），會碰到需要寫一點 JavaScript 或看懂 API 文件的地方。務實的態度是「簡單的自己做、複雜的找人做或先學」。想自己上手，建議從一個真實小痛點開始（例如把表單回覆自動整理進試算表），做出來最有感、也學得最快。',
      },
    ],
  },
  {
    category: 'AI 導入與資料應用',
    items: [
      {
        q: 'RAG 是什麼？對企業有什麼用？',
        a: 'RAG（檢索增強生成）白話講就是「讓 AI 回答前，先去翻你的專屬資料庫」。一般 AI 只會用訓練時學過的通用知識，不知道你公司內部的東西。RAG 的做法是：先把你的文件（產品手冊、SOP、客服紀錄）建成可搜尋的知識庫，使用者一問，系統先找出最相關的段落，再讓 AI 根據那些段落回答。好處是答案有憑有據、可隨時更新（換文件就好，不用重訓模型），也不會像通用 AI 那樣亂編。企業最常拿來做內部知識問答、客服助理、新人查詢。',
      },
      {
        q: '公司的內部資料，能不能變成 AI 問答助理？',
        a: '可以，這正是 RAG 最典型的應用。流程大致是：把你的資料（PDF、Word、試算表、網站內容、甚至過往 Email）整理、切段、建成向量知識庫，再接上對話介面，員工或客人就能用自然語言問、它從你的資料裡找答案。重點不在技術多炫，而在三件事：資料要夠乾淨、答案要能附來源（方便查證）、設好「查不到就老實說不知道」避免亂答。這類內部 AI 問答助理是我常接的案子之一，想做可以直接聊需求。',
      },
    ],
  },
  {
    category: '合作與服務',
    items: [
      {
        q: '怎麼開始合作？',
        a: '直接寄信到 asdtodd42@gmail.com，或透過頁面底部的「免費諮詢」。我會在 1–2 個工作天內回覆，安排一次免費的線上需求訪談（約 30–60 分鐘），先把你的問題和目標聊清楚，再判斷適不適合自動化、怎麼做最划算。',
      },
      {
        q: '定價怎麼算？',
        a: '每個專案依整合系統數量、複雜度、功能範圍報「固定價」，不是按時計費，你事先就知道總花費、不會做到一半被加價。服務頁面上的價格為起始參考價，實際報價在需求訪談、確認範圍後給你。',
      },
      {
        q: '從諮詢到上線大概要多久？',
        a: '依專案複雜度而定，一般 n8n 流程自動化約 1–3 週，AI 應用開發約 2–6 週。需求訪談後會提供更準確的時程與分階段規劃，讓你清楚每階段交付什麼。',
      },
      {
        q: '上線後如果有問題怎麼辦？',
        a: '上線後有 2 週免費調整期，期間發現的問題免費修復。之後可以選擇維護合約，或依實際狀況按次報價，不綁長約。',
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
    <main className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
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

      <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-3">AI X 自動化指南</h1>
      <p className="text-slate-400 mb-14">
        AI、n8n、自動化最常被問的問題，用白話講清楚。有其他問題歡迎
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
