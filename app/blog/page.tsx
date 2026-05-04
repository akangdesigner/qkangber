import { getAllPosts } from '@/lib/mdx'
import PostCard from '@/components/blog/PostCard'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'n8n 自動化實戰文章',
  description: 'n8n 工作流實戰、AI Agent 架構、電商行銷自動化踩坑記錄。真實案例，不寫純理論。',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-7 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
          <span className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold" style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Writing archive
          </span>
        </div>
        <h1 className="text-5xl font-semibold text-white tracking-[-0.02em] mb-4">
          文章
        </h1>
        <p className="text-slate-400">{posts.length} 篇文章 · 持續更新中</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">還沒有文章，敬請期待。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
