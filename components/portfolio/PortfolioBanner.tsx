'use client'

import { useMemo } from 'react'
import Link from 'next/link'

const WORKS = [
  { no: '01', title: '電商訂單自動化',     titleEn: 'E-commerce Order Flow',    tag: 'N8N · 電商',        year: '2025', metric: '−90% 人工',   accent: '#67e8f9' },
  { no: '02', title: 'AI 客服 Agent',      titleEn: 'Customer Support Agent',   tag: 'Claude · LangChain', year: '2025', metric: '回覆 < 30 秒', accent: '#a78bfa' },
  { no: '03', title: '行銷漏斗自動跟進',   titleEn: 'Marketing Funnel',         tag: 'N8N · GA4',          year: '2024', metric: '+38% 轉換',   accent: '#f0abfc' },
  { no: '04', title: '數據報表 AI 摘要',   titleEn: 'AI Report Digest',         tag: 'GPT · Sheets',       year: '2024', metric: '0 小時人工',  accent: '#34d399' },
  { no: '05', title: 'Slack ↔ Notion 同步',titleEn: 'Slack ↔ Notion Sync',     tag: 'N8N · API',          year: '2024', metric: '雙向即時',    accent: '#fbbf24' },
  { no: '06', title: '內容生成流程',       titleEn: 'Content Pipeline',         tag: 'AI · CMS',           year: '2024', metric: '5×產能',      accent: '#60a5fa' },
]

type Work = typeof WORKS[0]

function DotBg() {
  return (
    <svg
      aria-hidden
      width="100%" height="100%"
      viewBox="0 0 1180 560"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }}
    >
      <defs>
        <radialGradient id="pb-dg" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#a78bfa" stopOpacity="0.55" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 22 }, (_, row) =>
        Array.from({ length: 50 }, (_, col) => {
          const x = 20 + col * 24 + (row % 2 ? 12 : 0)
          const y = 16 + row * 26
          const dist = Math.hypot(x - 900, y - 400)
          const r = Math.max(0.5, 1.6 - dist / 500)
          return <circle key={`${row}-${col}`} cx={x} cy={y} r={r} fill="url(#pb-dg)" />
        })
      )}
    </svg>
  )
}

function Wordmark() {
  const particles = useMemo(() => {
    const arr: { x: number; dur: number; delay: number; r: number; col: string }[] = []
    for (let i = 0; i < 44; i++) {
      arr.push({
        x: 20 + Math.random() * 540,
        dur: 1.8 + Math.random() * 2.6,
        delay: -Math.random() * 4,
        r: 0.8 + Math.random() * 1.4,
        col: ['#67e8f9', '#a78bfa', '#f0abfc', '#ffffff'][i % 4],
      })
    }
    return arr
  }, [])

  return (
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1180, margin: '0 auto', padding: '20px 44px 0' }}>
      {/* Register line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ width: 8, height: 3, borderRadius: 2, background: '#67e8f9', flexShrink: 0 }} />
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 11, letterSpacing: '0.28em', color: '#94a3b8', textTransform: 'uppercase',
        }}>
          Selected ·{' '}
          <span style={{ color: '#67e8f9' }}>Vol.</span>{' '}
          <span style={{ color: '#fff' }}>24</span>{' '}
          · 2025 ed.
        </span>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(167,139,250,0.4), transparent)' }} />
      </div>

      {/* SVG wordmark — Scanline + Current + particle drift */}
      <svg
        viewBox="0 0 600 200"
        width="100%"
        style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 0 30px rgba(103,232,249,0.35))' }}
      >
        <defs>
          {/* animated gradient along the electric stroke */}
          <linearGradient id="pb-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#67e8f9" />
            <stop offset="0.5" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#f0abfc" />
            <animate attributeName="x1" values="-1;1" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0;2"  dur="3.5s" repeatCount="indefinite" />
          </linearGradient>

          {/* white sweep beam */}
          <linearGradient id="pb-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"   stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="1"   stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          {/* CRT scanline fill pattern */}
          <pattern id="pb-scan" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="1.6" fill="#67e8f9" opacity="0.45" />
          </pattern>

          {/* text-shape mask for inner effects */}
          <mask id="pb-mask">
            <rect width="100%" height="100%" fill="#000" />
            <text
              x="0" y="175"
              fontFamily='"Noto Sans TC", sans-serif'
              fontWeight="900"
              fontSize="180"
              letterSpacing="4"
              fill="#fff"
            >作品集</text>
          </mask>

          {/* glow filter for particles */}
          <filter id="pb-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" />
            <feComponentTransfer><feFuncA type="linear" slope="1.6" /></feComponentTransfer>
          </filter>
        </defs>

        {/* ── Inner layer: clipped to text shape ── */}
        <g mask="url(#pb-mask)">
          {/* scanline fill */}
          <rect x="0" y="0" width="600" height="200" fill="url(#pb-scan)" />

          {/* sweep beam traversing left→right */}
          <rect x="-200" y="0" width="160" height="200" fill="url(#pb-beam)"
            style={{ mixBlendMode: 'screen' }}>
            <animate attributeName="x" from="-200" to="800" dur="3.8s" repeatCount="indefinite" />
          </rect>

          {/* particles drifting upward */}
          {particles.map((p, i) => (
            <circle key={i} cx={p.x} cy="220" r={p.r} fill={p.col} filter="url(#pb-glow)">
              <animate attributeName="cy"      values="220;-20"  dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;1;0"  dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* arc flash 1 */}
          <path d="M 80 80 L 110 60 L 140 90 L 180 50" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0"
            style={{ animation: 'pbArc 4.2s ease-in-out infinite' }} />
          {/* arc flash 2 */}
          <path d="M 360 130 L 390 110 L 420 140 L 460 100" stroke="#67e8f9" strokeWidth="1" fill="none" opacity="0"
            style={{ animation: 'pbArc 5.4s 1.2s ease-in-out infinite' }} />
        </g>

        {/* ── Outer: outline with electric dashed stroke ── */}
        {/* base hairline */}
        <text x="0" y="175" fontFamily='"Noto Sans TC", sans-serif' fontWeight="900" fontSize="180" letterSpacing="4"
          fill="none" stroke="rgba(103,232,249,0.45)" strokeWidth="1.2">作品集</text>
        {/* flowing dash = electric current */}
        <text x="0" y="175" fontFamily='"Noto Sans TC", sans-serif' fontWeight="900" fontSize="180" letterSpacing="4"
          fill="none" stroke="url(#pb-stroke)" strokeWidth="2" strokeDasharray="3 9"
          style={{ animation: 'pbDash 1.2s linear infinite' }}>作品集</text>
        {/* counter-flow layer */}
        <text x="0" y="175" fontFamily='"Noto Sans TC", sans-serif' fontWeight="900" fontSize="180" letterSpacing="4"
          fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.6" strokeDasharray="1 14"
          style={{ animation: 'pbDash2 2.4s linear infinite' }}>作品集</text>
      </svg>
    </div>
  )
}

function MarqueeCard({ w }: { w: Work }) {
  return (
    <div style={{
      flex: '0 0 auto',
      width: 240, height: 150,
      borderRadius: 14,
      padding: 14,
      background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10), 0 12px 30px rgba(0,0,0,0.4)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden',
    }}>
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${w.accent}, transparent)`,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 10, color: w.accent, letterSpacing: '0.18em' }}>{w.no}</div>
        <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 9.5, color: '#64748b', letterSpacing: '0.14em' }}>{w.year}</div>
      </div>
      <div>
        <div style={{ fontFamily: '"Noto Sans TC", sans-serif', fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{w.title}</div>
        <div style={{ marginTop: 6, fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 9.5, color: '#64748b', letterSpacing: '0.12em' }}>{w.titleEn}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontFamily: '"Noto Sans TC", sans-serif', fontSize: 10.5, color: '#94a3b8' }}>{w.tag}</div>
        <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11, color: w.accent, fontWeight: 600 }}>{w.metric}</div>
      </div>
    </div>
  )
}

export default function PortfolioBanner() {
  const loop = [...WORKS, ...WORKS]

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      background: '#02030a',
      color: '#fff',
      overflow: 'hidden',
      minHeight: 560,
    }}>
      <style>{`
        @keyframes pbMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pbPulse   { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes pbDash    { to { stroke-dashoffset: -64 } }
        @keyframes pbDash2   { to { stroke-dashoffset: 80 } }
        @keyframes pbArc     { 0%,78%,100% { opacity:0 } 80%,90% { opacity:1 } }
      `}</style>

      <DotBg />

      {/* spotlight */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124,92,255,0.18), transparent 60%),' +
          'radial-gradient(ellipse 70% 50% at 100% 80%, rgba(34,211,238,0.10), transparent 60%)',
      }} />
      {/* top/bottom feather */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #02030a 0%, transparent 10%, transparent 90%, #02030a 100%)',
      }} />

      {/* top meta bar */}
      <div style={{
        position: 'relative',
        maxWidth: 1180, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 44px 0',
        zIndex: 3,
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '5px 12px', borderRadius: 999,
          background: 'rgba(124,92,255,0.10)',
          boxShadow: 'inset 0 0 0 1px rgba(124,92,255,0.35)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#a78bfa', boxShadow: '0 0 8px #a78bfa',
            animation: 'pbPulse 1.6s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase',
            color: '#c4b5fd',
          }}>PORTFOLIO · 作品集</span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 18,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 11, color: '#64748b', letterSpacing: '0.18em',
          flexWrap: 'wrap',
        }}>
          <span>2022 — 2025</span>
          <span style={{ color: '#334155' }}>/</span>
          <span style={{ color: '#94a3b8' }}>24 PROJECTS</span>
        </div>
      </div>

      {/* wordmark */}
      <Wordmark />

      {/* marquee strip */}
      <div style={{
        position: 'relative',
        marginTop: 28, padding: '14px 0',
        zIndex: 3,
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}>
        <div style={{
          display: 'flex', gap: 18,
          width: 'max-content',
          animation: 'pbMarquee 38s linear infinite',
        }}>
          {loop.map((w, i) => <MarqueeCard key={i} w={w} />)}
        </div>
      </div>

      {/* bottom tagline + CTA */}
      <div style={{
        position: 'relative',
        maxWidth: 1180, margin: '0 auto',
        padding: '14px 44px 48px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap',
        zIndex: 3,
      }}>
        <p style={{
          margin: 0, maxWidth: 460,
          fontFamily: '"Noto Sans TC", sans-serif',
          fontSize: 15, lineHeight: 1.7, color: '#94a3b8',
        }}>
          這些是我做過、留下痕跡的工作。把工具串成自動化的脈絡，
          再用 AI 接上判斷與表達。
        </p>

        <Link
          href="#works"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '12px 26px', borderRadius: 6,
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.6)',
            fontFamily: '"Noto Sans TC", sans-serif',
            fontSize: 14.5, fontWeight: 500,
            letterSpacing: '0.02em', textDecoration: 'none',
          }}
        >
          查看全部案例
          <span style={{ color: '#a78bfa' }}>→</span>
        </Link>
      </div>
    </section>
  )
}
