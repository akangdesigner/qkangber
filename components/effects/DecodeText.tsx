'use client'

import { useEffect, useState } from 'react'

const DECODE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@<>/{}[]'
const DECODE_CJK = '資料解碼系統流程自動化執行載入完成'

function pickGlyph(ch: string): string {
  if (/\s/.test(ch)) return ch
  const isCjk = /[　-鿿＀-￯]/.test(ch)
  const pool = isCjk ? DECODE_CJK : DECODE_GLYPHS
  return pool[Math.floor(Math.random() * pool.length)]
}

interface DecodeTextProps {
  children: string
  duration?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export default function DecodeText({
  children,
  duration = 700,
  delay = 0,
  className = '',
  style = {},
}: DecodeTextProps) {
  const [display, setDisplay] = useState(children)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!children) return
    let raf: number
    let startTimer: ReturnType<typeof setTimeout>
    let start: number | null = null
    setDone(false)
    setDisplay(children.split('').map(pickGlyph).join(''))

    function step(t: number) {
      if (start === null) start = t
      const elapsed = t - start
      const progress = Math.min(elapsed / duration, 1)
      const revealTo = Math.floor(progress * children.length)
      const out = children
        .split('')
        .map((ch, i) => (i < revealTo ? ch : pickGlyph(ch)))
        .join('')
      setDisplay(out)
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setDisplay(children)
        setDone(true)
      }
    }

    startTimer = setTimeout(() => {
      raf = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(startTimer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [children, duration, delay])

  return (
    <span
      className={className}
      style={{
        ...style,
        textShadow: done ? 'none' : '0 0 12px rgba(167,139,250,0.35)',
        transition: 'text-shadow 200ms ease-out',
      }}
    >
      {display}
    </span>
  )
}
