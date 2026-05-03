'use client'

import { useState } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/shared/Breadcrumbs'

const PLATFORMS = ['Threads', 'Instagram', 'Facebook']
const STYLES = [
  { value: 'casual', label: '輕鬆幽默型' },
  { value: 'professional', label: '專業資訊型' },
  { value: 'promo', label: '限時促銷型' },
  { value: 'story', label: '故事敘述型' },
]

export default function SocialPostPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('Threads')
  const [style, setStyle] = useState('casual')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ post_content: string; hashtags: string[] } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/tools/social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, style }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? '產生失敗')
      setResult(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    const text = `${result.post_content}\n\n${result.hashtags.join(' ')}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="relative max-w-2xl mx-auto px-6 py-20">
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(124,92,255,0.10), transparent 60%)' }}
      />

      <Breadcrumbs crumbs={[
        { label: '首頁', href: '/' },
        { label: '工具站', href: '/tools' },
        { label: '社群貼文產生器' },
      ]} />

      <div className="flex items-center gap-3 mb-4 mt-6">
        <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
        <span
          className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
          style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Free Tool
        </span>
      </div>

      <h1 className="text-4xl font-semibold text-white tracking-[-0.02em] mb-2">
        社群貼文產生器
      </h1>
      <p className="text-slate-400 mb-10">輸入主題，AI 幫你寫好貼文和標籤。免費使用。</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-slate-400 mb-2">貼文主題</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例：夏季新品上市，防曬面膜，主打長效保濕，目標客群是 25-35 歲女性"
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">平台</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p} style={{ background: '#0d0f1a' }}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">風格</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value} style={{ background: '#0d0f1a' }}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {loading ? '產生中…' : '產生貼文'}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl px-4 py-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-sm text-slate-400">貼文內容</span>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                background: copied ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                color: copied ? '#a78bfa' : '#94a3b8',
                border: `1px solid ${copied ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {copied ? '已複製' : '複製全部'}
            </button>
          </div>

          <div className="px-5 py-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-slate-200 text-sm leading-[1.9] whitespace-pre-wrap mb-5">
              {result.post_content}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm text-slate-500">
          想把社群貼文排程自動化？{' '}
          <Link href="/services" className="text-violet-400 hover:text-violet-300 transition-colors">
            了解 Q kangber 的社群自動化服務 →
          </Link>
        </p>
      </div>
    </main>
  )
}
