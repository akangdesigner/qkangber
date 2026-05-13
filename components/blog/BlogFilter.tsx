'use client'

import { useState } from 'react'
import PostCard from './PostCard'
import type { Post } from '@/types/content'

type Props = {
  posts: Post[]
  categories: string[]
}

function tabClass(isActive: boolean) {
  return [
    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-white/[0.08] text-white border border-white/10'
      : 'text-slate-400 hover:text-white border border-transparent hover:border-white/[0.06]',
  ].join(' ')
}

export default function BlogFilter({ posts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts

  return (
    <div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => setActiveCategory(null)} className={tabClass(activeCategory === null)}>
            全部
            <span className="ml-1.5 opacity-50 text-xs">({posts.length})</span>
          </button>
          {categories.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={tabClass(activeCategory === cat)}>
                {cat}
                <span className="ml-1.5 opacity-50 text-xs">({count})</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-500">此分類暫無文章。</p>
      )}
    </div>
  )
}
