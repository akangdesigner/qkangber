import PostCard from './PostCard'
import type { Post } from '@/types/content'

type Props = {
  posts: Post[]
  category?: string
}

// 同主題集群互鏈（spoke ↔ spoke）：強化主題權威、把站內權重留在集群內。
export default function RelatedPosts({ posts, category }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16 border-t border-white/[0.06] pt-12">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">同主題文章</h2>
        {category && (
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {category}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
