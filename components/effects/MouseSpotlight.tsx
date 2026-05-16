'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; decay: number
  size: number; hue: number
}

export default function MouseSpotlight({
  auraSize = 560,
  particleRate = 1,
  particleLifeFrames = 90,
}: {
  auraSize?: number
  particleRate?: number
  particleLifeFrames?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const auraRef  = useRef<HTMLDivElement>(null)
  const points   = useRef<Particle[]>([])
  const mouse    = useRef({ x: -9999, y: -9999, lastX: -9999, lastY: -9999, vx: 0, vy: 0 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const aura   = auraRef.current!
    const ctx    = canvas.getContext('2d')!

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = window.innerWidth
    let h = window.innerHeight

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width  = w * dpr
      canvas.height = h * dpr
      canvas.style.width  = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    function onMove(e: PointerEvent) {
      const { x, y } = e
      const m = mouse.current
      if (m.lastX < -1000) { m.lastX = x; m.lastY = y }
      m.vx = x - m.lastX
      m.vy = y - m.lastY
      m.x = x; m.y = y
      m.lastX = x; m.lastY = y

      // spawn particles proportional to speed
      const speed = Math.hypot(m.vx, m.vy)
      const count = Math.min(4, particleRate + Math.floor(speed / 18))
      for (let i = 0; i < count; i++) {
        const t = i / Math.max(1, count)
        points.current.push({
          x:    m.lastX - m.vx * (1 - t) + (Math.random() - 0.5) * 6,
          y:    m.lastY - m.vy * (1 - t) + (Math.random() - 0.5) * 6,
          vx:   (Math.random() - 0.5) * 0.5 + m.vx * 0.02,
          vy:   (Math.random() - 0.5) * 0.5 + m.vy * 0.02 - 0.05,
          life: 1,
          decay: 1 / (particleLifeFrames * (0.7 + Math.random() * 0.6)),
          size: 0.8 + Math.random() * 1.6,
          hue:  245 + Math.random() * 35,   // 245–280 blue→violet
        })
      }
      if (points.current.length > 280) {
        points.current.splice(0, points.current.length - 280)
      }

      aura.style.transform = `translate3d(${x - auraSize / 2}px,${y - auraSize / 2}px,0)`
      aura.style.opacity = '1'
    }

    function onLeave() {
      aura.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('mouseleave', onLeave)

    let raf: number
    function tick() {
      ctx.clearRect(0, 0, w, h)
      const arr = points.current
      ctx.globalCompositeOperation = 'lighter'   // additive — particles stack up bright
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i]
        p.x  += p.vx; p.y  += p.vy
        p.vx *= 0.985; p.vy *= 0.985
        p.life -= p.decay
        if (p.life <= 0) { arr.splice(i, 1); continue }

        const op = p.life * p.life            // ease-out opacity
        const r  = p.size * (0.6 + op * 0.9)

        // halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6)
        grad.addColorStop(0,    `hsla(${p.hue},95%,78%,${op * 0.85})`)
        grad.addColorStop(0.35, `hsla(${p.hue},90%,65%,${op * 0.25})`)
        grad.addColorStop(1,    `hsla(${p.hue},90%,60%,0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2)
        ctx.fill()

        // bright core
        ctx.fillStyle = `hsla(${p.hue},100%,88%,${op})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 0.8, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [auraSize, particleRate, particleLifeFrames])

  return (
    <>
      {/* Soft violet→blue→cyan ambient aura */}
      <div
        ref={auraRef}
        aria-hidden
        style={{
          position: 'fixed',
          left: 0, top: 0,
          width: auraSize, height: auraSize,
          borderRadius: '50%',
          background: `radial-gradient(circle,
            rgba(124,92,255,0.16) 0%,
            rgba(96,165,250,0.09) 28%,
            rgba(34,211,238,0.04) 50%,
            transparent 68%)`,
          pointerEvents: 'none',
          zIndex: 2,
          mixBlendMode: 'screen',
          willChange: 'transform, opacity',
          opacity: 0,
          transition: 'opacity 200ms ease',
          filter: 'blur(2px)',
        }}
      />
      {/* Particle trail canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          mixBlendMode: 'screen',
        }}
      />
    </>
  )
}
