'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

// ── Tilt hook ──────────────────────────────────────────────────
function useTilt({ max = 7, lerp = 0.14, scale = 1.005, perspective = 1600 } = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ nx: 0, ny: 0, a: 0 })
  const cur = useRef({ nx: 0, ny: 0, a: 0 })
  const raf = useRef(0)
  const [smoothed, setSmoothed] = useState({ nx: 0, ny: 0 })
  const [active, setActive] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({ transform: `perspective(${perspective}px)` })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      target.current.nx = Math.max(-1, Math.min(1, (x - 0.5) * 2))
      target.current.ny = Math.max(-1, Math.min(1, (y - 0.5) * 2))
      target.current.a = 1
    }
    const onEnter = () => { target.current.a = 1; setActive(true) }
    const onLeave = () => {
      target.current.nx = 0; target.current.ny = 0; target.current.a = 0
      setActive(false)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    const tick = () => {
      cur.current.nx += (target.current.nx - cur.current.nx) * lerp
      cur.current.ny += (target.current.ny - cur.current.ny) * lerp
      cur.current.a  += (target.current.a  - cur.current.a)  * lerp
      const { nx, ny, a } = cur.current
      const rx = (-ny * max).toFixed(3)
      const ry = ( nx * max).toFixed(3)
      const sc = (1 + (scale - 1) * a).toFixed(4)
      setStyle({ transform: `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`, transition: 'none' })
      setSmoothed({ nx, ny })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf.current)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [max, lerp, scale, perspective])

  return { ref, style, active, pointer: smoothed }
}

// ── Visual helpers ─────────────────────────────────────────────
function Layer({ depth = 1, drift = 0, pointer = { nx: 0, ny: 0 }, style = {}, children }: {
  depth?: number; drift?: number; pointer?: { nx: number; ny: number }
  style?: React.CSSProperties; children: React.ReactNode
}) {
  const z = depth * 22
  const dx = pointer.nx * drift
  const dy = pointer.ny * drift
  return (
    <div style={{ transform: `translate3d(${dx.toFixed(2)}px,${dy.toFixed(2)}px,${z}px)`, transformStyle: 'preserve-3d', willChange: 'transform', ...style }}>
      {children}
    </div>
  )
}

function Sheen({ pointer, active, intensity = 0.22 }: { pointer: { nx: number; ny: number }; active: boolean; intensity?: number }) {
  const cx = 50 + pointer.nx * 32
  const cy = 50 + pointer.ny * 32
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
      background: `radial-gradient(420px circle at ${cx}% ${cy}%, rgba(167,139,250,${intensity}), rgba(96,165,250,${intensity * 0.6}) 30%, transparent 60%)`,
      opacity: active ? 1 : 0, transition: 'opacity 240ms ease',
      mixBlendMode: 'plus-lighter',
    }} />
  )
}

function EdgeGlow({ pointer, active }: { pointer: { nx: number; ny: number }; active: boolean }) {
  const cx = 50 + pointer.nx * 50
  const cy = 50 + pointer.ny * 50
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
      boxShadow: active
        ? 'inset 0 0 0 1px rgba(167,139,250,0.35), inset 0 0 40px rgba(124,92,255,0.10)'
        : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
      transition: 'box-shadow 300ms ease',
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: `radial-gradient(280px circle at ${cx}% ${cy}%, rgba(124,92,255,${active ? 0.18 : 0}), transparent 70%)`,
        transition: 'opacity 300ms ease', mixBlendMode: 'screen',
      }} />
    </div>
  )
}

function DotGrid({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
      backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.6) 1px, transparent 1px)',
      backgroundSize: '26px 26px', opacity,
    }} />
  )
}

function CucumberAvatar({ size = 180 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      position: 'relative', flexShrink: 0,
      boxShadow: '0 0 50px rgba(34,211,238,0.35), 0 0 0 1px rgba(94,234,212,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
      background: 'radial-gradient(circle at 30% 25%, rgba(94,234,212,0.18), rgba(15,23,42,0.6) 65%)',
      overflow: 'hidden',
    }}>
      <Image
        src="/cucumber-avatar.png"
        alt="Q kangber"
        width={size}
        height={size}
        priority
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', filter: 'drop-shadow(0 6px 20px rgba(34,211,238,0.4))' }}
      />
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 0 -20px 40px rgba(124,92,255,0.18)', pointerEvents: 'none' }} />
    </div>
  )
}

// ── Card faces ─────────────────────────────────────────────────
function CardFaceWrapper({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 'inherit',
      transform: back ? 'rotateY(180deg)' : 'none',
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 28px 70px rgba(0,0,0,0.55), 0 0 50px rgba(124,92,255,0.18)',
      backdropFilter: 'blur(14px)',
      overflow: 'hidden',
    }}>
      {/* Top gradient bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #2563eb, #6366f1 50%, #8b5cf6)', boxShadow: '0 0 22px rgba(124,92,255,0.7)' }} />
      <DotGrid opacity={0.08} />
      {children}
    </div>
  )
}

function FrontFace({ pointer, active, onFlip }: { pointer: { nx: number; ny: number }; active: boolean; onFlip: () => void }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, padding: '44px 56px', transformStyle: 'preserve-3d' }}>
        {/* Eyebrow */}
        <Layer depth={0.4} drift={3} pointer={pointer} style={{ position: 'absolute', top: 44, left: 56, right: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ height: 1, width: 32, flexShrink: 0, background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>About · Q kangber</span>
          </div>
          <span style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.20em' }}>EST. 2024</span>
        </Layer>

        {/* Two-column layout */}
        <div style={{ position: 'absolute', top: 96, left: 56, right: 56, bottom: 56, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 44, alignItems: 'stretch', transformStyle: 'preserve-3d' }}>
          {/* Left: avatar */}
          <Layer depth={2.3} drift={9} pointer={pointer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
            <CucumberAvatar size={180} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#5eead4' }}>
              n8n · AI · 職涯培訓
            </span>
          </Layer>

          {/* Right: content */}
          <Layer depth={1.4} drift={5} pointer={pointer} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
            <div>
              <h1 style={{ fontFamily: '"Noto Sans TC", sans-serif', fontSize: 52, lineHeight: 1.05, fontWeight: 600, color: '#fff', letterSpacing: '-0.025em', margin: 0 }}>
                歡迎來到{' '}
                <span style={{ background: 'linear-gradient(90deg, #c4b5fd, #93c5fd)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Q kangber</span>
                <br />的 AI 世界
              </h1>
              <p style={{ fontFamily: '"Noto Sans TC", sans-serif', fontSize: 18, lineHeight: 1.5, color: '#c4b5fd', margin: '16px 0 0 0', fontWeight: 500 }}>
                AI 不為取代判斷，而是精準表達想法。
              </p>
              <p style={{ fontFamily: '"Noto Sans TC", sans-serif', fontSize: 14, lineHeight: 1.85, color: '#94a3b8', margin: '20px 0 0 0', maxWidth: 560 }}>
                專注於 n8n 與 AI 深度整合的流程架構師、職涯培訓講師。
                相信 AI 產出與人的協作配合，才能讓成果<span style={{ color: '#c4b5fd' }}>有溫度、有實際價值</span>——
                協助企業 AI 轉型與內部培訓，並於職涯平台擔任培訓講師及舉辦實體講座。
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 380 }}>
                {['N8N', 'Claude Code', '職涯培訓講師', 'API 整合', '流程架構'].map(t => (
                  <span key={t} style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}>{t}</span>
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onFlip() }}
                style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1 50%, #8b5cf6)', color: 'white', border: 'none', borderRadius: 999, padding: '11px 22px', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 8px 26px rgba(124,92,255,0.4)' }}
              >
                核心理念
                <span style={{ display: 'inline-block', transform: active ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 200ms' }}>→</span>
              </button>
            </div>
          </Layer>
        </div>
      </div>
      <Sheen pointer={pointer} active={active} intensity={0.20} />
      <EdgeGlow pointer={pointer} active={active} />
    </>
  )
}

function BackFace({ pointer, active, onFlip }: { pointer: { nx: number; ny: number }; active: boolean; onFlip: () => void }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, padding: '44px 56px', transformStyle: 'preserve-3d' }}>
        <Layer depth={0.4} drift={3} pointer={pointer} style={{ position: 'absolute', top: 44, left: 56, right: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ height: 1, width: 32, flexShrink: 0, background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Philosophy · 我的核心理念</span>
          </div>
          <span style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.20em' }}>EST. 2024</span>
        </Layer>

        <Layer depth={1.4} drift={5} pointer={pointer} style={{ position: 'absolute', top: 100, left: 56, right: 56 }}>
          <h2 style={{ fontFamily: '"Noto Sans TC", sans-serif', fontSize: 32, lineHeight: 1.2, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            AI 產出 × 人的協作——<br />
            <span style={{ background: 'linear-gradient(90deg, #c4b5fd, #93c5fd)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>讓你的東西有溫度，也有真正的價值。</span>
          </h2>
        </Layer>

        <Layer depth={0.9} drift={3} pointer={pointer} style={{ position: 'absolute', top: 220, left: 56, right: 56, bottom: 100 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, fontFamily: '"Noto Sans TC", sans-serif', fontSize: 14, lineHeight: 1.85, color: '#cbd5e1' }}>
            <p style={{ margin: 0 }}>
              純 AI 產出速度快，但少了靈魂；純人工有溫度，但太慢。最好的成果，是<span style={{ color: '#c4b5fd' }}>你的判斷力 × AI 的執行力</span>——兩者精準配合，才能輸出真正有價值的東西。
            </p>
            <p style={{ margin: 0 }}>
              我在做的，是找到這個<span style={{ color: '#c4b5fd' }}>黃金分工點</span>：讓 AI 處理重複與生成，讓人負責方向與溫度，讓每一份產出都值得被看見。
            </p>
          </div>
        </Layer>

        <Layer depth={1.0} drift={3} pointer={pointer} style={{ position: 'absolute', left: 56, right: 56, bottom: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.10em' }}>— Q kangber, on building with AI</span>
          <button
            onClick={(e) => { e.stopPropagation(); onFlip() }}
            style={{ background: 'rgba(255,255,255,0.04)', color: '#c4b5fd', borderRadius: 999, border: '1px solid rgba(167,139,250,0.35)', padding: '11px 22px', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            <span style={{ display: 'inline-block', transform: active ? 'translateX(-3px)' : 'translateX(0)', transition: 'transform 200ms' }}>←</span>
            返回
          </button>
        </Layer>
      </div>
      <Sheen pointer={pointer} active={active} intensity={0.20} />
      <EdgeGlow pointer={pointer} active={active} />
    </>
  )
}

// ── Main export ────────────────────────────────────────────────
export default function FlipCard() {
  const [flipped, setFlipped] = useState(false)
  const { ref, style: tiltStyle, active, pointer } = useTilt({ max: 7, scale: 1.005, perspective: 1600 })

  return (
    <>
      <style>{`
        @keyframes fcBadgePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <div
        ref={ref}
        style={{ width: '100%', maxWidth: 1040, height: 460, margin: '0 auto', position: 'relative', perspective: 1600 }}
      >
        <div style={{ ...tiltStyle, width: '100%', height: '100%', borderRadius: 24, position: 'relative', transformStyle: 'preserve-3d' }}>
          {/* Flipper */}
          <div
            onClick={() => setFlipped(f => !f)}
            style={{
              position: 'absolute', inset: 0, borderRadius: 'inherit',
              transformStyle: 'preserve-3d',
              transform: `rotateY(${flipped ? 180 : 0}deg)`,
              transition: 'transform 900ms cubic-bezier(.6,.05,.3,1)',
              cursor: 'pointer', willChange: 'transform',
            }}
          >
            <CardFaceWrapper>
              <FrontFace pointer={pointer} active={active} onFlip={() => setFlipped(true)} />
            </CardFaceWrapper>
            <CardFaceWrapper back>
              <BackFace pointer={pointer} active={active} onFlip={() => setFlipped(false)} />
            </CardFaceWrapper>
          </div>
        </div>

        {/* Floating badge — outside tilt container */}
        <div style={{
          position: 'absolute', top: -14, right: 24,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 999,
          fontSize: 10, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase',
          background: '#05060a', border: '1px solid rgba(167,139,250,0.35)', color: '#c4b5fd',
          boxShadow: '0 4px 16px rgba(124,92,255,0.3)', zIndex: 5, pointerEvents: 'none',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px rgba(167,139,250,0.8)', animation: 'fcBadgePulse 1.6s ease-in-out infinite' }} />
          {flipped ? 'Back · 02 / 02' : 'Front · 01 / 02'}
        </div>
      </div>
    </>
  )
}
