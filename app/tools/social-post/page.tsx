'use client'

import { useState } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/shared/Breadcrumbs'

const PLATFORMS = ['Threads', 'Instagram', 'Facebook']

export default function SocialPostPage() {
  const [html, setHtml] = useState('')
  const [platform, setPlatform] = useState('Threads')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ post_content: string; first_comment: string } | null>(null)
  const [error, setError] = useState('')
  const [copiedPost, setCopiedPost] = useState(false)
  const [copiedComment, setCopiedComment] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!html.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/tools/social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, platform }),
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

  async function handleCopy(text: string, type: 'post' | 'comment') {
    await navigator.clipboard.writeText(text)
    if (type === 'post') {
      setCopiedPost(true)
      setTimeout(() => setCopiedPost(false), 2000)
    } else {
      setCopiedComment(true)
      setTimeout(() => setCopiedComment(false), 2000)
    }
  }

  return (
    <main className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
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

      <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-2">
        社群貼文產生器
      </h1>
      <p className="text-slate-400 mb-10">貼上文章草稿，AI 幫你拆出主貼文＋第一則留言（含 hashtag）。</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-slate-400 mb-2">文章草稿（HTML 或純文字皆可）</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="貼入你的長篇文章草稿…"
            rows={10}
            className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-y focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">目標平台</label>
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

        <button
          type="submit"
          disabled={loading || !html.trim()}
          className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {loading ? '分析中…' : '產生貼文'}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl px-4 py-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          {/* 主貼文 */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm text-slate-400">主貼文</span>
              <button
                onClick={() => handleCopy(result.post_content, 'post')}
                className="text-xs px-3 py-1 rounded-full transition-colors"
                style={{
                  background: copiedPost ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                  color: copiedPost ? '#a78bfa' : '#94a3b8',
                  border: `1px solid ${copiedPost ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {copiedPost ? '已複製' : '複製'}
              </button>
            </div>
            <div className="px-5 py-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-slate-200 text-sm leading-[1.9] whitespace-pre-wrap">
                {result.post_content}
              </p>
            </div>
          </div>

          {/* 第一則留言 */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm text-slate-400">第一則留言</span>
              <button
                onClick={() => handleCopy(result.first_comment, 'comment')}
                className="text-xs px-3 py-1 rounded-full transition-colors"
                style={{
                  background: copiedComment ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                  color: copiedComment ? '#a78bfa' : '#94a3b8',
                  border: `1px solid ${copiedComment ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {copiedComment ? '已複製' : '複製'}
              </button>
            </div>
            <div className="px-5 py-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-slate-200 text-sm leading-[1.9] whitespace-pre-wrap">
                {result.first_comment}
              </p>
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
