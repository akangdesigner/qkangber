import Link from 'next/link'
import type { Post } from '@/types/content'

type NavPost = Pick<Post, 'slug' | 'title' | 'category'>

type Props = {
  prev: NavPost | null
  next: NavPost | null
}

export default function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 mb-2 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-10">
      <div>
        {prev && (
          <Link
            href={`/blog/${prev.slug}`}
            className="group flex flex-col gap-1.5 p-4 rounded-xl border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.02] transition-all duration-200"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-slate-500 group-hover:text-violet-400 transition-colors">
              ← 上一篇
            </span>
            {prev.category && (
              <span className="text-[9px] tracking-[0.15em] uppercase text-violet-400/60">
                {prev.category}
              </span>
            )}
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
              {prev.title}
            </span>
          </Link>
        )}
      </div>

      <div className="flex justify-end">
        {next && (
          <Link
            href={`/blog/${next.slug}`}
            className="group flex flex-col gap-1.5 p-4 rounded-xl border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.02] transition-all duration-200 text-right w-full"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-slate-500 group-hover:text-violet-400 transition-colors">
              下一篇 →
            </span>
            {next.category && (
              <span className="text-[9px] tracking-[0.15em] uppercase text-violet-400/60">
                {next.category}
              </span>
            )}
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
