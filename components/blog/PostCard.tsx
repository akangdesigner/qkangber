'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import type { Post } from '@/types/content'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })
}

export default function PostCard({ post }: { post: Post }) {
  const ref = useRef<HTMLAnchorElement>(null)

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height
    el.style.transform = `perspective(900px) rotateX(${(-dy * 5).toFixed(2)}deg) rotateY(${(dx * 5).toFixed(2)}deg) translate3d(${(dx * 4).toFixed(2)}px, ${(dy * 4).toFixed(2)}px, 0)`
  }
  function onLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translate3d(0,0,0)'
  }

  return (
    <Link
      ref={ref}
      href={`/blog/${post.slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="mtc group relative flex flex-col h-full rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.04] transition-colors duration-300 overflow-hidden backdrop-blur-sm"
      style={{ transition: 'transform 180ms ease-out, background-color 300ms', transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,92,255,0.16), rgba(96,165,250,0.08) 55%, rgba(13,14,26,0.55))' }}
          >
            <span className="text-[0.7rem] tracking-[0.3em] uppercase font-bold text-white/25">Q kangber</span>
          </div>
        )}
      </div>

      <div className="relative p-6 flex flex-col flex-1">
        {post.category && (
          <span className="flex items-center gap-2 mb-3 self-start">
            <span className="text-[9px] tracking-[0.22em] uppercase font-bold px-2.5 py-1 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {post.category}
            </span>
            {post.subCategory && (
              <span className="text-[9px] tracking-[0.18em] uppercase font-semibold text-slate-400">
                {post.subCategory}
              </span>
            )}
          </span>
        )}

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

        <h2 className="text-[1.15rem] font-semibold text-white leading-snug mb-3 line-clamp-2 min-h-[3.2rem] group-hover:text-violet-200 transition-colors duration-200">
          {post.title}
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 min-h-[2.8rem] mb-6">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-white/[0.06]">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  )
}
