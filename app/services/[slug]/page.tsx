import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllServices, getServiceBySlug } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import Tag from '@/components/shared/Tag'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

const BASE_URL = 'https://aiqkangber.com'

export async function generateStaticParams() {
  const services = await getAllServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `${BASE_URL}/services/${slug}` },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const faqJsonLd = service.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Person',
      name: 'Q kangber',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TWD',
      price: service.price,
    },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <Breadcrumbs crumbs={[
        { label: '首頁', href: '/' },
        { label: '服務', href: '/services' },
        { label: service.title },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{service.icon}</span>
            <span className="text-[0.7rem] tracking-[0.18em] uppercase font-semibold" style={{ color: '#a78bfa' }}>
              {service.category}
            </span>
          </div>

          <h1 className="text-4xl sm:text-[2.6rem] font-semibold text-white leading-tight mb-4 tracking-[-0.02em]">
            {service.title}
          </h1>

          <p className="text-[1.05rem] text-slate-400 leading-relaxed mb-6">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-10">
            {service.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          <div className="prose prose-invert max-w-none prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline">
            <MDXRemote source={service.content} components={mdxComponents} />
          </div>

          {service.faq?.length && (
            <div className="mt-14">
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
                <span>常見問題</span>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </h2>
              <div className="space-y-3">
                {service.faq.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
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
              <p className="mt-6 text-sm text-slate-500">
                還有其他問題？查看{' '}
                <Link href="/faq" className="text-violet-400 hover:text-violet-300 transition-colors">完整 FAQ</Link>
                {' '}或直接{' '}
                <a href="mailto:asdtodd42@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors">聯絡我</a>。
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div
            className="sticky top-20 rounded-xl p-6"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="mb-5">
              <p className="text-xs text-slate-500 mb-1">服務費用</p>
              <p className="text-3xl font-semibold text-white">
                NT$ {service.price.toLocaleString()}
                {service.priceNote && (
                  <span className="text-lg font-normal text-slate-500 ml-1">{service.priceNote}</span>
                )}
              </p>
            </div>

            <a
              href="mailto:asdtodd42@gmail.com"
              className="block w-full text-center text-white font-medium text-sm py-3 rounded-full transition-all hover:scale-[1.02] active:scale-100 mb-3"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
                boxShadow: '0 0 20px rgba(99,102,241,0.3)',
              }}
            >
              立即諮詢
            </a>

            <p className="text-xs text-center text-slate-500">
              初次諮詢免費 · 評估後再報價
            </p>

            <div className="border-t border-white/[0.06] my-5" />

            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                流程設計與需求確認
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                {service.serviceType === 'ai' ? 'AI 應用建置與測試' : 'N8N 工作流程全套建置'}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                API 串接與測試
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                操作教學文件
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
                上線後 2 週免費調整
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
