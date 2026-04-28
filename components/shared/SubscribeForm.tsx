'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function SubscribeForm({ className = '', small = false }: { className?: string; small?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('請輸入有效的 Email 地址')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '訂閱失敗，請稍後再試')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : '訂閱失敗，請稍後再試')
    }
  }

  if (status === 'success') {
    return (
      <p className={`text-slate-300 text-sm ${className}`}>
        收到了！請記得確認你的收件匣 ✨
      </p>
    )
  }

  const inputCls = `flex-1 ${small ? 'px-3 py-2 text-[13px]' : 'px-4 py-3 text-sm'} rounded-full border border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/60 focus:bg-white/[0.07] transition-colors backdrop-blur-sm`
  const btnCls = `${small ? 'px-4 py-2 text-[13px]' : 'px-6 py-3 text-sm'} rounded-full font-medium text-white whitespace-nowrap transition-all disabled:opacity-60`

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={inputCls}
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={btnCls}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 0 24px rgba(124,92,255,0.35)',
        }}
      >
        {status === 'loading' ? '訂閱中…' : '免費訂閱 →'}
      </button>
      {errorMsg && (
        <p className="text-sm text-red-400 mt-1">{errorMsg}</p>
      )}
    </form>
  )
}
