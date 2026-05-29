'use client'

import { useMemo } from 'react'

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a = ((a + 0x6d2b79f5) | 0)
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function ConstellationBg() {
  const { nodes, lines, packetLines } = useMemo(() => {
    const rng = mulberry32(424242)
    const nodes = Array.from({ length: 26 }, () => ({
      x: rng() * 100,
      y: rng() * 100,
      r: 0.6 + rng() * 1.1,
    }))
    const allLines: { a: number; b: number }[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        if (dx * dx + dy * dy < 484) allLines.push({ a: i, b: j })
      }
    }
    const lines = allLines.slice(0, 38)
    const packetLines = lines.filter((_, i) => i % 6 === 0).slice(0, 5)
    return { nodes, lines, packetLines }
  }, [])

  return (
    <>
      <style>{`
        @keyframes constTwinkle { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.95; } }
      `}</style>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {lines.map((l, i) => {
          const a = nodes[l.a], b = nodes[l.b]
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="rgba(167,139,250,0.22)" strokeWidth="0.12" />
          )
        })}
        {packetLines.map((l, i) => {
          const a = nodes[l.a], b = nodes[l.b]
          const color = (['#a78bfa', '#60a5fa', '#22d3ee'] as const)[i % 3]
          const dur = `${3.6 + i * 0.6}s`
          const begin = `${i * 0.7}s`
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={color} strokeWidth="0.18" opacity="0.5" />
              <circle r="0.55" fill={color}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore — SMIL path attr is valid but missing from React types */}
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite"
                  path={`M ${a.x},${a.y} L ${b.x},${b.y}`} />
                <animate attributeName="opacity" values="0;1;1;0"
                  dur={dur} begin={begin} repeatCount="indefinite" />
              </circle>
            </g>
          )
        })}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r * 0.4} fill="#c4b5fd"
            style={{
              animation: `constTwinkle ${2.4 + (i % 5) * 0.4}s ease-in-out ${i * 0.13}s infinite`,
            }} />
        ))}
      </svg>
    </>
  )
}
