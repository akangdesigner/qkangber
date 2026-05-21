'use client'

import { useState } from 'react'

const SERVICE_OPTIONS = [
  { value: 'n8n', label: 'n8n 自動化工作流開發' },
  { value: 'ai-agent', label: 'AI Agent 應用開發' },
  { value: 'chatbot', label: '聊天機器人建置' },
  { value: 'prompt', label: '提示詞工程顧問' },
  { value: 'other', label: '其他需求' },
]

const BUDGET_OPTIONS = [
  { value: '5k-15k', label: 'NT$ 5,000 ~ 15,000' },
  { value: '15k-30k', label: 'NT$ 15,000 ~ 30,000' },
  { value: '30k+', label: 'NT$ 30,000 以上' },
  { value: 'unknown', label: '不確定，想先討論' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 10,
  padding: '11px 14px',
  color: '#f1f5f9',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 150ms',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: 6,
  letterSpacing: '0.04em',
}

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, budget, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? '提交失敗，請稍後再試')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('網路錯誤，請稍後再試')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 24px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
          已收到你的需求！
        </h3>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75 }}>
          我通常在 24 小時內回覆，<br />
          如果比較急可以直接寄信到{' '}
          <a href="mailto:asdtodd42@gmail.com" style={{ color: '#a78bfa' }}>asdtodd42@gmail.com</a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>姓名 <span style={{ color: '#f87171' }}>*</span></label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="你的名字"
            required
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Email <span style={{ color: '#f87171' }}>*</span></label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)' }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>感興趣的服務</label>
        <select
          value={service}
          onChange={e => setService(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)' }}
        >
          <option value="" style={{ background: '#0a0b14' }}>請選擇服務類型（可跳過）</option>
          {SERVICE_OPTIONS.map(o => (
            <option key={o.value} value={o.value} style={{ background: '#0a0b14' }}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>預算範圍</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {BUDGET_OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => setBudget(budget === o.value ? '' : o.value)}
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 150ms',
                background: budget === o.value
                  ? 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(139,92,246,0.3))'
                  : 'rgba(255,255,255,0.04)',
                border: budget === o.value
                  ? '1px solid rgba(167,139,250,0.5)'
                  : '1px solid rgba(255,255,255,0.09)',
                color: budget === o.value ? '#c4b5fd' : '#94a3b8',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>需求描述 <span style={{ color: '#f87171' }}>*</span></label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="簡單描述你想自動化的流程、目前遇到的問題，或任何想聊的方向都可以。"
          required
          rows={5}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)' }}
        />
      </div>

      {status === 'error' && (
        <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '13px 0',
          borderRadius: 999,
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
          boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          opacity: status === 'loading' ? 0.7 : 1,
          transition: 'opacity 150ms, transform 150ms',
          letterSpacing: '0.02em',
        }}
        onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.transform = 'scale(1.01)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {status === 'loading' ? '送出中…' : '送出需求'}
      </button>

      <p style={{ fontSize: 11, color: '#64748b', margin: 0, textAlign: 'center' }}>
        初次諮詢免費 · 評估後再報價 · 24 小時內回覆
      </p>
    </form>
  )
}
