'use client'

import Link from 'next/link'
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Service } from '@/types/content'

/* ─── Stroke SVG Glyphs ─────────────────────────────────────── */
function GlyphCart() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.95-1.55L20.5 7H6" />
      <circle cx="9.5" cy="20" r="1.2" /><circle cx="17.5" cy="20" r="1.2" />
      <path d="M10 11h6" opacity="0.55" />
    </svg>
  )
}
function GlyphFunnel() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16l-6 8v6l-4-2v-4Z" /><path d="M8 9h8" opacity="0.55" />
    </svg>
  )
}
function GlyphChart() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V4M4 20h16" />
      <rect x="7" y="12" width="3" height="6" rx="0.5" />
      <rect x="12" y="8" width="3" height="10" rx="0.5" />
      <rect x="17" y="14" width="3" height="4" rx="0.5" opacity="0.7" />
    </svg>
  )
}
function GlyphTruck() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="11" height="9" rx="1.5" />
      <path d="M13 10h4.5L21 13v3h-8" />
      <circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />
    </svg>
  )
}
function GlyphLeads() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="3" /><path d="M3 19c0-3 2.5-5 5-5s5 2 5 5" />
      <path d="M15 7l2.5 2.5L22 5" />
    </svg>
  )
}
function GlyphTrigger() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 L5 13 H11 L9 22 L19 10 H13 L15 2 Z" />
    </svg>
  )
}
function GlyphShare() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
      <path d="M8.5 10.5 L15.5 6.5M8.5 13.5 L15.5 17.5" />
    </svg>
  )
}

/* ─── Service row config — matched by slug ───────────────────── */
const SERVICE_CONFIG = [
  {
    slug: 'ecommerce-automation',
    Glyph: GlyphCart,
    theme: { c1: '#22d3ee', c2: '#a78bfa' },
    portfolio: {
      title: '電商訂單 → 出貨自動化',
      category: '電商',
      Glyph: GlyphTruck,
      nodes: 12,
      resultShort: '−90% 人工作業',
      color: '#22d3ee',
      caseId: 'monitoring',
    },
  },
  {
    slug: 'marketing-automation',
    Glyph: GlyphFunnel,
    theme: { c1: '#a78bfa', c2: '#f0abfc' },
    portfolio: {
      title: '潛客自動分流 × Email 跟進',
      category: '行銷',
      Glyph: GlyphLeads,
      nodes: 18,
      resultShort: '+35% 轉換率',
      color: '#a78bfa',
      caseId: 'marketing',
    },
  },
  {
    slug: 'data-report-automation',
    Glyph: GlyphChart,
    theme: { c1: '#60a5fa', c2: '#67e8f9' },
    portfolio: {
      title: '每日數據報表自動發送',
      category: '報表',
      Glyph: GlyphChart,
      nodes: 15,
      resultShort: '報表 0 hr/週',
      color: '#60a5fa',
      caseId: 'newsletter',
    },
  },
  {
    slug: 'social-media-automation',
    Glyph: GlyphShare,
    theme: { c1: '#f0abfc', c2: '#a78bfa' },
    portfolio: {
      title: '社群跨平台排程自動化',
      category: '社群',
      Glyph: GlyphShare,
      nodes: 10,
      resultShort: '−5hr/週',
      color: '#f0abfc',
      caseId: 'marketing',
    },
  },
]

/* ─── Port dot ───────────────────────────────────────────────── */
function PortDot({ side, color = '#a78bfa', portId, pulse = false }: {
  side: 'left' | 'right'; color?: string; portId: string; pulse?: boolean
}) {
  return (
    <span
      data-port={portId}
      style={{
        position: 'absolute',
        top: '50%',
        [side === 'left' ? 'left' : 'right']: -7,
        transform: 'translateY(-50%)',
        width: 14, height: 14, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}cc, transparent 70%)`,
        boxShadow: `inset 0 0 0 1.5px ${color}, 0 0 12px ${color}99`,
        display: 'inline-grid', placeItems: 'center',
        pointerEvents: 'none', zIndex: 4,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      {pulse && (
        <span style={{
          position: 'absolute', inset: -2, borderRadius: '50%',
          border: `1px solid ${color}`, opacity: 0.45,
          animation: 'portPulse 1.8s ease-out infinite',
        }} />
      )}
    </span>
  )
}

/* ─── Trigger node ───────────────────────────────────────────── */
function TriggerNode() {
  const COLOR = '#7c5cff'
  return (
    <div style={{
      position: 'relative', width: 200,
      padding: '20px 22px', borderRadius: 16,
      background: 'radial-gradient(120% 140% at 50% 0%, rgba(124,92,255,0.18) 0%, rgba(2,3,10,0.6) 70%)',
      boxShadow: `inset 0 0 0 1px rgba(124,92,255,0.45), inset 0 1px 0 rgba(255,255,255,0.05), 0 18px 50px -20px rgba(0,0,0,0.6), 0 0 60px -10px rgba(124,92,255,0.45)`,
      textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 10,
        fontFamily: 'ui-monospace, monospace',
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c4b5fd',
      }}>
        <span style={{ width: 16, height: 16, display: 'block', color: '#c4b5fd' }}><GlyphTrigger /></span>
        TRIGGER
      </div>
      <div style={{ fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
        日常瑣事
      </div>
      <div style={{ fontFamily: 'inherit', fontSize: 11, color: '#94a3b8', letterSpacing: '0.02em', lineHeight: 1.5 }}>
        浪費時間又容易錯誤
      </div>
      <PortDot side="right" portId="trigger-out" color={COLOR} pulse />
    </div>
  )
}

/* ─── Service node ───────────────────────────────────────────── */
function ServiceNode({ service, cfg, idx }: {
  service: Service
  cfg: typeof SERVICE_CONFIG[0]
  idx: number
}) {
  const { c1, c2 } = cfg.theme
  const Glyph = cfg.Glyph
  return (
    <Link
      href={`/services/${service.slug}`}
      data-service-card
      style={{
        position: 'relative', display: 'block', padding: '16px 18px', borderRadius: 14,
        textDecoration: 'none', color: '#e2e8f0',
        background: 'radial-gradient(140% 150% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(2,3,10,0.55) 75%)',
        boxShadow: `inset 0 0 0 1px ${c1}33, inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 40px -16px rgba(0,0,0,0.6), 0 0 40px -12px ${c1}33`,
        transition: 'box-shadow 250ms, transform 250ms', cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `inset 0 0 0 1px ${c1}77, inset 0 1px 0 rgba(255,255,255,0.07), 0 22px 50px -16px rgba(0,0,0,0.7), 0 0 60px -10px ${c1}66`
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `inset 0 0 0 1px ${c1}33, inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 40px -16px rgba(0,0,0,0.6), 0 0 40px -12px ${c1}33`
        el.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          display: 'grid', placeItems: 'center',
          background: `linear-gradient(135deg, ${c1}22, ${c2}1a)`,
          boxShadow: `inset 0 0 0 1px ${c1}44`,
          color: c1,
        }}>
          <span style={{ width: 16, height: 16, display: 'block' }}><Glyph /></span>
        </div>
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase' as const, color: c1,
        }}>{service.category}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, color: '#475569', letterSpacing: '0.16em' }}>
          {String(idx + 1).padStart(2, '0')}
        </span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 4, lineHeight: 1.3 }}>
        {service.title.replace(/ —.*$/, '')}
      </div>
      {service.subtitle && (
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, lineHeight: 1.4 }}>
          {service.subtitle}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontFamily: 'ui-monospace, monospace' }}>
        <span style={{
          fontSize: 13, fontWeight: 600,
          background: `linear-gradient(90deg, ${c1}, ${c2})`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>NT$ {service.price.toLocaleString()}</span>
        <span style={{ fontSize: 10, color: '#64748b' }}>{service.priceNote}</span>
      </div>
      <PortDot side="left" portId={`service-${idx}-in`} color={c1} />
      <PortDot side="right" portId={`service-${idx}-out`} color={c2} pulse />
    </Link>
  )
}

/* ─── Portfolio node ─────────────────────────────────────────── */
function PortfolioNode({ entry, idx }: {
  entry: typeof SERVICE_CONFIG[0]['portfolio']
  idx: number
}) {
  const { color, Glyph } = entry
  return (
    <a
      href={`/portfolio?case=${entry.caseId}`}
      data-portfolio-card
      style={{
        position: 'relative', display: 'block',
        padding: '14px 16px', borderRadius: 14,
        textDecoration: 'none', color: '#e2e8f0',
        background: `radial-gradient(140% 150% at 0% 50%, ${color}1a 0%, rgba(2,3,10,0.55) 70%)`,
        boxShadow: `inset 0 0 0 1px ${color}33, inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 40px -16px rgba(0,0,0,0.6), 0 0 40px -12px ${color}33`,
        transition: 'box-shadow 250ms, transform 250ms',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `inset 0 0 0 1px ${color}88, inset 0 1px 0 rgba(255,255,255,0.07), 0 22px 50px -16px rgba(0,0,0,0.7), 0 0 60px -10px ${color}66`
        el.style.transform = 'translateX(2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `inset 0 0 0 1px ${color}33, inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 40px -16px rgba(0,0,0,0.6), 0 0 40px -12px ${color}33`
        el.style.transform = 'translateX(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          display: 'grid', placeItems: 'center',
          background: `${color}22`, boxShadow: `inset 0 0 0 1px ${color}55`, color,
        }}>
          <span style={{ width: 13, height: 13, display: 'block' }}><Glyph /></span>
        </div>
        <span style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: 9.5, letterSpacing: '0.20em', textTransform: 'uppercase' as const, color,
        }}>CASE · {entry.category}</span>
      </div>
      <div style={{
        fontSize: 13.5, fontWeight: 600, color: '#fff', letterSpacing: '-0.005em',
        lineHeight: 1.35, marginBottom: 8,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
      }}>{entry.title}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.04em',
      }}>
        <span style={{ color }}>{entry.nodes} nodes</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span style={{ color: '#a7f3d0', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px rgba(52,211,153,0.9)' }} />
          {entry.resultShort}
        </span>
      </div>
      <PortDot side="left" portId={`portfolio-${idx}-in`} color={color} />
    </a>
  )
}

/* ─── Connector overlay ──────────────────────────────────────── */
type Curve = { id: string; from: { x: number; y: number }; to: { x: number; y: number }; c1: string; c2: string }

function ConnectorOverlay({ wrapperRef, version }: { wrapperRef: React.RefObject<HTMLDivElement | null>; version: number }) {
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [curves, setCurves] = useState<Curve[]>([])

  function measure() {
    const wrap = wrapperRef.current
    if (!wrap) return
    const wr = wrap.getBoundingClientRect()

    function centerOf(selector: string) {
      const el = wrap!.querySelector(selector)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2 - wr.left, y: r.top + r.height / 2 - wr.top }
    }

    const triggerOut = centerOf('[data-port="trigger-out"]')
    if (!triggerOut) { setBox({ w: wr.width, h: wr.height }); setCurves([]); return }

    const next: Curve[] = []
    SERVICE_CONFIG.forEach((cfg, i) => {
      const sIn  = centerOf(`[data-port="service-${i}-in"]`)
      const sOut = centerOf(`[data-port="service-${i}-out"]`)
      const pIn  = centerOf(`[data-port="portfolio-${i}-in"]`)
      if (sIn) next.push({ id: `t-s${i}`, from: triggerOut, to: sIn, c1: '#7c5cff', c2: cfg.theme.c1 })
      if (sOut && pIn) next.push({ id: `s${i}-p${i}`, from: sOut, to: pIn, c1: cfg.theme.c2, c2: cfg.portfolio.color })
    })
    setBox({ w: wr.width, h: wr.height })
    setCurves(next)
  }

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  useEffect(() => {
    const t1 = setTimeout(measure, 80)
    const t2 = setTimeout(measure, 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  if (!box.w || curves.length === 0) return null

  return (
    <svg aria-hidden width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      <defs>
        {curves.map((c) => (
          <linearGradient key={`g-${c.id}`} id={`conn-${c.id}`}
            x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={c.c1} stopOpacity="0.9" />
            <stop offset="1" stopColor={c.c2} stopOpacity="0.9" />
          </linearGradient>
        ))}
      </defs>
      {curves.map((c, i) => {
        // Right side (service → portfolio) is a 1:1 mapping → straight line.
        // Left side (trigger → services) fans one-to-many → keep the n8n S-curve
        // with control handles at half the gap so they meet at the midpoint and
        // never bulge (the old 0.55 factor + 70px floor caused the ugly swing).
        const isFan = c.id.startsWith('t-')
        const dx = Math.abs(c.to.x - c.from.x) * 0.5
        const d = isFan
          ? `M ${c.from.x} ${c.from.y} C ${c.from.x + dx} ${c.from.y}, ${c.to.x - dx} ${c.to.y}, ${c.to.x} ${c.to.y}`
          : `M ${c.from.x} ${c.from.y} L ${c.to.x} ${c.to.y}`
        const pathId = `path-${c.id}`
        return (
          <g key={c.id}>
            <path d={d} fill="none" stroke={c.c2} strokeOpacity="0.18" strokeWidth="6" />
            <path id={pathId} d={d} fill="none" stroke={`url(#conn-${c.id})`} strokeWidth="1.4" />
            <path d={d} fill="none" stroke={c.c2} strokeOpacity="0.32" strokeWidth="1.1" strokeDasharray="4 6">
              <animate attributeName="stroke-dashoffset" from="0" to="-40"
                dur={`${2.4 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
            </path>
            <circle r="2.4" fill={c.c2}>
              <animateMotion dur={`${3.0 + (i % 3) * 0.3}s`} begin={`${i * 0.2}s`} repeatCount="indefinite">
                <mpath xlinkHref={`#${pathId}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0"
                dur={`${3.0 + (i % 3) * 0.3}s`} begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
            <circle r="1.6" fill={c.c1}>
              <animateMotion dur={`${3.0 + (i % 3) * 0.3}s`} begin={`${i * 0.2 + 1.4}s`} repeatCount="indefinite">
                <mpath xlinkHref={`#${pathId}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;0.8;0.8;0"
                dur={`${3.0 + (i % 3) * 0.3}s`} begin={`${i * 0.2 + 1.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function ServiceFlow({ services }: { services: Service[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!document.fonts) return
    document.fonts.ready.then(() => setVersion((v) => v + 1))
  }, [])

  // Map configs to services by slug
  const rows = SERVICE_CONFIG.flatMap((cfg) => {
    const service = services.find((s) => s.slug === cfg.slug)
    return service ? [{ cfg, service }] : []
  })

  return (
    <>
      <style>{`
        @keyframes portPulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes frameLivePulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.45; }
        }
      `}</style>

      {/* Mobile card list */}
      <div className="md:hidden flex flex-col gap-3">
        {rows.map(({ service, cfg }) => {
          const { c1 } = cfg.theme
          const Glyph = cfg.Glyph
          return (
            <Link key={service.slug} href={`/services/${service.slug}`} style={{
              display: 'block', textDecoration: 'none', color: '#e2e8f0',
              position: 'relative', padding: '16px 18px', borderRadius: 14,
              background: 'rgba(2,3,10,0.6)',
              boxShadow: `inset 0 0 0 1px ${c1}33, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  display: 'grid', placeItems: 'center',
                  background: `${c1}22`, boxShadow: `inset 0 0 0 1px ${c1}44`, color: c1,
                }}>
                  <span style={{ width: 16, height: 16, display: 'block' }}><Glyph /></span>
                </div>
                <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.18em', textTransform: 'uppercase', color: c1 }}>
                  {service.category}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{service.title.replace(/ —.*$/, '')}</div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#64748b' }}>
                NT$ {service.price.toLocaleString()} {service.priceNote}
              </div>
            </Link>
          )
        })}
        <p style={{ textAlign: 'center', fontSize: 10, fontFamily: 'ui-monospace, monospace', color: '#475569', marginTop: 4 }}>
          點擊卡片查看服務詳情
        </p>
      </div>

      {/* Desktop workflow canvas */}
      <div className="hidden md:block">
        {/* IDE Frame */}
        <div style={{
          borderRadius: 16, overflow: 'hidden',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -20px rgba(0,0,0,0.6)',
          background: 'rgba(8,9,16,0.4)', backdropFilter: 'blur(8px)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(2,3,10,0.6)',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#cbd5e1', letterSpacing: '0.04em',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)',
                animation: 'frameLivePulse 1.6s ease-in-out infinite',
              }} />
              workflow.json · live
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['#f87171', '#fbbf24', '#34d399'].map((c) => (
                <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.85 }} />
              ))}
            </div>
          </div>

          {/* 3-column workflow */}
          <div ref={wrapperRef} style={{ position: 'relative', padding: '56px 48px', minHeight: 520 }}>
            <div style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '0 72px',
              alignItems: 'center',
              zIndex: 2,
            }}>
              {/* LEFT — Trigger */}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <TriggerNode />
              </div>

              {/* RIGHT — Service ↔ Portfolio paired & row-aligned, so each
                  connecting line is perfectly horizontal */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,340px) 280px',
                columnGap: 72, rowGap: 20,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {rows.map(({ service, cfg }, i) => (
                  <Fragment key={service.slug}>
                    <ServiceNode service={service} cfg={cfg} idx={i} />
                    <PortfolioNode entry={cfg.portfolio} idx={i} />
                  </Fragment>
                ))}
              </div>
            </div>

            <ConnectorOverlay wrapperRef={wrapperRef} version={version} />
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#67e8f9', letterSpacing: '0.04em',
            background: 'rgba(2,3,10,0.6)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#67e8f9', boxShadow: '0 0 8px rgba(103,232,249,0.9)', marginRight: 8 }} />
            中間節點 → 服務詳情　｜　右側節點 → 作品集
          </div>
        </div>
      </div>
    </>
  )
}
