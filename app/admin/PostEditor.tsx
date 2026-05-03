'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PostWithContent } from '@/types/content'

type FormState = {
  title: string
  date: string
  tags: string
  excerpt: string
  featured: boolean
  content: string
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 rounded-lg text-sm text-white bg-white/[0.04] border border-white/[0.08] outline-none focus:border-violet-500/50 transition-colors'

export default function PostEditor({ post }: { post: PostWithContent }) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    title: post.title,
    date: post.date,
    tags: post.tags.join(', '),
    excerpt: post.excerpt,
    featured: post.featured ?? false,
    content: post.content,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const res = await fetch(`/api/admin/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          date: form.date,
          tags,
          excerpt: form.excerpt,
          featured: form.featured,
          content: form.content,
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? '儲存失敗')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('網路錯誤')
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-semibold text-white tracking-tight">編輯文章</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← 返回
        </button>
      </div>

      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-sm text-red-400"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          {error}
        </div>
      )}

      <div className="space-y-5">
        <Field label="標題">
          <input value={form.title} onChange={(e) => update('title', e.target.value)} className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="日期">
            <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className={inputCls} />
          </Field>
          <Field label="標籤（逗號分隔）">
            <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className={inputCls} />
          </Field>
        </div>

        <Field label="摘要">
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            className={`${inputCls} resize-y`}
          />
        </Field>

        <Field label="文章內容（Markdown / HTML）">
          <textarea
            rows={22}
            value={form.content}
            onChange={(e) => update('content', e.target.value)}
            className={`${inputCls} font-mono resize-y`}
          />
        </Field>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => update('featured', e.target.checked)}
            className="w-4 h-4 accent-violet-500"
          />
          <label htmlFor="featured" className="text-sm text-slate-400 cursor-pointer">
            置頂（Featured）
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-100"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 20px rgba(99,102,241,0.3)',
          }}
        >
          {saving ? '儲存中…' : '儲存並推送'}
        </button>
      </div>
    </div>
  )
}
