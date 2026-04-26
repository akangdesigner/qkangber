import { getAllPosts } from '@/lib/mdx'
import PostCard from '@/components/blog/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文章',
  description: 'AI 趨勢觀察、N8N 自動化實戰、以及在人與科技之間找到平衡的思考。',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-semibold text-[var(--color-text-primary)] mb-3">
          文章
        </h1>
        <p className="text-[var(--color-text-muted)]">
          {posts.length} 篇文章，持續更新中
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">還沒有文章，敬請期待。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
