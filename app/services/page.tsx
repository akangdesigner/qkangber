import { getAllServices } from '@/lib/mdx'
import ServicesTabs from '@/components/services/ServicesTabs'
import HeroBanner from '@/components/services/HeroBanner'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Q kangber 服務 — N8N 自動化、AI Agent 開發與企業 AI 轉型',
  description: '提供 N8N 工作流自動化、AI Agent 開發、聊天機器人建置與提示詞工程顧問——協助電商與行銷企業把 AI 真正導入日常營運。',
  keywords: ['N8N 自動化服務', 'AI Agent 開發', '企業 AI 轉型', '行銷自動化'],
  alternates: { canonical: 'https://aiqkangber.com/services' },
}

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

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
      <span
        className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
        style={{
          background: 'linear-gradient(90deg,#a78bfa,#60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>
    </div>
  )
}

export default async function ServicesPage() {
  const services = await getAllServices()
  const automationServices = services.filter((s) => !s.serviceType || s.serviceType === 'automation')
  const aiServices = services.filter((s) => s.serviceType === 'ai')
  const webServices = services.filter((s) => s.serviceType === 'web')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Full-width hero banner */}
      <HeroBanner />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      <ServicesTabs automationServices={automationServices} aiServices={aiServices} webServices={webServices} />

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
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-100"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
            boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          }}
        >
          免費諮詢 →
        </Link>
      </div>
    </div>
    </>
  )
}
