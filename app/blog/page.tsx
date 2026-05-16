import { getAllPosts } from '@/lib/mdx'
import BlogFilter from '@/components/blog/BlogFilter'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'AI × N8N 知識庫',
  description: 'AI 與 N8N 自動化實戰知識庫。工作流架構、AI Agent 開發、電商行銷自動化——全都真實踩過才寫出來。',
  alternates: { canonical: 'https://aiqkangber.com/blog' },
}

const PREFERRED_CATEGORY_ORDER = ['開發日記', '工具教學', '最新AI趨勢']

export default async function BlogPage() {
  const posts = await getAllPosts()

  const allCategories = posts.map((p) => p.category).filter((c): c is string => Boolean(c))
  const unique = [...new Set(allCategories)]
  const sortedCategories = [
    ...PREFERRED_CATEGORY_ORDER.filter((c) => unique.includes(c)),
    ...unique.filter((c) => !PREFERRED_CATEGORY_ORDER.includes(c)).sort(),
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-7 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
          <span className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold" style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Knowledge Base
          </span>
        </div>
        <h1 className="text-5xl font-semibold text-white tracking-[-0.02em] mb-4">
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
