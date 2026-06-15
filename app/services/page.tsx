import { getAllServices } from '@/lib/mdx'
import ServicesTabs from '@/components/services/ServicesTabs'
import HeroBanner from '@/components/services/HeroBanner'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'Q kangber 服務 — N8N 自動化、電商自動化與 AI Agent 開發',
  description: '提供 N8N 工作流自動化、電商自動化、AI Agent 開發、聊天機器人建置與提示詞工程顧問——協助電商與行銷企業把 AI 真正導入日常營運。',
  keywords: ['N8N 自動化服務', '電商自動化', 'AI Agent 開發', '企業 AI 轉型', '行銷自動化'],
  path: '/services',
})

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI 自動化與應用服務',
    description: '電商訂單、行銷漏斗自動化，以及 Claude AI 應用開發、聊天機器人、提示詞工程顧問——一站式 AI 服務。',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Full-width hero banner */}
      <HeroBanner />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-16">
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
