'use client'

import { useEffect, useRef, useState } from 'react'

// ── 數字區塊（關於我 · 巨型疊字）─────────────────────────────────
// 設計來源：Claude Design「關於我 · 數字區塊」變體 D。主數字放大、
// 巨型 ghost 數字襯底，數字進入視窗時 count-up + 彈跳。
// 數字字體用 Space Grotesk，標籤等寬字用 JetBrains Mono（站點既有字體）。

type Stat = {
  value: number
  suffix: string
  label: string
  en: string
}

const STATS: Stat[] = [
  { value: 50, suffix: '+', label: '自動化流程', en: 'Automations shipped' },
  { value: 20, suffix: '+', label: '客戶專案', en: 'Client projects' },
  { value: 1000, suffix: '+', label: '小時人工作業節省', en: 'Hours of manual work saved' },
  { value: 10, suffix: '+', label: 'AI 教學專案', en: 'Personal & corporate teaching' },
]

const NUM_FONT = 'var(--font-space-grotesk), var(--font-noto), sans-serif'
const MONO_FONT = 'var(--font-jetbrains), ui-monospace, monospace'

// 進入視窗偵測（會重新觸發）
function useInView(threshold = 0.4) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // mount fallback：在沒有 IntersectionObserver 的情境也保證跑一次
    const t = setTimeout(() => setInView(true), 120)
    let io: IntersectionObserver | undefined
    try {
      io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setInView(true) },
        { threshold },
      )
      io.observe(el)
    } catch { /* 不支援就靠 mount fallback */ }
    return () => { clearTimeout(t); io?.disconnect() }
  }, [threshold])
  return { ref, inView }
}

// 數字 count-up（easeOutExpo 平滑減速）
function useCountUp(target: number, inView: boolean, { duration = 1500, delay = 0 } = {}) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) { setVal(0); return }
    let raf = 0
    const begin = performance.now() + delay
    const step = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - begin) / duration))
      const e = p <= 0 ? 0 : 1 - Math.pow(2, -10 * p)
      setVal(Math.round(target * e))
      if (p < 1) raf = requestAnimationFrame(step)
      else setVal(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration, delay])
  return val
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
      <span
        className="text-[0.66rem] tracking-[0.24em] uppercase font-semibold"
        style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {children}
      </span>
    </div>
  )
}

export default function StatsBlock() {
  const { ref, inView } = useInView()
  const lead = STATS[2] // 1000+ 小時，作為主角
  const rest = [STATS[0], STATS[1], STATS[3]]
  const leadN = useCountUp(lead.value, inView, { delay: 80 })

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/[0.06] pt-14 mt-16">
      <style>{`
        @keyframes statPop {
          0%   { transform: translateY(14px) scale(0.86); opacity: 0; }
          55%  { transform: translateY(0)    scale(1.06); opacity: 1; }
          78%  { transform: translateY(0)    scale(0.985); }
          100% { transform: translateY(0)    scale(1); opacity: 1; }
        }
      `}</style>

      {/* 氛圍光暈：紫（上）＋青（右下） */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% -10%, rgba(124,92,255,0.16), transparent 62%), radial-gradient(ellipse 40% 60% at 92% 120%, rgba(34,211,238,0.07), transparent 60%)' }}
      />

      {/* ghost 巨字 1K */}
      <div
        aria-hidden
        className="absolute -top-10 right-0 sm:-right-4 -z-10 select-none pointer-events-none leading-none"
        style={{
          fontFamily: NUM_FONT,
          fontSize: 'clamp(180px, 38vw, 420px)',
          fontWeight: 700,
          letterSpacing: '-0.06em',
          background: 'linear-gradient(180deg, rgba(124,92,255,0.13), transparent 70%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        1K
      </div>

      <div className="relative z-[1]">
        <div className="mb-8">
          <Eyebrow>目前累積 · By the numbers</Eyebrow>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 lg:items-center">
          {/* 主角數字 */}
          <div>
            <div
              style={{
                fontFamily: NUM_FONT,
                fontSize: 'clamp(76px, 13vw, 150px)',
                fontWeight: 600,
                lineHeight: 0.92,
                letterSpacing: '-0.04em',
                fontVariantNumeric: 'tabular-nums',
                background: 'linear-gradient(120deg, #ffffff, #c4b5fd 60%, #93c5fd)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: inView ? 'statPop 760ms cubic-bezier(.2,.7,.2,1) 60ms both' : 'none',
              }}
            >
              {leadN}
              <span style={{ opacity: 0.6 }}>{lead.suffix}</span>
            </div>

            <div className="flex items-center gap-2.5 mt-3">
              <span className="text-lg sm:text-xl font-semibold" style={{ color: '#e6e9f0' }}>預估節省工時</span>
              <span
                className="text-[10px] font-semibold tracking-[0.14em] uppercase rounded-full"
                style={{
                  color: '#c4b5fd',
                  padding: '3px 9px',
                  border: '1px solid rgba(167,139,250,0.32)',
                  background: 'rgba(124,92,255,0.08)',
                  fontFamily: MONO_FONT,
                }}
              >
                EST · 估算
              </span>
            </div>

            <div className="mt-2 text-xs tracking-[0.04em]" style={{ color: '#7c89a3', fontFamily: MONO_FONT }}>
              以「流程 × 使用頻率」推算 · 平均每流程每週省下 6–8 小時
            </div>

            <p className="mt-3.5 max-w-[380px] text-sm leading-[1.8] m-0" style={{ color: '#8b93a7' }}>
              這不是時數統計，是把這些時間還給判斷、創造與生活——自動化真正的價值。
            </p>
          </div>

          {/* 其餘三項 */}
          <div className="flex flex-col gap-5">
            {rest.map((s, i) => (
              <RestStat key={s.label} stat={s} inView={inView} delay={260 + i * 120} last={i === rest.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function RestStat({ stat, inView, delay, last }: { stat: Stat; inView: boolean; delay: number; last: boolean }) {
  const n = useCountUp(stat.value, inView, { delay })
  return (
    <div
      className="flex items-baseline gap-4 sm:gap-5 pb-[18px]"
      style={{ borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.08)' }}
    >
      <span
        className="flex-shrink-0"
        style={{
          minWidth: 110,
          fontFamily: NUM_FONT,
          fontSize: 'clamp(40px, 8vw, 52px)',
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: '#f3f2f6',
          fontVariantNumeric: 'tabular-nums',
          animation: inView ? `statPop 720ms cubic-bezier(.2,.7,.2,1) ${delay}ms both` : 'none',
        }}
      >
        {n}
        <span style={{ opacity: 0.62 }}>{stat.suffix}</span>
      </span>
      <div>
        <div className="text-[15px] font-semibold" style={{ color: '#dfe3ec' }}>{stat.label}</div>
        <div className="mt-1 text-[11px] tracking-[0.13em] uppercase" style={{ color: '#5f677a', fontFamily: MONO_FONT }}>{stat.en}</div>
      </div>
    </div>
  )
}
