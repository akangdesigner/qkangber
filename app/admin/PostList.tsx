'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Post } from '@/types/content'

// 唯讀清單：文章來源是 Google Sheets，編輯/刪除走 Sheets＋scripts，
// 舊的 GitHub MDX 後台編輯功能已下架（對 Sheets 資料源不生效）。
export default function PostList({ posts }: { posts: Post[] }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">文章總覽</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          登出
        </button>
      </div>

      <p className="text-slate-500 text-xs mb-6">
        文章維護走 Google Sheets posts 分頁＋scripts/publish-*.mjs，此頁僅供總覽。
      </p>

      {posts.length === 0 && (
        <p className="text-slate-500 text-sm">目前沒有文章。</p>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 hover:bg-white/5 transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{post.title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{post.date} · {post.slug}</p>
            </div>
            <span className="text-xs text-slate-500 flex-shrink-0">查看 →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
