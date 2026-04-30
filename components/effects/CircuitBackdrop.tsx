'use client'

import { useEffect, useRef } from 'react'

export default function CircuitBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = []
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * DPR
      canvas.height = h * DPR
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      const target = Math.max(36, Math.floor((w * h) / 18000))
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.1 + 0.4,
      }))
    }

    function frame() {
      const w = canvas.width / DPR
      const h = canvas.height / DPR
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167,139,250,0.32)'
        ctx.fill()
      }

      const MAX = 130
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < MAX * MAX) {
            const alpha = (1 - Math.sqrt(d2) / MAX) * 0.06
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(124,92,255,${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(frame)
    }

    resize()
    frame()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.55,
        mixBlendMode: 'screen',
      }}
    />
  )
}
