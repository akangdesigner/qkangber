import { getAllServices } from '@/lib/mdx'
import ServicesTabs from '@/components/services/ServicesTabs'
import HeroBanner from '@/components/services/HeroBanner'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { jsonLdScript } from '@/lib/jsonld'

export const metadata = buildMetadata({
  title: '服務 — n8n 自動化、電商與行銷自動化、AI 客服與知識庫建置',
  description: 'n8n 工作流自動化、電商訂單與報表自動化、行銷與社群自動化，以及 AI 客服機器人、RAG 知識庫建置與網站開發——協助電商與行銷團隊把自動化真正導入日常營運。',
  keywords: ['n8n 自動化服務', '電商自動化', '行銷自動化', 'AI 客服機器人', '報表自動化'],
  path: '/services',
  ogSubtitle: '多平台發文 · 每週數據報表 · Threads token 自動續期，免費範本匯進 n8n 就能用',
  ogBadge: '免費下載',
})

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI 自動化與應用服務',
    description: '電商訂單、行銷漏斗、報表與社群自動化，以及 AI 客服機器人、RAG 知識庫建置與網站開發——一站式自動化與 AI 服務。',
    url: 'https://aiqkangber.com/services',
    provider: {
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
      { '@type': 'ListItem', position: 2, name: '服務', item: 'https://aiqkangber.com/services' },
    ],
  },
]

export default async function ServicesPage() {
  const services = await getAllServices()
  const automationServices = services.filter((s) => !s.serviceType || s.serviceType === 'automation')
  const aiServices = services.filter((s) => s.serviceType === 'ai')
  const productServices = services.filter((s) => s.serviceType === 'product')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* Full-width hero banner */}
      <HeroBanner />

      <div id="services" className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-16 scroll-mt-20">
      <ServicesTabs automationServices={automationServices} aiServices={aiServices} productServices={productServices} />

      <div
        className="relative rounded-2xl border border-white/[0.08] p-8 text-center mt-4 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(124,92,255,0.10), transparent 60%), #0a0b14',
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,92,255,0.4), transparent)' }}
        />
        <p className="text-slate-400 mb-2 text-sm">有客製化需求？</p>
        <p className="text-xl font-semibold text-white mb-5 tracking-[-0.01em]">
          說說你的需求，我來評估怎麼用 AI 解決
        </p>
        <Link href="/contact" className="btn btn--ink">
          <span className="btn__dot" />
          <span className="btn__label">免費諮詢</span>
          <span className="btn__arrow">→</span>
        </Link>
      </div>
    </div>
    </>
  )
}
