import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllServices, getServiceBySlug } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import Tag from '@/components/shared/Tag'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

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
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors duration-150"
        >
          ← 所有服務
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{service.icon}</span>
            <span
              className="text-[0.7rem] tracking-[0.18em] uppercase font-semibold"
              style={{ color: '#a78bfa' }}
            >
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
                N8N 工作流程全套建置
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
