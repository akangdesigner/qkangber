'use client'

import { useState } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function SubscribeForm({ className = '', small = false, stacked = false }: { className?: string; small?: boolean; stacked?: boolean }) {
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

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${stacked ? '' : 'sm:flex-row'}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email"
          className={inputCls}
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`btn btn--ink${small ? ' btn--sm' : ''}`}
        >
          {status === 'loading' ? (
            <span className="btn__label">訂閱中…</span>
          ) : (
            <>
              <span className="btn__dot" />
              <span className="btn__label">免費訂閱</span>
              <span className="btn__arrow">→</span>
            </>
          )}
        </button>
      </form>
      {errorMsg && (
        <p role="alert" className="text-sm text-red-400 mt-1">{errorMsg}</p>
      )}
      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
        信箱只用來寄電子報，隨時可退訂 ·{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-300 transition-colors">
          隱私權政策
        </Link>
      </p>
    </div>
  )
}
