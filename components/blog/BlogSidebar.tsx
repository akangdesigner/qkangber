import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types/content'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })
}

function MiniCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-3 items-start py-3 border-b border-white/[0.05] last:border-0 hover:opacity-80 transition-opacity"
    >
      {post.coverImage && (
        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-slate-200 group-hover:text-violet-300 transition-colors leading-snug line-clamp-2">
          {post.title}
        </span>
        <span className="text-[11px] text-slate-500">{formatDate(post.date)}</span>
      </div>
    </Link>
  )
}

type Props = {
  latest: Post[]
  popular: Post[]
}

export default function BlogSidebar({ latest, popular }: Props) {
  return (
    <aside className="flex flex-col gap-8">
      {popular.length > 0 && (
        <div>
          <h3 className="text-[10px] tracking-[0.24em] uppercase font-semibold text-violet-400 mb-4">
            熱門文章
          </h3>
          <div>
            {popular.map((post) => (
              <MiniCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}

      {latest.length > 0 && (
        <div>
          <h3 className="text-[10px] tracking-[0.24em] uppercase font-semibold text-slate-500 mb-4">
            最新文章
          </h3>
          <div>
            {latest.map((post) => (
              <MiniCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
