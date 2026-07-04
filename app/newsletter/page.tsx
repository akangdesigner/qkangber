import Link from 'next/link'
import { getAllNewsletterIssues } from '@/lib/newsletter'
import { NewsletterHero } from '@/components/page-hero/PageHero'
import { buildMetadata } from '@/lib/metadata'
import { jsonLdScript } from '@/lib/jsonld'

export const metadata = buildMetadata({
  title: '電子報 — 每週 5 分鐘掌握重要 AI 資訊',
  description: '以開發者與接案者的角度精選 AI、Agent、Claude、OpenAI、n8n 與實戰案例，幫你判斷哪些資訊值得關注、每週省下數小時整理時間，5 分鐘看完。全部公開免費閱讀，也可免費訂閱直送信箱。',
  keywords: ['AI 自動化週報', 'n8n 電子報', 'AI 趨勢週報', '免費 AI 電子報'],
  path: '/newsletter',
})

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '歷期 AI 自動化週報',
    description: '歷期 Q kangber AI 自動化週報——以開發者與接案者角度精選 AI、Agent、Claude、OpenAI、n8n 與實戰案例，全部公開閱讀，免費無需訂閱。',
    url: 'https://aiqkangber.com/newsletter',
    publisher: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://aiqkangber.com' },
      { '@type': 'ListItem', position: 2, name: '電子報', item: 'https://aiqkangber.com/newsletter' },
    ],
  },
]

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default async function NewsletterPage() {
  const issues = await getAllNewsletterIssues()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <NewsletterHero />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-20">
      <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.01em] mb-6 sm:mb-8">
        歷期電子報
      </h2>
      {issues.length === 0 ? (
        <div
          className="rounded-2xl border border-white/[0.06] p-12 text-center"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-slate-500">電子報封存即將上線，敬請期待。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue, idx) => (
            <Link
              key={issue.slug}
              href={`/newsletter/${issue.slug}`}
              className="group relative flex gap-6 rounded-2xl border border-white/[0.06] p-6 transition-all duration-200 hover:border-white/[0.12]"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15), transparent 60%)' }}
              />

              <div className="relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-mono text-xs font-semibold text-slate-500 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                #{String(issues.length - idx).padStart(3, '0')}
              </div>

              <div className="relative flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[0.65rem] tracking-[0.15em] uppercase text-slate-500">
                    {formatDate(issue.date)}
                  </span>
                </div>
                <h2 className="text-white font-semibold leading-snug mb-2 group-hover:text-violet-200 transition-colors duration-150 tracking-[-0.01em]">
                  {issue.subject}
                </h2>
                {issue.summary && (
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {issue.summary}
                  </p>
                )}
              </div>

              <div className="relative flex-shrink-0 flex items-center">
                <span className="text-slate-600 group-hover:text-violet-400 transition-colors duration-150 text-lg">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  )
}
