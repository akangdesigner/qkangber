'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import ParticleGlobe from './ParticleGlobe'

function ChangelogPill({ title, slug }: { title: string; slug: string }) {
  return (
    <Link
      href={`/blog/${slug}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '6px 6px 6px 14px',
        borderRadius: 999,
        background: 'rgba(124,92,255,0.06)',
        border: '1px solid transparent',
        boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.10), inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 40px -12px rgba(124,92,255,0.4)',
        textDecoration: 'none',
        fontSize: 12, color: '#cbd5e1',
        marginBottom: 32,
        backdropFilter: 'blur(8px)',
        transition: 'background 200ms, box-shadow 200ms',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'rgba(124,92,255,0.12)'
        el.style.boxShadow = 'inset 0 0 0 1px rgba(167,139,250,0.32), inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 50px -10px rgba(124,92,255,0.6)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'rgba(124,92,255,0.06)'
        el.style.boxShadow = 'inset 0 0 0 1px rgba(167,139,250,0.10), inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 40px -12px rgba(124,92,255,0.4)'
      }}
    >
      <span style={{
        padding: '2px 8px', borderRadius: 999,
        background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
        color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>NEW</span>
      <span>{title}</span>
      <span style={{ color: '#a78bfa', marginRight: 12 }}>→</span>
    </Link>
  )
}

function HeroFocusStrip() {
  const words = ['N8N 工作流', 'AI Agent', 'RAG 檢索增強', 'Vibe Coding']
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % words.length), 2200)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontSize: 11, color: '#94a3b8',
      letterSpacing: '0.16em', textTransform: 'uppercase',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#34d399', boxShadow: '0 0 10px rgba(52,211,153,0.9)',
        }} />
        <span>NOW WORKING ON</span>
      </span>
      <span style={{ position: 'relative', overflow: 'hidden', height: 14, minWidth: 170, display: 'inline-block', verticalAlign: 'middle' }}>
        {words.map((w, i) => (
          <span
            key={w}
            style={{
              position: 'absolute', left: 0, top: 0,
              color: '#c4b5fd', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em',
              transform: i === idx ? 'translateY(0)' : (i < idx ? 'translateY(-100%)' : 'translateY(100%)'),
              opacity: i === idx ? 1 : 0,
              transition: 'transform 500ms cubic-bezier(.2,.7,.2,1), opacity 500ms',
            }}
          >{w}</span>
        ))}
      </span>
    </div>
  )
}

function PartnerMarquee() {
  const items = ['電商品牌', 'AI 學院', '行銷 SEO 公司', '物流團隊', '內容創作者', '線上課程平台', '新創團隊', '餐飲連鎖', '顧問工作室', '自媒體經營者']
  const all = [...items, ...items]
  return (
    <div style={{
      position: 'relative', marginTop: 60, overflow: 'hidden',
      maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
    }}>
      <div style={{
        display: 'flex', gap: 64, whiteSpace: 'nowrap',
        animation: 'marqueeScroll 38s linear infinite',
        width: 'max-content',
      }}>
        {all.map((n, i) => (
          <span key={i} style={{
            fontSize: 14, fontWeight: 500,
            color: 'rgba(255,255,255,0.32)', letterSpacing: '0.04em',
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 2,
              background: 'linear-gradient(135deg, #8b5cf6, #60a5fa)', opacity: 0.4,
            }} />
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

const SATS = [
  { idx: 0, label: 'Design',   sub: 'Figma',    x: 10, y: 20, color: '#a78bfa', slideKey: 'VIBE',   hue:  0  },
  { idx: 1, label: 'Code',     sub: 'Cursor',   x: 92, y: 22, color: '#60a5fa', slideKey: 'CLAUDE', hue: -18 },
  { idx: 2, label: 'n8n',      sub: 'Workflow', x: 92, y: 78, color: '#22d3ee', slideKey: 'N8N',    hue: -50 },
  { idx: 3, label: 'Database', sub: 'pgvector', x: 10, y: 78, color: '#f0abfc', slideKey: 'RAG',    hue:  40 },
]

function SatelliteChip({
  label, sub, x, y, delay, color, active, onHover, onLeave, onClick, index,
}: {
  label: string; sub: string; x: number; y: number; delay: number
  color: string; active: boolean
  onHover: (i: number) => void; onLeave: () => void; onClick: () => void; index: number
}) {
  return (
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        borderRadius: 999,
        // Borderless: dark veil sits behind the text (centre) and feathers out
        // to fully transparent at the edges, so the chip dissolves into the dark
        // space instead of reading as a bordered pill. Colour lives in the glow,
        // not in an inset ring.
        // No backdrop-filter: a backdrop blur gets clipped to the element's
        // rounded-rect box and renders a crisp pill outline at the blur edge —
        // the exact "card border" we're trying to kill. Legibility is carried by
        // the centred dark veil + text-shadow instead.
        background: active
          ? `radial-gradient(120% 165% at 50% 50%, rgba(3,4,12,0.62) 0%, rgba(3,4,12,0.22) 40%, ${color}10 62%, transparent 84%)`
          : `radial-gradient(115% 155% at 50% 50%, rgba(3,4,12,0.58) 0%, rgba(3,4,12,0.2) 44%, transparent 82%)`,
        border: 'none',
        boxShadow: active
          ? `0 18px 50px -22px ${color}aa, 0 0 64px -10px ${color}80`
          : `0 0 44px -14px ${color}4d`,
        opacity: 0,
        animation: `chipFloatIn 700ms ease-out ${delay}ms forwards, chipFloat 6s ease-in-out ${delay + 700}ms infinite`,
        zIndex: 3,
        cursor: 'pointer',
        transition: 'background 200ms, border-color 200ms, box-shadow 200ms',
      }}
    >
      <span style={{
        position: 'relative', display: 'inline-flex',
        width: 8, height: 8, borderRadius: '50%',
        background: color,
        boxShadow: active ? `0 0 12px ${color}` : 'none',
        transition: 'box-shadow 200ms',
      }}>
        <span style={{
          position: 'absolute', inset: -3, borderRadius: '50%',
          background: color, opacity: 0.4,
          animation: 'chipPulse 1.8s ease-out infinite',
        }} />
      </span>
      <span style={{
        fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '0.04em',
        textShadow: '0 1px 8px rgba(2,3,10,0.85)',
      }}>{label}</span>
      <span style={{
        fontFamily: 'ui-monospace, monospace',
        fontSize: 9,
        color: active ? color : 'rgba(148,163,184,0.75)',
        letterSpacing: '0.08em',
        textShadow: '0 1px 8px rgba(2,3,10,0.85)',
        transition: 'color 200ms',
      }}>{sub}</span>
    </div>
  )
}

const TICKER_ITEMS = [
  { tag: 'PLAN',  text: '讀取 Figma frame · 解析元件',          color: '#a78bfa' },
  { tag: 'CALL',  text: 'cursor.write → MemberCard.tsx',        color: '#60a5fa' },
  { tag: 'ROUTE', text: '觸發 n8n workflow · order-flow',       color: '#22d3ee' },
  { tag: 'QUERY', text: 'pgvector · top-k=4 · 0.91 cos',        color: '#f0abfc' },
  { tag: 'REPLY', text: '回應 · 3 steps · 1.2s',                color: '#34d399' },
]

function AgentStatusTicker() {
  const [idx, setIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'typing' | 'holding'>('typing')

  useEffect(() => {
    const full = TICKER_ITEMS[idx].text
    let cancelled = false
    let i = 0
    function step() {
      if (cancelled) return
      i++
      setTyped(full.slice(0, i))
      if (i < full.length) {
        setTimeout(step, 38)
      } else {
        setPhase('holding')
        setTimeout(() => {
          if (cancelled) return
          setIdx(p => (p + 1) % TICKER_ITEMS.length)
        }, 1700)
      }
    }
    const tStart = setTimeout(() => {
      if (cancelled) return
      setPhase('typing')
      setTyped('')
      setTimeout(step, 80)
    }, 0)
    return () => { cancelled = true; clearTimeout(tStart) }
  }, [idx])

  const cur = TICKER_ITEMS[idx]
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: '8px 14px', borderRadius: 999,
      background: `radial-gradient(120% 180% at 50% 50%, ${cur.color}1c 0%, rgba(2,3,10,0.55) 70%)`,
      border: '1px solid transparent',
      backdropFilter: 'blur(10px)',
      width: 'fit-content', margin: '0 auto', maxWidth: '92%',
      zIndex: 4,
      boxShadow: `inset 0 0 0 1px ${cur.color}22, inset 0 1px 0 rgba(255,255,255,0.04), 0 18px 50px -18px rgba(0,0,0,0.7), 0 0 50px -10px ${cur.color}40`,
      transition: 'background 400ms, box-shadow 400ms',
    }}>
      <span style={{
        fontFamily: 'ui-monospace, monospace',
        fontSize: 9, letterSpacing: '0.22em',
        color: cur.color, fontWeight: 600,
        padding: '2px 6px', borderRadius: 4,
        background: `${cur.color}1c`,
        transition: 'color 300ms, background 300ms',
      }}>{cur.tag}</span>
      <span style={{
        fontFamily: 'ui-monospace, monospace',
        fontSize: 11, color: '#e2e8f0',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        minWidth: 220, maxWidth: 320,
        display: 'inline-flex', alignItems: 'center',
      }}>
        {typed}
        <span style={{
          display: 'inline-block', width: 7, height: 13, marginLeft: 2,
          background: cur.color,
          animation: 'caretBlink 0.9s steps(1) infinite',
          opacity: phase === 'typing' ? 1 : 0.5,
          verticalAlign: 'baseline',
        }} />
      </span>
    </div>
  )
}

export default function Hero({ latestPost }: { latestPost?: { title: string; slug: string } }) {
  const [hoveredSat, setHoveredSat] = useState<number | null>(null)

  function jumpToSlide(key: string) {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).__jumpToSlide) {
      ;((window as unknown as Record<string, unknown>).__jumpToSlide as (k: string) => void)(key)
    }
    const el = document.getElementById('skills')
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 24
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const tintHue = hoveredSat !== null ? SATS[hoveredSat].hue : 0
  const tintSat = hoveredSat !== null ? 1.15 : 1

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      <style>{`
        @keyframes heroLineIn { to { opacity: 1; transform: translateY(0); } }
        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes chipFloatIn { from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); } to { opacity: 1; transform: translate(-50%, -50%); } }
        @keyframes chipFloat { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, calc(-50% - 4px)); } }
        @keyframes chipPulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes globeRingSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes caretBlink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      `}</style>

      {/* ambient spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.22), transparent 65%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(34,211,238,0.10), transparent 60%)',
        height: 900,
      }} />
      {/* dot grid — feathered on every edge (not just the bottom) so the
          background field has no hard top/side line that reads as a card edge */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.16) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.35,
        maskImage: 'radial-gradient(125% 105% at 50% 18%, #000 38%, transparent 92%)',
        WebkitMaskImage: 'radial-gradient(125% 105% at 50% 18%, #000 38%, transparent 92%)',
      }} />
      {/* edge feather — blend the top & right of the section into the page
          background (#05060a), the same trick the services banner uses so the
          hero dissolves into the page instead of sitting in a bounded card */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, #05060a 0%, rgba(5,6,10,0) 13%), linear-gradient(to right, rgba(5,6,10,0) 84%, #05060a 100%)',
      }} />

      <div className="relative max-w-6xl mx-auto px-6" style={{ paddingTop: 80, paddingBottom: 60 }}>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-center" style={{ minHeight: 560 }}>
          {/* Left — copy */}
          <div>
            {latestPost && (
              <div style={{ opacity: 0, transform: 'translateY(10px)', animation: 'heroLineIn 600ms ease-out 60ms forwards' }}>
                <ChangelogPill title={latestPost.title} slug={latestPost.slug} />
              </div>
            )}

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5.4vw, 4.4rem)',
              lineHeight: 1.08, fontWeight: 600,
              letterSpacing: '-0.03em', color: '#fff',
              margin: '0 0 24px 0',
            }}>
              <span style={{
                display: 'block',
                opacity: 0, transform: 'translateY(18px)',
                animation: 'heroLineIn 700ms cubic-bezier(.2,.7,.2,1) 180ms forwards',
              }}>
                把 AI 接進你的工作流程，
              </span>
              <span style={{
                display: 'block', fontStyle: 'italic',
                opacity: 0, transform: 'translateY(18px)',
                animation: 'heroLineIn 700ms cubic-bezier(.2,.7,.2,1) 360ms forwards',
                background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                讓自動化真正發生。
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
              lineHeight: 1.85, color: '#94a3b8', maxWidth: 480,
              margin: '0 0 36px 0',
              opacity: 0, animation: 'heroLineIn 700ms ease-out 540ms forwards',
            }}>
              專注於 N8N 工作流、AI Agent、RAG 與提示詞架構。把 LLM 從 demo 帶進你日常營運的 production 流程裡。
            </p>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28,
              opacity: 0, animation: 'heroLineIn 700ms ease-out 700ms forwards',
            }}>
              <Link
                href="/services"
                className="inline-flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #6366f1 50%, #8b5cf6)',
                  color: '#fff', borderRadius: 999,
                  padding: '13px 26px', fontSize: 14, fontWeight: 500,
                  textDecoration: 'none',
                  boxShadow: '0 10px 32px rgba(124,92,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'transform 200ms, box-shadow 200ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-1px)'
                  el.style.boxShadow = '0 14px 38px rgba(124,92,255,0.55), inset 0 1px 0 rgba(255,255,255,0.25)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 10px 32px rgba(124,92,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                免費訂閱電子報 →
              </Link>
              <Link
                href="/blog"
                style={{
                  background: 'radial-gradient(120% 180% at 50% 50%, rgba(167,139,250,0.12) 0%, rgba(2,3,10,0.3) 70%)',
                  color: '#e2e8f0', border: '1px solid transparent',
                  borderRadius: 999, padding: '13px 26px', fontSize: 14, fontWeight: 500,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                  backdropFilter: 'blur(8px)',
                  boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.18), inset 0 1px 0 rgba(255,255,255,0.04), 0 14px 40px -16px rgba(124,92,255,0.4)',
                  transition: 'background 200ms, box-shadow 200ms, color 200ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'radial-gradient(120% 180% at 50% 50%, rgba(167,139,250,0.22) 0%, rgba(2,3,10,0.3) 70%)'
                  el.style.boxShadow = 'inset 0 0 0 1px rgba(167,139,250,0.4), inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 50px -14px rgba(124,92,255,0.55)'
                  el.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'radial-gradient(120% 180% at 50% 50%, rgba(167,139,250,0.12) 0%, rgba(2,3,10,0.3) 70%)'
                  el.style.boxShadow = 'inset 0 0 0 1px rgba(167,139,250,0.18), inset 0 1px 0 rgba(255,255,255,0.04), 0 14px 40px -16px rgba(124,92,255,0.4)'
                  el.style.color = '#e2e8f0'
                }}
              >
                先看看文章
              </Link>
            </div>

            <div style={{ opacity: 0, animation: 'heroLineIn 700ms ease-out 820ms forwards' }}>
              <HeroFocusStrip />
            </div>
          </div>

          {/* Right — particle globe as integration hub */}
          <div className="relative lg:-mr-20" style={{
            height: 'clamp(420px, 52vw, 580px)',
            opacity: 0, animation: 'heroLineIn 1000ms ease-out 400ms forwards',
          }}>
            {/* Scanning rings */}
            <div aria-hidden style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '78%', aspectRatio: '1', borderRadius: '50%',
              border: '1px dashed rgba(167,139,250,0.18)',
              animation: 'globeRingSpin 28s linear infinite',
              pointerEvents: 'none',
            }} />
            <div aria-hidden style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '94%', aspectRatio: '1', borderRadius: '50%',
              border: '1px solid rgba(96,165,250,0.10)',
              pointerEvents: 'none',
            }} />

            {/* SVG connector lines + animated packets */}
            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                {SATS.map(s => (
                  <linearGradient key={`g-${s.idx}`} id={`hubLine-${s.idx}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={s.color} stopOpacity="0" />
                    <stop offset="0.5" stopColor={s.color} stopOpacity={hoveredSat === s.idx ? 1 : 0.55} />
                    <stop offset="1" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              {SATS.map(s => {
                const isHot = hoveredSat === s.idx
                const isDimmed = hoveredSat !== null && !isHot
                return (
                  <line key={`l-${s.idx}`}
                    x1={s.x} y1={s.y} x2="50" y2="50"
                    stroke={`url(#hubLine-${s.idx})`}
                    strokeWidth={isHot ? 0.7 : 0.3}
                    style={{
                      opacity: isDimmed ? 0.15 : 1,
                      transition: 'opacity 200ms, stroke-width 200ms',
                    }} />
                )
              })}
              {SATS.map((s, i) => {
                const dir = i % 2 === 0
                  ? [s, { x: 50, y: 50 }]
                  : [{ x: 50, y: 50 }, s]
                const isHot = hoveredSat === s.idx
                const isDimmed = hoveredSat !== null && !isHot
                return (
                  <circle key={`p-${s.idx}`} r={isHot ? 1.1 : 0.7} fill={s.color}
                    style={{ opacity: isDimmed ? 0.2 : 1, transition: 'opacity 200ms' }}>
                    <animateMotion dur="3.6s" begin={`${i * 0.8}s`} repeatCount="indefinite"
                      path={`M ${dir[0].x},${dir[0].y} L ${dir[1].x},${dir[1].y}`} />
                    <animate attributeName="opacity" values="0;1;1;0" dur="3.6s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
                  </circle>
                )
              })}
            </svg>

            {/* Globe with hover-driven hue tint.
                Radial mask vignettes the canvas so the globe's right-shifted
                glow feathers out before the canvas edge — otherwise it gets
                hard-clipped at the right (the lingering "right border"). */}
            <div style={{
              position: 'absolute', inset: 0,
              filter: `hue-rotate(${tintHue}deg) saturate(${tintSat})`,
              transition: 'filter 600ms cubic-bezier(.2,.7,.2,1)',
              maskImage: 'radial-gradient(closest-side at 50% 50%, #000 68%, rgba(0,0,0,0.35) 88%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side at 50% 50%, #000 68%, rgba(0,0,0,0.35) 88%, transparent 100%)',
            }}>
              <ParticleGlobe />
            </div>

            {/* 4 satellite chips */}
            {SATS.map((s, i) => (
              <SatelliteChip
                key={s.idx}
                index={s.idx}
                label={s.label} sub={s.sub}
                x={s.x} y={s.y}
                color={s.color}
                delay={500 + i * 150}
                active={hoveredSat === s.idx}
                onHover={setHoveredSat}
                onLeave={() => setHoveredSat(null)}
                onClick={() => jumpToSlide(s.slideKey)}
              />
            ))}

            {/* CORE AGENT badge */}
            <div aria-hidden style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%) translateY(-110px)',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 9, fontWeight: 700,
              color: '#c4b5fd', letterSpacing: '0.32em', opacity: 0.8,
              pointerEvents: 'none',
              textShadow: '0 0 12px rgba(167,139,250,0.6)',
            }}>
              CORE AGENT
            </div>

            {/* Bottom status ticker */}
            <AgentStatusTicker />
          </div>
        </div>

        <PartnerMarquee />
      </div>
    </section>
  )
}
