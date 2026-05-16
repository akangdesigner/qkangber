'use client'
import { useRef, useState, useEffect } from 'react'

export function useTilt({ max = 14, lerp = 0.14, scale = 1.0, perspective = 1100 } = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ nx: 0, ny: 0, a: 0 })
  const cur = useRef({ nx: 0, ny: 0, a: 0 })
  const raf = useRef<number>(0)
  const [pointer, setPointer] = useState({ nx: 0, ny: 0 })
  const [active, setActive] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({ transform: `perspective(${perspective}px)` })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      target.current.nx = Math.max(-1, Math.min(1, (x - 0.5) * 2))
      target.current.ny = Math.max(-1, Math.min(1, (y - 0.5) * 2))
      target.current.a = 1
    }
    function onEnter() { target.current.a = 1; setActive(true) }
    function onLeave() {
      target.current.nx = 0; target.current.ny = 0; target.current.a = 0
      setActive(false)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    function tick() {
      cur.current.nx += (target.current.nx - cur.current.nx) * lerp
      cur.current.ny += (target.current.ny - cur.current.ny) * lerp
      cur.current.a  += (target.current.a  - cur.current.a)  * lerp
      const { nx, ny, a } = cur.current
      const rx = (-ny * max).toFixed(3)
      const ry = ( nx * max).toFixed(3)
      const sc = (1 + (scale - 1) * a).toFixed(4)
      setStyle({ transform: `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`, transition: 'none' })
      setPointer({ nx, ny })
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

  return { ref, style, active, pointer }
}
