'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { NewsletterIssue } from '@/lib/newsletter'

export default function NewsletterList({ issues }: { issues: NewsletterIssue[] }) {
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
    const res = await fetch(`/api/admin/newsletter/${slug}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      const json = await res.json()
      alert(json.error ?? '刪除失敗')
    }
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-white">電子報管理</h2>
        <Link
          href="/admin/newsletter/new"
          className="text-xs px-4 py-2 rounded-lg text-white transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          + 新增電子報
        </Link>
      </div>

      {issues.length === 0 && (
        <p className="text-slate-500 text-sm">目前沒有 MDX 電子報。點右上角新增第一期。</p>
      )}

      <div className="space-y-3">
        {issues.map((issue) => (
          <div
            key={issue.slug}
            className="flex items-center justify-between gap-4 rounded-xl px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{issue.subject}</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {issue.date} · {issue.slug}
                {!issue.published && (
                  <span className="ml-2 text-amber-500">草稿</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/admin/newsletter/edit/${issue.slug}`}
                className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                編輯
              </Link>
              <button
                onClick={() => handleDelete(issue.slug)}
                disabled={deleting === issue.slug}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                style={{
                  background: confirm === issue.slug ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                  color: confirm === issue.slug ? '#f87171' : '#94a3b8',
                  border: `1px solid ${confirm === issue.slug ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {deleting === issue.slug ? '刪除中…' : confirm === issue.slug ? '確認刪除？' : '刪除'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
