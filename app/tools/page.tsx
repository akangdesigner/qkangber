import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Q kangber 工具站 — 免費 AI 工具，不用註冊直接用',
  description: '提供寵物溝通師等免費 AI 小工具——有趣又好玩，不需要註冊，開啟就能用。',
  keywords: ['免費 AI 工具', '寵物溝通', 'AI 小工具', '線上 AI 工具'],
  alternates: { canonical: 'https://aiqkangber.com/tools' },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '免費 AI 工具站',
    description: '電商與行銷人的免費 AI 工具。寵物溝通師，不需要註冊，直接用。',
    url: 'https://aiqkangber.com/tools',
    publisher: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
    },
    hasPart: [
      {
        '@type': 'SoftwareApplication',
        name: '寵物溝通師',
        url: 'https://aiqkangber.com/tools/pet-talk',
        applicationCategory: 'EntertainmentApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://aiqkangber.com' },
      { '@type': 'ListItem', position: 2, name: '工具站', item: 'https://aiqkangber.com/tools' },
    ],
  },
]

const tools = [
  {
    href: '/tools/pet-talk',
    title: '寵物溝通師',
    desc: '上傳毛孩照片，AI 化身量子靈魂感應師，用極度嚴肅的偽科學（量子糾纏、超心理學）替你解讀牠的心聲。',
    tags: ['搞笑', '寵物', '偽科學'],
    icon: '🔬',
  },
]

export default function ToolsPage() {
  return (
    <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(124,92,255,0.10), transparent 60%)' }}
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
        <span
          className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
          style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Free AI Tools
        </span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] mb-3">
        工具站
      </h1>
      <p className="text-slate-400 mb-14">電商與行銷人的免費 AI 工具。不需要註冊，直接用。</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map(({ href, title, desc, tags, icon }) => (
          <Link
            key={href}
            href={href}
            className="mtc group rounded-2xl p-6 transition-all duration-200 hover:scale-[1.01]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="text-2xl mb-4">{icon}</div>
            <h2 className="text-white font-semibold mb-2 group-hover:text-violet-300 transition-colors">
              {title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.7rem] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.15)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 text-sm text-violet-400 group-hover:text-violet-300 transition-colors">
              立即使用 →
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
