import Image from 'next/image'
import ContactForm from '@/components/contact/ContactForm'
import ConstellationBg from '@/components/contact/ConstellationBg'
import type { Metadata } from 'next'

type Method = {
  label: string; value: string; sub: string; href: string; color: string
  icon: React.ReactNode; qr?: string
}

export const metadata: Metadata = {
  title: '聯絡 Q kangber — n8n 自動化與 AI 開發需求諮詢',
  description: '有 n8n 工作流、AI Agent 開發或自動化需求？填表告訴我，初次諮詢免費，評估後再報價。',
  alternates: { canonical: 'https://aiqkangber.com/contact' },
}

const METHODS: Method[] = [
  {
    label: 'Line', value: 'skdxrytrmoon', sub: '掃描 QR 或直接加入好友',
    href: 'https://line.me/ti/p/~skdxrytrmoon', color: '#34d399',
    qr: '/contact/line-qr.png',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="4" />
        <path d="M8 18l-1 3 4-3" />
        <path d="M7 10v3M7 10h2M10 10v3M14 10v3l3-3M14 13h3" />
      </svg>
    ),
  },
  {
    label: '聯絡信箱', value: 'asdtodd42@gmail.com', sub: '一律回信 · 通常 24 小時內',
    href: 'mailto:asdtodd42@gmail.com', color: '#a78bfa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    label: 'Instagram', value: '@q_kangber', sub: '日常分享 · 私訊也可諮詢',
    href: 'https://www.instagram.com/q_kangber', color: '#f0abfc',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Threads', value: 'threads.com/@q_kangber', sub: '日常更新 · 不定期分享',
    href: 'https://www.threads.com/@q_kangber', color: '#60a5fa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.36-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 1.55 0c.029-.612-.124-1.085-.452-1.41-.34-.337-.86-.51-1.546-.51-.685 0-1.273.21-1.748.624-.36.314-.62.745-.77 1.282l-1.99-.544c.252-.92.71-1.69 1.36-2.288.79-.728 1.86-1.118 3.097-1.13 1.288-.012 2.36.41 3.103 1.222.685.748 1.05 1.79 1.085 3.098.058.041.116.083.173.126 1.27.747 2.198 1.85 2.685 3.19.68 1.87.743 4.92-1.738 7.353-1.89 1.854-4.18 2.69-7.43 2.715Zm-1.95-9.367c-.093 0-.187.002-.281.007-1.131.064-2.397.586-2.33 1.823.035.642.355 1.193.873 1.53.434.281.99.418 1.57.385.94-.05 1.683-.397 2.207-1.03.46-.557.749-1.337.86-2.319a6.4 6.4 0 0 0-1.299-.121l-1.6-.275Z" />
      </svg>
    ),
  },
]

const ADDRESS = '台北市信義區東興路 49 號 11 樓'
const MAP_SRC = `https://maps.google.com/maps?q=${encodeURIComponent('台北市信義區東興路49號11樓')}&t=&z=16&ie=UTF8&iwloc=&output=embed`

export default function ContactPage() {
  return (
    <div style={{ color: '#e2e8f0' }}>
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
        }}>CONTACT</div>
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
              {METHODS.map(m => {
                const isExternal = m.href.startsWith('http')
                return (
                <a
                  key={m.label}
                  href={m.href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: m.qr ? '40px auto auto' : '40px 1fr',
                    justifyContent: m.qr ? 'start' : undefined,
                    gap: 14, alignItems: m.qr ? 'center' : 'start',
                    textDecoration: 'none', color: 'inherit',
                  }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 40, height: 40, borderRadius: 10,
                    background: `${m.color}1c`,
                    boxShadow: `inset 0 0 0 1px ${m.color}44, 0 0 14px ${m.color}33`,
                    marginTop: m.qr ? 0 : 2, color: m.color, flexShrink: 0,
                  }}>
                    {m.icon}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: 'rgba(148,163,184,0.85)', marginBottom: 4,
                    }}>{m.label}</div>
                    <div className="group-hover:underline" style={{
                      fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '0.01em',
                      textUnderlineOffset: 3, textDecorationColor: m.color,
                    }}>{m.value}</div>
                    <div style={{
                      fontSize: 12, color: 'rgba(148,163,184,0.75)', marginTop: 3,
                    }}>{m.sub}</div>
                  </div>
                  {m.qr && (
                    <div style={{
                      flexShrink: 0, padding: 5, borderRadius: 8, background: '#fff',
                      boxShadow: `inset 0 0 0 1px ${m.color}55, 0 0 12px ${m.color}2e`,
                      lineHeight: 0,
                    }}>
                      <Image
                        src={m.qr}
                        alt={`加 ${m.label} 好友 QR code`}
                        width={60}
                        height={60}
                        style={{ display: 'block', width: 60, height: 60 }}
                      />
                    </div>
                  )}
                </a>
              )})}
            </div>

            {/* Map — embedded Google Maps */}
            <div style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              background: 'rgba(2,3,10,0.55)',
              boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.22), 0 18px 40px -22px rgba(124,92,255,0.45)',
            }} className="h-56 sm:h-64 lg:h-[260px]">
              <iframe
                title={`${ADDRESS} 地圖`}
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%', border: 0,
                  filter: 'grayscale(0.5) invert(0.9) hue-rotate(190deg) brightness(1.08) contrast(0.92)',
                }}
              />
              {/* Purple tint overlay to blend with theme (clicks pass through) */}
              <div aria-hidden style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(180deg, rgba(124,92,255,0.10), rgba(2,3,10,0.18))',
                mixBlendMode: 'overlay',
              }} />
              {/* Address label + open-in-maps link */}
              <div style={{
                position: 'absolute', left: 14, bottom: 12, right: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{
                  fontSize: 12, color: '#e2e8f0',
                  padding: '7px 12px', borderRadius: 8,
                  background: 'rgba(2,3,10,0.78)',
                  boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.3)',
                  backdropFilter: 'blur(4px)',
                }}>{ADDRESS}</div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('台北市信義區東興路49號11樓')}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: 10, letterSpacing: '0.16em', color: '#c4b5fd',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                    padding: '7px 11px', borderRadius: 8, textDecoration: 'none',
                    background: 'rgba(2,3,10,0.78)',
                    boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.4)',
                    backdropFilter: 'blur(4px)',
                  }}
                >開啟導航 ↗</a>
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
