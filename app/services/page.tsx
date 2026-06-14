import { getAllServices } from '@/lib/mdx'
import ServiceCard from '@/components/services/ServiceCard'
import HeroBanner from '@/components/services/HeroBanner'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'Q kangber 服務 — 蝦皮賣家自動化：拍照建檔、商品圖生成與每日訂單統計',
  description: '專為蝦皮賣家做的兩項自動化：拍商品標籤自動辨識建檔並生成商品圖、每天訂單自動統計成報表。把上架與對帳這些重複工作交給 AI 與 n8n。',
  keywords: ['蝦皮自動化', '蝦皮上架自動化', '蝦皮商品圖', '蝦皮訂單統計', 'n8n 自動化'],
  path: '/services',
})

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '蝦皮賣家自動化服務',
    description: '拍照辨識建檔＋生成蝦皮商品圖、每日訂單自動統計——把蝦皮賣家最花時間的上架與對帳交給自動化。',
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Full-width hero banner */}
      <HeroBanner />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-3">
            <span>蝦皮賣家自動化</span>
            <span className="h-px flex-1 bg-white/[0.06]" />
          </h2>
          <p className="text-slate-400 leading-relaxed">
            兩項把蝦皮賣家最花時間的事交給 AI 與 n8n 的服務——前端的「上架建檔」與後端的「訂單對帳」，
            範圍固定、做到能跑、附操作教學。需要更進階的客製，歡迎直接聊聊。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <div
          className="relative rounded-2xl border border-white/[0.08] p-8 text-center mt-8 overflow-hidden"
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
