import { getAllPosts } from '@/lib/mdx'
import BlogFilter from '@/components/blog/BlogFilter'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Q kangber 知識庫 — AI 趨勢、N8N 工作流與 Agent 整合實戰文章',
  description: '收錄 N8N 自動化、Vibe Coding、最新 AI 趨勢、AI 工具實測與 Agent 整合應用——想跟上 AI 時代，這裡都找得到。',
  keywords: ['N8N 教學', 'AI Agent 整合', 'AI 工具推薦', '自動化工作流'],
  alternates: { canonical: 'https://aiqkangber.com/blog' },
}

const PREFERRED_CATEGORY_ORDER = ['開發日記', '工具教學', '最新AI趨勢']

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI × N8N 知識庫',
    description: 'AI 與 N8N 自動化實戰知識庫。工作流架構、AI Agent 開發、電商行銷自動化——全都真實踩過才寫出來。',
    url: 'https://aiqkangber.com/blog',
    publisher: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
    },
    mainEntity: {
      '@type': 'Blog',
      name: 'Q kangber 知識庫',
      url: 'https://aiqkangber.com/blog',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://aiqkangber.com' },
      { '@type': 'ListItem', position: 2, name: 'AI × N8N 知識庫', item: 'https://aiqkangber.com/blog' },
    ],
  },
]

export default async function BlogPage() {
  const posts = await getAllPosts()

  const allCategories = posts.map((p) => p.category).filter((c): c is string => Boolean(c))
  const unique = [...new Set(allCategories)]
  const sortedCategories = [
    ...PREFERRED_CATEGORY_ORDER.filter((c) => unique.includes(c)),
    ...unique.filter((c) => !PREFERRED_CATEGORY_ORDER.includes(c)).sort(),
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-7 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
          <span className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold" style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Knowledge Base
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] mb-4">
          AI × N8N 知識庫
        </h1>
        <p className="text-slate-400">{posts.length} 篇文章 · 持續更新中</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">還沒有文章，敬請期待。</p>
      ) : (
        <BlogFilter posts={posts} categories={sortedCategories} />
      )}
    </div>
  )
}
