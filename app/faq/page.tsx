import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '常見問題 FAQ — Q kangber',
  description: 'Q kangber 服務常見問題：定價方式、合作流程、付款方式、售後支援、n8n 自動化與 AI 應用服務說明。',
}

const BASE_URL = 'https://aiqkangber.com'

const faqs = [
  {
    category: '合作流程',
    items: [
      {
        q: '怎麼開始合作？',
        a: '透過頁面底部的「免費諮詢」按鈕或直接寄信到 asdtodd42@gmail.com。我會在 1–2 個工作天內回覆，安排一次免費的線上需求訪談（約 30–60 分鐘）。',
      },
      {
        q: '初次諮詢要收費嗎？',
        a: '不收費。初次諮詢的目的是了解你的需求，評估是否適合自動化或 AI 解決方案，確認範圍後才會報價。',
      },
      {
        q: '從諮詢到上線大概要多久？',
        a: '依專案複雜度而定，一般 n8n 流程自動化約 1–3 週；AI 應用開發約 2–6 週。需求訪談後會提供更準確的時程估算。',
      },
    ],
  },
  {
    category: '定價與付款',
    items: [
      {
        q: '定價怎麼算？',
        a: '每個專案依整合系統數量、複雜度、功能範圍報固定價，不是按時計費。服務頁面上的價格為起始參考價，實際報價在需求訪談後確認。',
      },
      {
        q: '付款方式是什麼？',
        a: '一般採分期付款：專案啟動前支付 50%，上線驗收後支付剩餘 50%。具體安排可在合約中調整。',
      },
      {
        q: '有月費或訂閱制嗎？',
        a: '服務本身是一次性專案費用。如有持續維護或優化需求，可另外簽維護合約，依需求量報價。',
      },
    ],
  },
  {
    category: 'n8n 自動化',
    items: [
      {
        q: '我需要自己有 n8n 伺服器嗎？',
        a: '不一定。可以用 n8n.cloud 的雲端版（有免費方案），也可以自架 Self-hosted 版本。我可以協助你評估最適合的方式並完成建置。',
      },
      {
        q: '支援哪些平台和 API 串接？',
        a: '只要有 API 的平台都可以串接，常見的有 Shopify、WooCommerce、LINE、Slack、Google Sheets、Notion、HubSpot 等。特殊平台可在需求訪談時確認。',
      },
      {
        q: '上線後如果流程壞了怎麼辦？',
        a: '上線後有 2 週免費調整期，期間內發現的問題免費修復。之後可以選擇維護合約，或依實際狀況按次報價處理。',
      },
    ],
  },
  {
    category: 'AI 應用開發',
    items: [
      {
        q: '你用的是哪個 AI 模型？',
        a: '主要使用 Anthropic Claude 系列（claude-sonnet、claude-opus）。依專案需求也會使用 Groq（Llama）或其他模型。會根據你的使用情境、預算、速度需求來推薦最適合的選擇。',
      },
      {
        q: 'AI 生成的內容準確嗎？會亂掰嗎？',
        a: '準確度取決於設計方式。我會透過提示詞工程、知識庫限制、輸出格式驗證等手段，讓 AI 在你定義的範圍內回答，大幅降低亂掰的機率。但 AI 仍有極限，我會在需求訪談時說明適合與不適合的情境。',
      },
      {
        q: 'API 費用由誰負擔？',
        a: 'AI API（如 Anthropic、OpenAI）的費用由你自己的帳號支付，我協助你建置和優化，不從 API 費用抽成。這樣你對用量和費用有完整控制權。',
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
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      }))
    ),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: '常見問題', item: `${BASE_URL}/faq` },
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
          <li><span className="text-slate-300">常見問題</span></li>
        </ol>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
        <span
          className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
          style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          FAQ
        </span>
      </div>

      <h1 className="text-4xl font-semibold text-white tracking-[-0.02em] mb-3">常見問題</h1>
      <p className="text-slate-400 mb-14">有其他問題？歡迎直接<a href="mailto:asdtodd42@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors ml-1">寄信詢問</a>。</p>

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
          還是找不到答案？{' '}
          <Link href="/services" className="text-violet-400 hover:text-violet-300 transition-colors">查看服務項目</Link>
          {' '}或{' '}
          <a href="mailto:asdtodd42@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors">直接聯絡我</a>。
        </p>
      </div>
    </main>
  )
}
