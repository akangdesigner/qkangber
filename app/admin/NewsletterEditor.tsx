'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NewsletterIssue } from '@/lib/newsletter'

type Props = { issue?: NewsletterIssue }

type FormState = {
  slug: string
  date: string
  subject: string
  summary: string
  htmlBody: string
  published: boolean
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

export default function NewsletterEditor({ issue }: Props) {
  const router = useRouter()
  const isNew = !issue
  const [form, setForm] = useState<FormState>({
    slug: issue?.slug ?? '',
    date: issue?.date ?? new Date().toISOString().slice(0, 10),
    subject: issue?.subject ?? '',
    summary: issue?.summary ?? '',
    htmlBody: issue?.htmlBody ?? '',
    published: issue?.published ?? true,
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
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? '儲存失敗')
      } else {
        router.push('/admin/newsletter')
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
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          {isNew ? '新增電子報' : '編輯電子報'}
        </h1>
        <button
          onClick={() => router.push('/admin/newsletter')}
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
        <Field label="主旨（Subject）">
          <input
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="日期">
            <input
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
              className={inputCls}
            />
          </Field>
          {isNew && (
            <Field label="Slug（留空自動產生）">
              <input
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="2026-05-weekly-01"
                className={`${inputCls} placeholder:text-slate-600`}
              />
            </Field>
          )}
        </div>

        <Field label="摘要">
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => update('summary', e.target.value)}
            className={`${inputCls} resize-y`}
          />
        </Field>

        <Field label="HTML 內容">
          <textarea
            rows={22}
            value={form.htmlBody}
            onChange={(e) => update('htmlBody', e.target.value)}
            className={`${inputCls} font-mono resize-y`}
          />
        </Field>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => update('published', e.target.checked)}
            className="w-4 h-4 accent-violet-500"
          />
          <label htmlFor="published" className="text-sm text-slate-400 cursor-pointer">
            已發佈（Published）
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
