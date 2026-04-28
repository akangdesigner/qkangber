import Link from 'next/link'
import type { Post } from '@/types/content'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group relative block h-full">
      {/* gradient border on hover */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.3) 50%, transparent)',
          filter: 'blur(0.5px)',
        }}
      />
      <article className="relative h-full flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden backdrop-blur-sm">
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-[0.16em] uppercase font-semibold px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-[1.15rem] font-semibold text-white leading-snug mb-3 group-hover:text-violet-200 transition-colors duration-200 flex-1">
            {post.title}
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-white/[0.06]">
            <span>{formatDate(post.date)}</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
