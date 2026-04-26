'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function SubscribeForm({ className = '' }: { className?: string }) {
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
      <p className={`text-[var(--color-text-body)] ${className}`}>
        收到了！請記得確認你的收件匣 📬
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === 'loading' ? '訂閱中...' : '免費訂閱'}
      </button>
      {errorMsg && (
        <p className="text-sm text-red-600 mt-1 sm:col-span-2">{errorMsg}</p>
      )}
    </form>
  )
}
