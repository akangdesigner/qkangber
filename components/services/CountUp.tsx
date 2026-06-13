'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** 可帶前後綴的數值字串（例如 "< 30 秒"、"0 小時"）或純數字（價格） */
  value: string | number
  /** 是否用千分位（價格用） */
  grouping?: boolean
  /** 動畫長度 ms */
  duration?: number
  className?: string
  style?: React.CSSProperties
}

// 從字串抓出第一段數字，保留前綴與後綴
function parse(value: string | number) {
  const raw = typeof value === 'number' ? String(value) : value
  const m = raw.match(/-?\d[\d,]*(?:\.\d+)?/)
  if (!m) return { prefix: raw, target: null as number | null, suffix: '', decimals: 0, hadComma: false }
  const numStr = m[0]
  const start = m.index ?? 0
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  return {
    prefix: raw.slice(0, start),
    suffix: raw.slice(start + numStr.length),
    target: parseFloat(numStr.replace(/,/g, '')),
    decimals,
    hadComma: numStr.includes(','),
  }
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export default function CountUp({ value, grouping, duration = 1100, className, style }: Props) {
  const { prefix, target, suffix, decimals, hadComma } = parse(value)
  const useGroup = grouping ?? hadComma

  const format = (n: number) =>
    n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: useGroup,
    })

  // SSR / 無 JS：直接渲染最終值，爬蟲讀得到真實數據
  const finalDisplay = target === null ? '' : format(target)
  const [display, setDisplay] = useState(finalDisplay)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    if (target === null) return
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // 尊重減少動態偏好，維持最終值

    let raf = 0
    // 進場前先歸零（用 rAF 推遲，避免在 effect body 同步 setState）
    const zeroRaf = requestAnimationFrame(() => setDisplay(format(0)))
    const run = () => {
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration)
        setDisplay(format(target * easeOutCubic(p)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done.current) {
          done.current = true
          run()
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      cancelAnimationFrame(zeroRaf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  if (target === null) return <span className={className} style={style}>{prefix}</span>

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
