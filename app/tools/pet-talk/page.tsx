'use client'

import { useState } from 'react'
import Link from 'next/link'

const SPECIES = ['貓', '狗', '兔子', '倉鼠', '鸚鵡', '烏龜', '其他']

export default function PetTalkPage() {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('貓')
  const [personality, setPersonality] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ answer: string; secret: string; mood: string } | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !question.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/tools/pet-talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, species, personality, question }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? '溝通失敗')
      setResult(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative max-w-2xl mx-auto px-6 py-20">
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(236,72,153,0.08), transparent 60%)' }}
      />

      <div className="mb-2">
        <Link href="/tools" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          ← 工具站
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4 mt-6">
        <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #ec4899)' }} />
        <span
          className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
          style={{ background: 'linear-gradient(90deg,#f9a8d4,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Pet Whisperer
        </span>
      </div>

      <h1 className="text-4xl font-semibold text-white tracking-[-0.02em] mb-2">
        寵物溝通師
      </h1>
      <p className="text-slate-400 mb-10">AI 化身靈魂溝通師，替你解讀毛孩的心聲。（結果僅供娛樂）</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">寵物名字</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：小虎"
              className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500/50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">種類</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-500/50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {SPECIES.map((s) => (
                <option key={s} value={s} style={{ background: '#0d0f1a' }}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">個性特徵 <span className="text-slate-600">（選填）</span></label>
          <textarea
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="例：超愛吃飯、很愛撒嬌、一看到玩具就抓狂"
            rows={2}
            className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-pink-500/50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">你想問牠什麼？</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例：你今天為什麼把水杯推下去？"
            rows={2}
            className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-pink-500/50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim() || !question.trim()}
          className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
        >
          {loading ? '靈魂連線中…' : '開始溝通 🐾'}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl px-4 py-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm text-slate-400">🐾 {name} 說</span>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: 'rgba(236,72,153,0.12)', color: '#f9a8d4', border: '1px solid rgba(236,72,153,0.2)' }}
              >
                {result.mood}
              </span>
            </div>
            <div className="px-5 py-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-slate-200 text-sm leading-[1.9] whitespace-pre-wrap">
                {result.answer}
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(192,132,252,0.15)' }}>
            <div className="px-5 py-3" style={{ background: 'rgba(192,132,252,0.05)', borderBottom: '1px solid rgba(192,132,252,0.1)' }}>
              <span className="text-sm" style={{ color: '#c084fc' }}>🤫 牠的內心話（偷偷告訴你）</span>
            </div>
            <div className="px-5 py-5" style={{ background: 'rgba(192,132,252,0.03)' }}>
              <p className="text-sm leading-[1.9] whitespace-pre-wrap" style={{ color: '#e9d5ff' }}>
                {result.secret}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm text-slate-500">
          想把寵物相關業務自動化？{' '}
          <Link href="/services" className="text-violet-400 hover:text-violet-300 transition-colors">
            了解 Q kangber 的自動化服務 →
          </Link>
        </p>
      </div>
    </main>
  )
}
