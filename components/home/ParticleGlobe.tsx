'use client'

import { useEffect, useRef } from 'react'

export default function ParticleGlobe() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let w = 0, h = 0, cx = 0, cy = 0, R = 0
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    // capture non-null refs for closures
    const c = canvas
    const x = ctx

    function resize() {
      const rect = c.getBoundingClientRect()
      w = rect.width; h = rect.height
      c.width = w * DPR; c.height = h * DPR
      x.setTransform(DPR, 0, 0, DPR, 0, 0)
      cx = w / 2; cy = h / 2
      R = Math.min(w, h) * 0.42
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)

    const N = 1100
    const pts: { x: number; y: number; z: number }[] = []
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / N)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      pts.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      })
    }
    const hubs = [0, 200, 420, 640, 860, 1020]

    let t = 0
    function frame() {
      t += 0.0035
      x.clearRect(0, 0, w, h)

      const grd = x.createRadialGradient(cx + R * 0.6, cy, 0, cx + R * 0.6, cy, R * 1.5)
      grd.addColorStop(0, 'rgba(99,102,241,0.18)')
      grd.addColorStop(0.5, 'rgba(59,130,246,0.06)')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      x.fillStyle = grd
      x.fillRect(0, 0, w, h)

      const cosY = Math.cos(t), sinY = Math.sin(t)
      const cosX = Math.cos(t * 0.4), sinX = Math.sin(t * 0.4)

      const proj = pts.map((p) => {
        const rx = p.x * cosY + p.z * sinY
        const rz = -p.x * sinY + p.z * cosY
        let ry = p.y
        const ry2 = ry * cosX - rz * sinX
        const rz2 = ry * sinX + rz * cosX
        ry = ry2
        const rz3 = rz2
        const persp = 1 / (1.6 - rz3 * 0.6)
        return { sx: cx + rx * R * persp, sy: cy + ry * R * persp, z: rz3 }
      })

      const order = proj.map((_, i) => i).sort((a, b) => proj[a].z - proj[b].z)
      for (const i of order) {
        const p = proj[i]
        const depth = (p.z + 1) / 2
        const r = 0.5 + depth * 1.7
        const alpha = 0.15 + depth * 0.85
        if (hubs.includes(i)) {
          x.fillStyle = `rgba(34,211,238,${alpha})`
          x.beginPath(); x.arc(p.sx, p.sy, r * 2.4, 0, Math.PI * 2); x.fill()
          x.fillStyle = `rgba(34,211,238,${alpha * 0.18})`
          x.beginPath(); x.arc(p.sx, p.sy, r * 6, 0, Math.PI * 2); x.fill()
        } else {
          const hue = 240 + depth * 30
          x.fillStyle = `hsla(${hue}, 90%, ${55 + depth * 15}%, ${alpha})`
          x.beginPath(); x.arc(p.sx, p.sy, r, 0, Math.PI * 2); x.fill()
        }
      }

      x.lineCap = 'round'
      for (const h of hubs) {
        const a = proj[h]
        if (a.z < -0.2) continue
        const candidates: { i: number; d2: number }[] = []
        for (let i = 0; i < N; i++) {
          if (i === h) continue
          const b = proj[i]
          const dx = a.sx - b.sx, dy = a.sy - b.sy
          const d2 = dx * dx + dy * dy
          if (d2 < (R * 0.32) ** 2 && b.z > -0.3) candidates.push({ i, d2 })
        }
        candidates.sort((m, n) => m.d2 - n.d2)
        for (const cand of candidates.slice(0, 4)) {
          const b = proj[cand.i]
          const grad = x.createLinearGradient(a.sx, a.sy, b.sx, b.sy)
          grad.addColorStop(0, 'rgba(34,211,238,0.55)')
          grad.addColorStop(1, 'rgba(124,92,255,0.05)')
          x.strokeStyle = grad
          x.lineWidth = 0.6
          x.beginPath(); x.moveTo(a.sx, a.sy); x.lineTo(b.sx, b.sy); x.stroke()
        }
      }

      raf = requestAnimationFrame(frame)
    }
    frame()

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ filter: 'drop-shadow(0 0 80px rgba(99,102,241,0.4))' }}
    />
  )
}
