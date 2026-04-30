'use client'

import Link from 'next/link'
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
      className="mtc group relative block h-full rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.04] transition-colors duration-300 overflow-hidden backdrop-blur-sm"
      style={{ transition: 'transform 180ms ease-out, background-color 300ms', transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <div className="relative p-6 flex flex-col h-full">
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
    </Link>
  )
}
