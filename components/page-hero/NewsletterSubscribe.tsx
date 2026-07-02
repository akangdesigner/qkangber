'use client'

// Subscribe form for the 歷期電子報 hero — visual per the Claude Design
// "Newsletter Split + Astronaut" handoff (blue accent, inset borders,
// violet→blue gradient button), wired to the real /api/subscribe flow.
import { useState } from 'react'

const ACCENT = '#60a5fa'
const SANS = 'var(--font-noto), "Noto Sans TC", sans-serif'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [focused, setFocused] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
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
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : '訂閱失敗，請稍後再試')
    }
  }

  if (status === 'success') {
    return (
      <p style={{ margin: '4px 0 0', fontFamily: SANS, fontSize: 14.5, color: '#cbd5e1', maxWidth: 480 }}>
        <span style={{ color: ACCENT, fontWeight: 600 }}>✓ 收到了！</span> 請到收件匣點開確認信，下週一見 ✨
      </p>
    )
  }

  const loading = status === 'loading'

  return (
    <div style={{ marginTop: 4 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 480 }}>
        <div style={{ flex: '1 1 200px' }}>
          <input
            type="email"
            required
            placeholder="輸入你的 Email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading}
            style={{
              width: '100%', fontFamily: SANS,
              background: 'rgba(2,3,10,0.6)',
              border: 'none',
              boxShadow: focused
                ? `inset 0 0 0 1px ${ACCENT}, 0 0 0 4px ${ACCENT}26`
                : 'inset 0 0 0 1px rgba(255,255,255,0.12)',
              borderRadius: 12, padding: '14px 16px', fontSize: 14,
              color: '#fff', outline: 'none',
              transition: 'box-shadow 200ms',
            }}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn--ink">
          {loading ? (
            <span className="btn__label">訂閱中…</span>
          ) : (
            <>
              <span className="btn__dot" />
              <span className="btn__label">立即訂閱</span>
              <span className="btn__arrow">→</span>
            </>
          )}
        </button>
      </form>
      {status === 'error' && errorMsg && (
        <p style={{ margin: '8px 0 0', fontFamily: SANS, fontSize: 13, color: '#f87171' }}>{errorMsg}</p>
      )}
    </div>
  )
}
