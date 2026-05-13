import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types/content'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
}

function MiniCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-3 items-start py-3 border-b border-white/[0.05] last:border-0 hover:opacity-80 transition-opacity"
    >
      {post.coverImage && (
        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="64px" />
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

function LatestCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] overflow-hidden transition-all duration-300 hover:border-orange-500/30"
    >
      {post.coverImage && (
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="272px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase font-bold text-orange-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-400" />
            </span>
            最新
          </span>
          {post.category && (
            <span className="text-[9px] tracking-[0.15em] uppercase text-slate-500">
              {post.category}
            </span>
          )}
        </div>
        <h4 className="text-sm font-semibold text-white group-hover:text-orange-200 transition-colors leading-snug line-clamp-2">
          {post.title}
        </h4>
        {post.excerpt && (
          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
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
      {latest.length > 0 && (
        <div>
          <LatestCard post={latest[0]} />
        </div>
      )}

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
    </aside>
  )
}
