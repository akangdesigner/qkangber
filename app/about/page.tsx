import Link from 'next/link'
import FlipCard from '@/components/about/FlipCard'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: { absolute: '關於 Q kangber — n8n 流程架構師與職涯培訓講師' },
  description: '專注於 n8n 與 AI 深度整合的流程架構師。協助企業實現 AI 轉型與自動化、提供內部培訓，同時於職涯平台擔任職涯培訓講師並舉辦實體講座。',
  keywords: ['N8N 流程架構師', '職涯培訓講師', 'AI 轉型顧問', '企業 AI 培訓'],
  path: '/about',
})

const socialLinks = [
  { href: 'https://www.threads.com/@q_kangber', label: 'Threads' },
  { href: 'https://www.instagram.com/q_kangber', label: 'Instagram' },
]

const siteLinks = [
  { href: '/services', label: '服務項目', desc: '電商與行銷自動化，每個服務獨立頁面說明' },
  { href: '/blog', label: 'AI × N8N 知識庫', desc: '自動化實戰心得、AI 工具應用與踩坑記錄' },
  { href: '/newsletter', label: '歷期電子報', desc: '每週 AI 業界動態精選，全部公開閱讀' },
]

const experience = [
  {
    role: '電商公司　電商出貨自動化專員',
    current: false,
    desc: '負責第三方物流出貨溝通協調，協助公司把傳統訂單與統計表單導入 n8n，主導出貨流程轉型自動化。這段經驗奠定了我對真實業務流程的理解。',
  },
  {
    role: '行銷公司　AI 流程開發工程師',
    current: true,
    desc: '設計與開發 AI 驅動的行銷自動化架構，整合 n8n 與各類 API。憑藉高強度的自學與實作，陸續開發出多款 App、個人品牌官網及教師教學工具。',
  },
  {
    role: '職涯培訓講師 · 企業 AI 轉型顧問',
    current: true,
    desc: '於職涯平台擔任培訓講師並舉辦實體講座，同時協助企業實現 AI 轉型與自動化，提供內部教育訓練。將 n8n 自動化與 API 整合的實戰技術轉化為可落地的教學體系，陪伴個人與團隊從零到實際導入。',
  },
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
  description: '專注於 n8n 與 AI 深度整合的流程架構師。協助企業實現 AI 轉型與自動化、提供內部培訓，同時於職涯平台擔任職涯培訓講師並舉辦實體講座。',
  sameAs: [
    'https://www.threads.com/@q_kangber',
    'https://www.instagram.com/q_kangber',
  ],
  knowsAbout: ['n8n workflow automation', 'AI application development', 'marketing automation', 'e-commerce automation', 'Vibe Coding', 'Claude Code', 'Claude AI', 'API integration'],
}

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Ambient glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.18), transparent 60%)' }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.18) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.45 }} />

      <div className="max-w-[1080px] mx-auto px-6 pt-20">
        {/* Eyebrow + subtitle */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
            <span className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold" style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              About
            </span>
          </div>
        </div>

        {/* Flip card hero */}
        <FlipCard />

        {/* 學歷 & 經歷 */}
        <section className="border-t border-white/[0.06] pt-14 mt-20">
          <h2 className="text-2xl font-semibold text-white tracking-[-0.015em] mb-9">
            學歷 <span className="text-slate-600 font-normal">&amp;</span> 經歷
          </h2>

          <div className="mb-10">
            <p className="text-[0.7rem] tracking-[0.22em] uppercase font-semibold text-violet-400 mb-4">學歷</p>
            <div className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
              <p className="font-medium text-white m-0">商業自動化與管理學系　碩士</p>
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] tracking-[0.22em] uppercase font-semibold text-violet-400 mb-4">經歷</p>
            <ul className="space-y-6 list-none p-0 m-0">
              {experience.map((e, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                  <div>
                    <p className="font-medium text-white m-0 leading-snug">
                      {e.role}
                      {e.current && (
                        <span className="ml-2 text-xs text-violet-300 font-normal px-2 py-0.5 rounded-full border border-violet-400/30 bg-violet-500/8">現職</span>
                      )}
                    </p>
                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed m-0">{e.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 這裡有什麼 */}
        <section className="border-t border-white/[0.06] pt-14 mt-16">
          <h2 className="text-2xl font-semibold text-white tracking-[-0.015em] mb-8">這裡有什麼</h2>
          <ul className="space-y-4 list-none p-0 m-0">
            {siteLinks.map(({ href, label, desc }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-200 hover:border-violet-400/40 hover:bg-violet-500/5 hover:-translate-y-px no-underline"
                >
                  <span className="mt-0.5 flex-shrink-0 text-violet-400">→</span>
                  <div>
                    <p className="font-medium text-white m-0">{label}</p>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed m-0">{desc}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 常見問題 */}
        <section className="border-t border-white/[0.06] pt-14 mt-16 max-w-2xl">
          <h2 className="text-2xl font-semibold text-white tracking-[-0.015em] mb-8">常見問題 Q&amp;A</h2>
          <ul className="space-y-4 list-none p-0 m-0">
            {faqs.map(({ q, a }, i) => (
              <li key={i} className="border border-white/[0.06] rounded-xl p-5 bg-white/[0.02]">
                <p className="font-semibold text-white mb-2 leading-snug m-0">Q：{q}</p>
                <p className="text-sm text-slate-400 leading-relaxed m-0">A：{a}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 聯絡我 */}
        <section className="border-t border-white/[0.06] pt-14 mt-16">
          <h2 className="text-2xl font-semibold text-white tracking-[-0.015em] mb-6">聯絡我</h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-300 hover:text-white transition-all duration-150 rounded-full px-5 py-2 border border-white/10 hover:border-violet-400/50"
              >
                {label}
              </a>
            ))}
            <a
              href="mailto:asdtodd42@gmail.com"
              className="text-sm text-slate-300 hover:text-white transition-all duration-150 rounded-full px-5 py-2 border border-white/10 hover:border-violet-400/50"
            >
              Email
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
