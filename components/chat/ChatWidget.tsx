'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME = '嗨！我是黃小瓜瓜，Q kangber 的 AI 助理 👋\n有任何關於服務、技術或作品的問題，直接問我就好。'

// 前台安全網：模型偶爾仍會吐 Markdown，顯示前先清掉符號（對話框是純文字、不渲染 Markdown）
function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*([^*]+?)\*\*/g, '$1')
    .replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g, '$1$2')
    .replace(/`([^`]+?)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok || !res.body) throw new Error()

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let reply = ''

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        reply += decoder.decode(value, { stream: true })
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: reply },
        ])
      }

      if (!open) setUnread(true)
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '抱歉，暫時無法回應，請稍後再試。' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes chat-bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes chat-slide-up {
          from { opacity:0; transform:translateY(16px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes chat-dot {
          0%,80%,100% { opacity:0.2; transform:scale(0.8); }
          40%          { opacity:1;   transform:scale(1); }
        }
        .chat-msg-user {
          align-self: flex-end;
          background: linear-gradient(135deg,#3730a3,#6366f1);
          color:#fff;
          border-radius:14px 14px 4px 14px;
          padding:9px 13px;
          font-size:13px;
          line-height:1.55;
          max-width:82%;
          word-break:break-word;
        }
        .chat-msg-bot {
          align-self: flex-start;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(99,102,241,0.18);
          color:#e2e8f0;
          border-radius:4px 14px 14px 14px;
          padding:9px 13px;
          font-size:13px;
          line-height:1.55;
          max-width:88%;
          word-break:break-word;
          white-space:pre-wrap;
        }
      `}</style>

      {/* ── toggle button ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          right: 24,
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* name badge */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            background: 'rgba(8,9,18,0.92)',
            border: '1px solid rgba(99,102,241,0.3)',
            fontSize: 12,
            fontWeight: 500,
            color: '#c7d2fe',
            letterSpacing: '0.01em',
            boxShadow: '0 4px 16px rgba(99,102,241,0.15)',
            backdropFilter: 'blur(12px)',
            whiteSpace: 'nowrap',
          }}
        >
黃小瓜瓜 · Q kangber 智慧助理
        </div>

        <button
          onClick={() => { if (!open) setUnread(false); setOpen((v) => !v) }}
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            border: open
              ? '2px solid rgba(99,102,241,0.6)'
              : '2px solid rgba(99,102,241,0.35)',
            background: open
              ? 'linear-gradient(135deg,#1e1b4b,#312e81)'
              : 'rgba(13,14,26,0.92)',
            cursor: 'pointer',
            padding: 0,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: open
              ? '0 0 0 4px rgba(99,102,241,0.15),0 8px 32px rgba(99,102,241,0.35)'
              : '0 4px 20px rgba(99,102,241,0.25)',
            transition: 'all 220ms ease',
          }}
          aria-label="開啟 AI 助理"
        >
          <Image
            src="/cucumber-avatar.png"
            alt="Q kangber AI 助理"
            width={54}
            height={54}
            priority
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          {unread && !open && (
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #05060a',
                boxShadow: '0 0 6px #22c55e',
              }}
            />
          )}
        </button>
      </div>

      {/* ── chat window ── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            zIndex: 9997,
            width: 340,
            maxHeight: 500,
            borderRadius: 18,
            border: '1px solid rgba(99,102,241,0.3)',
            background: 'rgba(8,9,18,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow:
              '0 0 0 1px rgba(99,102,241,0.12),0 24px 60px rgba(0,0,0,0.7),0 4px 16px rgba(99,102,241,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chat-slide-up 220ms ease both',
          }}
        >
          {/* header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              borderBottom: '1px solid rgba(99,102,241,0.15)',
              background: 'rgba(99,102,241,0.06)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '1.5px solid rgba(99,102,241,0.4)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Image
                src="/cucumber-avatar.png"
                alt="Q kangber"
                width={34}
                height={34}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
黃小瓜瓜
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  color: '#4ade80',
                  fontFamily: 'var(--font-jetbrains),monospace',
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 5px #4ade80',
                    display: 'inline-block',
                  }}
                />
                線上中
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#475569',
                fontSize: 18,
                lineHeight: 1,
                padding: '2px 4px',
                borderRadius: 6,
                transition: 'color 150ms',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#94a3b8')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#475569')}
            >
              ×
            </button>
          </div>

          {/* messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(99,102,241,0.2) transparent',
            }}
          >
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}>
                {m.role === 'user' ? m.content : stripMarkdown(m.content)}
              </div>
            ))}

            {loading && (
              <div
                className="chat-msg-bot"
                style={{ display: 'flex', gap: 5, padding: '12px 14px', alignItems: 'center' }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#6366f1',
                      display: 'inline-block',
                      animation: `chat-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* input */}
          <div
            style={{
              padding: '10px 12px',
              borderTop: '1px solid rgba(99,102,241,0.12)',
              display: 'flex',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="輸入問題…"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: 13,
                color: '#e2e8f0',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 150ms',
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = 'rgba(99,102,241,0.5)')
              }
              onBlur={(e) =>
                (e.target.style.borderColor = 'rgba(99,102,241,0.2)')
              }
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: 'none',
                background:
                  input.trim() && !loading
                    ? 'linear-gradient(135deg,#4f46e5,#7c3aed)'
                    : 'rgba(255,255,255,0.04)',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                color: input.trim() && !loading ? '#fff' : '#475569',
                fontSize: 15,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                transition: 'all 150ms',
                boxShadow:
                  input.trim() && !loading
                    ? '0 0 12px rgba(99,102,241,0.4)'
                    : 'none',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}
