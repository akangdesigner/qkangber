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

function subTabClass(isActive: boolean) {
  return [
    'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
    isActive
      ? 'bg-violet-500/20 text-violet-200 border border-violet-500/30'
      : 'text-slate-500 hover:text-slate-200 border border-white/[0.06] hover:border-white/[0.12]',
  ].join(' ')
}

export default function BlogFilter({ posts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSub, setActiveSub] = useState<string | null>(null)

  function selectCategory(cat: string | null) {
    setActiveCategory(cat)
    setActiveSub(null) // 換主分類時重置副分類
  }

  // 目前主分類底下的副分類清單（依該分類文章彙整）
  const subCategories = activeCategory
    ? [...new Set(
        posts
          .filter((p) => p.category === activeCategory)
          .map((p) => p.subCategory)
          .filter((s): s is string => Boolean(s)),
      )]
    : []

  const filtered = posts.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false
    if (activeSub && p.subCategory !== activeSub) return false
    return true
  })

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-10 flex flex-col gap-3">
          {/* 主分類 */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => selectCategory(null)} className={tabClass(activeCategory === null)}>
              全部
              <span className="ml-1.5 opacity-50 text-xs">({posts.length})</span>
            </button>
            {categories.map((cat) => {
              const count = posts.filter((p) => p.category === cat).length
              return (
                <button key={cat} onClick={() => selectCategory(cat)} className={tabClass(activeCategory === cat)}>
                  {cat}
                  <span className="ml-1.5 opacity-50 text-xs">({count})</span>
                </button>
              )
            })}
          </div>

          {/* 副分類（選了主分類且有副分類時才出現） */}
          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-1">
              <button onClick={() => setActiveSub(null)} className={subTabClass(activeSub === null)}>
                全部{activeCategory}
              </button>
              {subCategories.map((sub) => {
                const count = posts.filter((p) => p.category === activeCategory && p.subCategory === sub).length
                return (
                  <button key={sub} onClick={() => setActiveSub(sub)} className={subTabClass(activeSub === sub)}>
                    {sub}
                    <span className="ml-1.5 opacity-50">({count})</span>
                  </button>
                )
              })}
            </div>
          )}
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
