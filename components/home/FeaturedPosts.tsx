import Link from 'next/link'
import PostCard from '@/components/blog/PostCard'
import type { Post } from '@/types/content'

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-px flex-shrink-0 w-7"
        style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }}
      />
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

export default function FeaturedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="mb-3"><EyebrowLabel>Latest writing</EyebrowLabel></div>
          <h2 className="text-3xl font-semibold text-white tracking-[-0.015em]">最新文章</h2>
        </div>
        <Link
          href="/blog"
          className="text-sm text-slate-400 hover:text-white transition-colors duration-150 group"
        >
          查看全部{' '}
          <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
