import ContactForm from '@/components/contact/ContactForm'
import ConstellationBg from '@/components/contact/ConstellationBg'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '聯絡 Q kangber — n8n 自動化與 AI 開發需求諮詢',
  description: '有 n8n 工作流、AI Agent 開發或自動化需求？填表告訴我，初次諮詢免費，評估後再報價。',
  alternates: { canonical: 'https://aiqkangber.com/contact' },
}

const METHODS = [
  {
    label: '連絡電話', value: '02-2745-7601', sub: '週一至週五 · 10:00–19:00',
    color: '#60a5fa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A14 14 0 0 1 4 7a2 2 0 0 1 2-3" />
      </svg>
    ),
  },
  {
    label: '聯絡信箱', value: 'asdtodd42@gmail.com', sub: '一律回信 · 通常 24 小時內',
    color: '#a78bfa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    label: 'Line 客服', value: '@qkangber', sub: '掃描 QR 或直接加入好友',
    color: '#34d399',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="4" />
        <path d="M8 18l-1 3 4-3" />
        <path d="M7 10v3M7 10h2M10 10v3M14 10v3l3-3M14 13h3" />
      </svg>
    ),
  },
  {
    label: '社群粉絲團', value: 'facebook.com/qkangber', sub: '日常更新 · 不定期直播',
    color: '#f0abfc',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
]

export default function ContactPage() {
  return (
    <div style={{ color: '#e2e8f0' }}>
      <style>{`
        @keyframes pinPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: 260,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
      }} className="sm:min-h-[300px] lg:min-h-[320px]">
        {/* Backdrop glow */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.22), transparent 65%), radial-gradient(ellipse 50% 40% at 85% 30%, rgba(34,211,238,0.10), transparent 60%)',
        }} />
        {/* Dot grid */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.32,
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 90%)',
        }} />
        {/* Constellation */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <ConstellationBg />
        </div>

        {/* Corner index marks */}
        <div aria-hidden style={{
          position: 'absolute', top: 24, left: 24,
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10, letterSpacing: '0.22em',
          color: 'rgba(148,163,184,0.7)',
          textTransform: 'uppercase',
        }}>§ 05 / CONTACT</div>
        <div aria-hidden style={{
          position: 'absolute', top: 24, right: 24,
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10, letterSpacing: '0.22em',
          color: 'rgba(148,163,184,0.7)',
          textTransform: 'uppercase',
        }}>2026 · TAIPEI</div>

        {/* Title block */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span aria-hidden style={{
              width: 56, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.55))',
            }} className="sm:w-[72px]" />
            <h1 style={{
              margin: 0,
              fontFamily: 'var(--font-noto), sans-serif',
              lineHeight: 1, fontWeight: 500,
              letterSpacing: '0.28em',
              paddingLeft: '0.28em',
              color: '#fff',
              textShadow: '0 2px 30px rgba(2,3,10,0.6)',
            }} className="text-4xl sm:text-5xl lg:text-[72px]">
              聯絡我們
            </h1>
            <span aria-hidden style={{
              width: 56, height: 1,
              background: 'linear-gradient(90deg, rgba(167,139,250,0.55), transparent)',
            }} className="sm:w-[72px]" />
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginTop: 20,
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11, letterSpacing: '0.28em',
            color: 'rgba(196,181,253,0.85)',
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 10px rgba(52,211,153,0.9)',
              flexShrink: 0,
            }} />
            <span>Get in touch</span>
            <span style={{ color: 'rgba(148,163,184,0.5)' }}>/</span>
            <span style={{ color: 'rgba(148,163,184,0.85)' }}>合作・諮詢・專案</span>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }} className="px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.1fr] gap-8 lg:gap-10 items-start">

          {/* LEFT — info + map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p style={{
              margin: 0, fontSize: 14, lineHeight: 1.85, color: '#cbd5e1',
            }}>
              對 N8N 工作流、AI Agent、RAG 或提示詞架構有任何想法、合作需求或專案邀約，歡迎透過下方表單或任何管道直接聯繫。我們會在 1–2 個工作天內回覆。
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {METHODS.map(m => (
                <div key={m.label} style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr',
                  gap: 14, alignItems: 'start',
                }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 40, height: 40, borderRadius: 10,
                    background: `${m.color}1c`,
                    boxShadow: `inset 0 0 0 1px ${m.color}44, 0 0 14px ${m.color}33`,
                    marginTop: 2, color: m.color, flexShrink: 0,
                  }}>
                    {m.icon}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: 'rgba(148,163,184,0.85)', marginBottom: 4,
                    }}>{m.label}</div>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '0.01em',
                    }}>{m.value}</div>
                    <div style={{
                      fontSize: 12, color: 'rgba(148,163,184,0.75)', marginTop: 3,
                    }}>{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{
              position: 'relative',
              height: 200,
              borderRadius: 14,
              overflow: 'hidden',
              background: 'rgba(2,3,10,0.55)',
              boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.22), 0 18px 40px -22px rgba(124,92,255,0.45)',
            }} className="h-40 sm:h-48 lg:h-[200px]">
              {/* Grid lines */}
              <div aria-hidden style={{
                position: 'absolute', inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(167,139,250,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.10) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              {/* Abstract road paths */}
              <svg aria-hidden viewBox="0 0 400 220" preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <path d="M -20 60 C 80 90, 160 30, 240 80 S 380 140, 460 100"
                  stroke="rgba(96,165,250,0.32)" strokeWidth="1.4" fill="none" />
                <path d="M -20 150 C 70 110, 180 200, 280 150 S 360 100, 460 130"
                  stroke="rgba(167,139,250,0.32)" strokeWidth="1.2" fill="none" />
                <path d="M 60 -20 C 100 60, 50 140, 110 220"
                  stroke="rgba(34,211,238,0.22)" strokeWidth="1" fill="none" />
                <path d="M 320 -20 C 280 80, 340 160, 300 240"
                  stroke="rgba(240,171,252,0.20)" strokeWidth="1" fill="none" />
              </svg>
              {/* Pin */}
              <div style={{
                position: 'absolute', left: '50%', top: '52%',
                transform: 'translate(-50%, -100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{
                  position: 'relative',
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'radial-gradient(circle, #c4b5fd 0%, #8b5cf6 70%)',
                  boxShadow: '0 0 18px rgba(167,139,250,0.9), 0 0 38px rgba(124,92,255,0.6)',
                }}>
                  <span style={{
                    position: 'absolute', inset: -8, borderRadius: '50%',
                    border: '1px solid rgba(167,139,250,0.5)',
                    animation: 'pinPulse 2s ease-out infinite',
                  }} />
                </div>
                <span style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 10, letterSpacing: '0.18em', color: '#c4b5fd',
                  padding: '4px 10px', borderRadius: 999,
                  background: 'rgba(2,3,10,0.7)',
                  boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.4)',
                  whiteSpace: 'nowrap',
                }}>25.04°N · 121.57°E</span>
              </div>
              {/* Address label */}
              <div style={{
                position: 'absolute', left: 14, bottom: 12, right: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{
                  fontSize: 12, color: '#e2e8f0',
                  padding: '7px 12px', borderRadius: 8,
                  background: 'rgba(2,3,10,0.7)',
                  boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.3)',
                }}>台北市信義區東興路 49 號 11 樓</div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 10, letterSpacing: '0.18em', color: 'rgba(148,163,184,0.85)',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>MAP · TAIPEI</div>
              </div>
            </div>
          </div>

          {/* RIGHT — form (glass card inside) */}
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
