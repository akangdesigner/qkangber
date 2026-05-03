'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Post } from '@/types/content'

export default function PostList({ posts }: { posts: Post[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(slug: string) {
    if (confirm !== slug) {
      setConfirm(slug)
      return
    }
    setDeleting(slug)
    setConfirm(null)

    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      const json = await res.json()
      alert(json.error ?? '刪除失敗')
    }
    setDeleting(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-tight">文章管理</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          登出
        </button>
      </div>

      {posts.length === 0 && (
        <p className="text-slate-500 text-sm">目前沒有文章。</p>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="flex items-center justify-between gap-4 rounded-xl px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{post.title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{post.date} · {post.slug}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/admin/edit/${post.slug}`}
                className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                編輯
              </Link>
              <button
                onClick={() => handleDelete(post.slug)}
                disabled={deleting === post.slug}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                style={{
                  background: confirm === post.slug ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                  color: confirm === post.slug ? '#f87171' : '#94a3b8',
                  border: `1px solid ${confirm === post.slug ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {deleting === post.slug ? '刪除中…' : confirm === post.slug ? '確認刪除？' : '刪除'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
