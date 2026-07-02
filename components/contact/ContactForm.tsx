'use client'

import { useId, useState } from 'react'

const BUDGET_OPTIONS = ['NT$5,000 以下', 'NT$5,000–10,000', 'NT$10,000–20,000', 'NT$20,000 以上', '還不確定，想先免費診斷']
const TOPICS = ['訂單・出貨自動化', '每日報表自動化', '客服・LINE 自動回覆', '社群・貼文自動化', '潛客跟進自動化', '其他 / 還不確定']

type Status = 'idle' | 'loading' | 'success' | 'error'

const INPUT_BASE: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 10,
  background: 'rgba(2,3,10,0.55)',
  boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.18), inset 0 1px 0 rgba(255,255,255,0.03)',
  color: '#e2e8f0',
  fontSize: 13.5,
  fontFamily: 'inherit',
  outline: 'none',
  letterSpacing: '0.01em',
  border: '1px solid transparent',
  transition: 'box-shadow 150ms',
}

function Label({ text, required, htmlFor }: { text: string; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 12, fontWeight: 500,
      color: '#cbd5e1', marginBottom: 7, letterSpacing: '0.02em',
    }}>
      {text}
      {required && <span style={{ color: '#f0abfc', fontSize: 11 }}>*</span>}
    </label>
  )
}

function Field({ label, required, type = 'text', value, onChange, placeholder }: {
  label: string; required?: boolean; type?: string
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const id = useId()
  return (
    <div>
      <Label text={label} required={required} htmlFor={id} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ' '}
        required={required}
        style={{
          ...INPUT_BASE,
          boxShadow: focused
            ? 'inset 0 0 0 1px rgba(167,139,250,0.55), 0 0 0 3px rgba(124,92,255,0.08)'
            : INPUT_BASE.boxShadow,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}

export default function ContactForm() {
  const [brand, setBrand] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [budget, setBudget] = useState('')
  const [topics, setTopics] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const budgetId = useId()
  const messageId = useId()
  const [sysError, setSysError] = useState(false)
  const [msgFocused, setMsgFocused] = useState(false)

  function toggleTopic(t: string) {
    setTopics(prev => {
      const next = new Set(prev)
      if (next.has(t)) {
        next.delete(t)
      } else {
        next.add(t)
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    setSysError(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, name, email, website, budget, topics: [...topics], message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? '提交失敗，請稍後再試')
        setSysError(!!data.sysError)
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
        borderRadius: 18,
        background: 'radial-gradient(120% 180% at 50% 0%, rgba(124,92,255,0.10) 0%, rgba(2,3,10,0.55) 65%)',
        boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.18), inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -28px rgba(124,92,255,0.45)',
        backdropFilter: 'blur(10px)',
        padding: '52px 32px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', margin: '0 auto 18px',
          background: 'rgba(52,211,153,0.15)',
          boxShadow: 'inset 0 0 0 1px rgba(52,211,153,0.4), 0 0 24px rgba(52,211,153,0.3)',
          display: 'grid', placeItems: 'center', fontSize: 22,
        }}>✓</div>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 10, marginTop: 0 }}>
          已收到你的訊息！
        </h3>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
          通常 1–2 個工作天內回覆。<br />
          比較急可以直接來信：{' '}
          <a href="mailto:asdtodd42@gmail.com" style={{ color: '#a78bfa' }}>asdtodd42@gmail.com</a>
        </p>
      </div>
    )
  }

  return (
    <div style={{
      borderRadius: 18,
      background: 'radial-gradient(120% 180% at 50% 0%, rgba(124,92,255,0.10) 0%, rgba(2,3,10,0.55) 65%)',
      boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.18), inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -28px rgba(124,92,255,0.45)',
      backdropFilter: 'blur(10px)',
      padding: 28,
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 22, gap: 12,
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#c4b5fd', marginBottom: 10,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 10px rgba(52,211,153,0.9)',
              display: 'inline-block',
            }} />
            取得聯繫 · GET IN TOUCH
          </div>
          <h2 style={{
            margin: 0, fontSize: 22, fontWeight: 600,
            letterSpacing: '-0.01em', color: '#fff',
          }}>說說你的需求</h2>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.6, color: '#94a3b8' }}>
            免費診斷你的流程，評估可行性與做法後再報價——不必先付費，也不綁約。
          </p>
        </div>
        <div style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10, letterSpacing: '0.2em',
          color: 'rgba(148,163,184,0.7)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap', paddingTop: 4,
        }}>FORM · 06 FIELDS</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Field label="品牌 / 公司" required value={brand} onChange={setBrand} />
          <Field label="稱呼" required value={name} onChange={setName} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Field label="聯絡信箱" required type="email" value={email} onChange={setEmail} />
          <Field label="網站網址" type="url" value={website} onChange={setWebsite} />
        </div>

        {/* Budget select */}
        <div>
          <Label text="預算範圍" htmlFor={budgetId} />
          <div style={{ position: 'relative' }}>
            <select
              id={budgetId}
              value={budget}
              onChange={e => setBudget(e.target.value)}
              style={{ ...INPUT_BASE, appearance: 'none', paddingRight: 34, cursor: 'pointer' }}
            >
              <option value="">請選擇…</option>
              {BUDGET_OPTIONS.map(o => (
                <option key={o} value={o} style={{ background: '#05060a' }}>{o}</option>
              ))}
            </select>
            <span style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: '#a78bfa', pointerEvents: 'none', fontSize: 10,
            }}>▾</span>
          </div>
        </div>

        {/* Topic chips */}
        <div>
          <Label text="諮詢主題（可複選）" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TOPICS.map(t => {
              const on = topics.has(t)
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTopic(t)}
                  style={{
                    padding: '7px 14px', borderRadius: 999,
                    background: on
                      ? 'linear-gradient(135deg, rgba(124,92,255,0.35), rgba(96,165,250,0.25))'
                      : 'rgba(2,3,10,0.4)',
                    boxShadow: on
                      ? 'inset 0 0 0 1px rgba(167,139,250,0.55), 0 0 18px rgba(124,92,255,0.35)'
                      : 'inset 0 0 0 1px rgba(167,139,250,0.18)',
                    border: 'none',
                    color: on ? '#fff' : '#cbd5e1',
                    fontSize: 12, fontWeight: 500,
                    fontFamily: 'inherit', cursor: 'pointer',
                    letterSpacing: '0.02em',
                    transition: 'all 150ms',
                  }}
                >{t}</button>
              )
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <Label text="想聊聊的內容" required htmlFor={messageId} />
          <textarea
            id={messageId}
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="簡單描述你想自動化的流程、目前遇到的問題，或任何想聊的方向都可以。"
            style={{
              ...INPUT_BASE, resize: 'vertical', lineHeight: 1.6,
              boxShadow: msgFocused
                ? 'inset 0 0 0 1px rgba(167,139,250,0.55), 0 0 0 3px rgba(124,92,255,0.08)'
                : INPUT_BASE.boxShadow,
            }}
            onFocus={() => setMsgFocused(true)}
            onBlur={() => setMsgFocused(false)}
          />
        </div>

        {status === 'error' && (
          <p role="alert" style={{ fontSize: 13, color: '#f87171', margin: 0 }}>
            {errorMsg}
            {sysError && (
              <> · <a href="mailto:asdtodd42@gmail.com" style={{ color: '#f87171', textDecoration: 'underline' }}>asdtodd42@gmail.com</a></>
            )}
          </p>
        )}

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
          marginTop: 4,
        }}>
          <span style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 10, letterSpacing: '0.18em',
            color: 'rgba(148,163,184,0.6)',
            textTransform: 'uppercase',
          }}>RESPONSE · WITHIN 1–2 BUSINESS DAYS</span>
          <button type="submit" disabled={status === 'loading'} className="btn btn--ink">
            {status === 'loading' ? (
              <span className="btn__label">送出中…</span>
            ) : (
              <>
                <span className="btn__dot" />
                <span className="btn__label">送出訊息</span>
                <span aria-hidden className="btn__arrow">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
