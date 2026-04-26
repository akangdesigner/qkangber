import Link from 'next/link'
import type { Post } from '@/types/content'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
  })
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="relative h-full flex flex-col bg-white border border-[#e7e5e4] rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_6px_28px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">

        {/* Top accent bar sweeps from left on hover */}
        <div className="h-[3px] w-full bg-[#ea580c] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

        <div className="flex flex-col flex-1 p-6 pt-5">

          {/* Tags — magazine category label style */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-[0.14em] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#ea580c]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="font-serif text-[1.2rem] font-semibold text-[#1c1917] leading-snug mb-3 group-hover:text-[#ea580c] transition-colors duration-200 flex-1">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-[#44403c] leading-relaxed line-clamp-2 mb-5">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-[11px] text-[#78716c] pt-4 border-t border-[#f5f4f3]">
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1.5">
              <span className="block w-3 h-px bg-[#d6d3d1]" />
              {post.readingTime}
            </span>
          </div>

        </div>
      </article>
    </Link>
  )
}
