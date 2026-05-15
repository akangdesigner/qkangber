import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '關於 Q kangber — n8n 自動化流程架構師',
  description: '我是 Q kangber，n8n 與 AI 深度整合的流程架構師、Vibe Coding 實踐者。從電商物流自動化轉型，現協助企業建置 AI 行銷自動化架構，並於職涯平台擔任業師。',
}

const socialLinks = [
  { href: 'https://www.threads.com/@cutekangber', label: 'Threads' },
  { href: 'https://www.instagram.com/cutekangber', label: 'Instagram' },
]

const siteLinks = [
  { href: '/services', label: '服務項目', desc: '電商與行銷自動化，每個服務獨立頁面說明' },
  { href: '/blog', label: 'AI × N8N 知識庫', desc: '自動化實戰心得、AI 工具應用與踩坑記錄' },
  { href: '/newsletter/archive', label: '歷期電子報', desc: '每週 AI 業界動態精選，全部公開閱讀' },
]

const faqs = [
  {
    q: 'n8n 跟 Zapier、Make 有什麼差別？為什麼選 n8n？',
    a: 'Zapier 和 Make 是 SaaS，按執行次數收費，流程複雜了費用就很可觀。n8n 可以自架，資料留在自己的伺服器，加上它的節點邏輯更接近工程師思維，複雜條件和迴圈處理起來比另外兩個靈活很多。如果你的流程會長期跑、資料量大，n8n 幾乎是唯一答案。',
  },
  {
    q: '什麼是 Vibe Coding？和傳統開發有什麼不同？',
    a: 'Vibe Coding 是以自然語言提示為主要介面，讓 AI 負責生成初版程式碼，人只做架構判斷和方向引導的開發模式。傳統開發是從第一行 code 手寫到最後，Vibe Coding 則是你描述清楚「要什麼」，AI 負責「怎麼做」，大幅縮短從想法到可執行原型的時間。關鍵不在於 AI 有多強，而在於你的提示有多精準。',
  },
  {
    q: 'API 串接需要會寫程式嗎？',
    a: '基礎的 GET / POST 請求在 n8n 裡用 HTTP Request 節點就能處理，不需要寫程式。但遇到需要 OAuth 授權、動態組 header、或回傳資料要做複雜轉換時，懂一點 JavaScript 會讓你快很多。我通常建議先把流程跑通，再視情況補強這塊。',
  },
  {
    q: 'AI Agent 跟一般 AI 問答有什麼差別？',
    a: '一般 AI 問答是單次輸入輸出，你問它答。AI Agent 有「工具使用」能力，它會自己判斷要呼叫哪個 API、查哪筆資料、執行什麼動作，然後把結果組合起來回給你。簡單說：AI 問答是回答問題，AI Agent 是幫你完成任務。',
  },
  {
    q: '什麼樣的工作流程最值得自動化？',
    a: '兩個判斷條件：重複頻率高、步驟有明確規則。每天都要手動做一遍、動作都一樣、只是資料不同——這種最值得自動化。反過來說，需要人做主觀判斷、或每次情況都不一樣的工作，自動化的 ROI 就相對低。',
  },
  {
    q: '如何與你合作或聯絡？',
    a: '透過 Threads 或 Instagram 私訊我，說明目前的工作流程痛點即可，我會評估是否適合用 n8n 或 AI 解決。問題描述越具體，我越能快速給出有用的方向。',
  },
]

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Q kangber',
  url: 'https://aiqkangber.com/about',
  email: 'asdtodd42@gmail.com',
  jobTitle: 'n8n 自動化流程架構師',
  description: '專注於 n8n 與 AI 深度整合的流程架構師，Vibe Coding 實踐者。協助電商與行銷企業建置 AI 驅動的自動化架構，並於職涯平台擔任業師。',
  sameAs: [
    'https://www.threads.com/@cutekangber',
    'https://www.instagram.com/cutekangber',
  ],
  knowsAbout: ['n8n workflow automation', 'AI application development', 'marketing automation', 'e-commerce automation', 'Vibe Coding', 'Claude AI', 'API integration'],
}

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
      <span
        className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
        style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {children}
      </span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <main className="relative max-w-2xl mx-auto px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(124,92,255,0.12), transparent 60%)' }}
      />

      <div className="mb-6">
        <EyebrowLabel>About</EyebrowLabel>
      </div>

      <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight mb-8 tracking-[-0.02em]">
        歡迎來到{' '}
        <span style={{ background: 'linear-gradient(90deg, #c4b5fd, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Q kangber
        </span>
        {' '}的 AI 世界
      </h1>

      <div className="space-y-5 text-[1.05rem] text-slate-300 leading-[1.85] mb-14">
        <p>
          我是一位專注於 n8n 與 AI 深度整合的流程架構師，也是 Vibe Coding 的實踐者。我做的事不只是讓流程跑起來——而是把從資料流到系統串接的每個環節都設計過，確保整套自動化體系真正高效。
        </p>
        <p>
          我熱衷於實作 Claude 3.5、OpenCanvas 等前沿 AI 工具，在人機協作的黃金分工點上，將複雜的想法轉化為精確的系統邏輯。核心理念只有一句話：AI 不為取代判斷，而是精準表達想法。
        </p>
        <p>
          產品提案、流程設計、API 架構——這些工作的核心永遠是你的判斷，AI 的角色是讓你的想法更快落地、更清楚呈現。找到人與 AI 的分工點，才是真正有效的使用方式，而不是一味依賴。
        </p>
      </div>

      <div className="border-t border-white/[0.06] pt-10 mb-10">
        <h2 className="text-lg font-semibold text-white mb-6 tracking-[-0.01em]">學歷 &amp; 經歷</h2>
        <div className="space-y-6">
          <div>
            <p className="text-[0.7rem] tracking-[0.22em] uppercase font-semibold text-violet-400 mb-3">學歷</p>
            <div className="flex items-start gap-3 text-slate-300">
              <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
              <div>
                <p className="font-medium text-white">商業自動化與管理學系　碩士</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[0.7rem] tracking-[0.22em] uppercase font-semibold text-violet-400 mb-3">經歷</p>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                <div>
                  <p className="font-medium text-white">電商公司　電商出貨自動化專員</p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">負責第三方物流出貨溝通協調，主導出貨流程自動化建置。這段經驗奠定了我對真實業務流程的理解。</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                <div>
                  <p className="font-medium text-white">行銷公司　AI 流程開發工程師 <span className="text-xs text-violet-300 font-normal ml-1">現職</span></p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">設計與開發 AI 驅動的行銷自動化架構，整合 n8n 與各類 API。憑藉高強度的自學與實作，陸續開發出多款 App、個人品牌官網及教師教學工具。</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                <div>
                  <p className="font-medium text-white">企業合作講師 <span className="text-xs text-violet-300 font-normal ml-1">現職</span></p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">每週赴合作企業進行 AI 與自動化工具培訓。</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                <div>
                  <p className="font-medium text-white">職涯平台　課程講師 <span className="text-xs text-violet-300 font-normal ml-1">現職</span></p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">開設 n8n 自動化與 AI 工具應用課程，將實戰技術轉化為可傳承的教學體系，陪伴學員從零到實際落地。</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-10 mb-10">
        <h2 className="text-lg font-semibold text-white mb-6 tracking-[-0.01em]">常見問題 Q&amp;A</h2>
        <ul className="space-y-6">
          {faqs.map(({ q, a }, i) => (
            <li key={i} className="border border-white/[0.06] rounded-xl p-5 bg-white/[0.02]">
              <p className="font-semibold text-white mb-2 leading-snug">Q：{q}</p>
              <p className="text-sm text-slate-400 leading-relaxed">A：{a}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/[0.06] pt-10 mb-10">
        <h2 className="text-lg font-semibold text-white mb-5 tracking-[-0.01em]">這裡有什麼</h2>
        <ul className="space-y-3">
          {siteLinks.map(({ href, label, desc }) => (
            <li key={href} className="flex items-start gap-3 text-slate-400">
              <span className="mt-1 flex-shrink-0" style={{ color: '#a78bfa' }}>→</span>
              <span>
                <Link href={href} className="font-medium text-white hover:text-violet-300 transition-colors duration-150">
                  {label}
                </Link>
                {' '}— {desc}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/[0.06] pt-10">
        <h2 className="text-lg font-semibold text-white mb-5 tracking-[-0.01em]">聯絡我</h2>
        <ul className="flex flex-wrap gap-3">
          {socialLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-300 hover:text-white transition-all duration-150 rounded-full px-4 py-1.5 border border-white/10 hover:border-violet-400/50"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
