import Link from 'next/link'
import PostCard from '@/components/blog/PostCard'
import type { Post } from '@/types/content'

export default function FeaturedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-text-primary)]">
          最新文章
        </h2>
        <Link
          href="/blog"
          className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
        >
          查看全部 →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
