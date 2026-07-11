import Link from 'next/link'
import FlipCard from '@/components/about/FlipCard'
import StatsBlock from '@/components/about/StatsBlock'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: { absolute: '關於 Q kangber — 把重複工作交給 n8n 的流程架構師 × Vibe Coding 實踐者' },
  description: '我是 Q kangber，商業自動化碩士、行銷公司 AI 工程師。這裡記錄我把訂單、報表、客服交給 n8n 自動化的實作經驗，也分享用 AI 寫程式的開發心得，並提供企業導入服務。',
  keywords: ['n8n 流程架構師', '職涯平台業師', 'AI 轉型顧問', '企業 AI 培訓'],
  path: '/about',
})

const socialLinks = [
  { href: 'https://www.threads.com/@q_kangber', label: 'Threads' },
  { href: 'https://www.instagram.com/q_kangber', label: 'Instagram' },
]

const siteLinks = [
  { href: '/services', label: '服務項目', desc: '電商與行銷自動化，每個服務獨立頁面說明' },
  { href: '/blog', label: 'AI × n8n 知識庫', desc: '自動化實戰心得、AI 工具應用與問題排解記錄' },
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
    role: '職涯平台　業師',
    current: true,
    desc: '於職涯平台擔任業師並舉辦實體講座，將 n8n 自動化與 API 整合的實戰技術轉化為可落地的教學體系，陪伴個人從零到實際導入。',
  },
  {
    role: '企業 AI 轉型顧問',
    current: true,
    desc: '協助企業實現 AI 轉型與自動化，提供內部教育訓練，把重複性高的作業流程導入 n8n 與 AI，陪伴團隊從評估到落地。',
  },
]

const faqs = [
  {
    q: '找你做自動化，通常怎麼開始？流程是什麼？',
    a: '一開始我會先了解你目前的流程，包括哪些步驟還在手動處理、每天花多少時間、用了哪些工具。確認需求後，我會免費評估這個流程適不適合自動化、大概可以怎麼做，這個階段不收費、也不需要簽約。等雙方確認方向，我才會報價、排定時程開始進行。開發過程中你可以隨時看到實際運作的狀況，不會等到全部完成才一次交付。',
  },
  {
    q: '你最擅長解決哪一類問題？',
    a: '我最擅長處理重複性高、有固定規則，而且需要跨多個工具的流程。例如訂單進來後自動分流到物流和庫存、每週從不同平台彙整數據產出報表、或大量重複的客戶問題回覆。這類動作固定、只是資料不同的工作，自動化能省下的時間最多。我是電商物流出身，對實際業務流程的細節比較清楚，做出來的東西會貼近你實際的作業方式，在現場用得順。',
  },
  {
    q: '大概怎麼收費？',
    a: '收費依流程的複雜度評估，不採固定鐘點計價。單一的簡單流程，和需要串接多個 API、含 AI 判斷的整套系統，費用會有明顯差距。我會在免費評估後，依實際的工作範圍報一個明確的價格給你。初次評估不收費，確定合作後才談費用。',
  },
  {
    q: '會幫我部署軟體或 n8n 嗎？',
    a: '會。我可以幫你把 n8n 架設在自己的伺服器上，資料保留在你這邊不會外流，並負責把環境建好、流程部署到能正常運作為止。如果你已經有現成的 n8n 或其他系統，我也可以接續現有架構繼續做，不需要重新建置。',
  },
  {
    q: '有提供售後維護嗎？',
    a: '有。流程上線後，平台改版或 API 變動都可能影響運作，這部分我會協助處理。交付時我會清楚說明流程的運作方式，上線後一段時間內的調整都包含在內；如果之後需要擴充新功能或長期維護，可以再依你的需求另外約定合作方式。',
  },
]

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Q kangber',
  url: 'https://aiqkangber.com/about',
  email: 'asdtodd42@gmail.com',
  jobTitle: 'n8n 自動化流程架構師',
  description: '專注於 n8n 與 AI 深度整合的流程架構師。協助企業實現 AI 轉型與自動化、提供內部培訓，同時於職涯平台擔任業師並舉辦實體講座。',
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

      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
        {/* Eyebrow — 對齊全站 hero 標準（綠點紫膠囊 + About） */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full" style={{ padding: '6px 15px', border: '1px solid rgba(124,92,255,0.3)', background: 'rgba(124,92,255,0.07)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
          <span style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#c4b5fd' }}>
            About
          </span>
        </div>

        {/* Flip card hero */}
        <FlipCard />

        {/* 數字區塊 — 目前累積 */}
        <StatsBlock />

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
