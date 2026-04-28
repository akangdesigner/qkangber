'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Service } from '@/types/content'

const NODE_COLORS = ['#a78bfa', '#60a5fa', '#67e8f9', '#4ade80']

const OUTPUTS = [
  { x: 1010, y: 110, name: 'Slack', icon: '💬' },
  { x: 1010, y: 250, name: 'LINE',  icon: '🟢' },
  { x: 1010, y: 380, name: 'Email', icon: '✉️' },
  { x: 1010, y: 510, name: 'Sheet', icon: '📑' },
]

type Props = { services: Service[] }

export default function ServiceFlow({ services }: Props) {
  const router = useRouter()
  const [hover, setHover] = useState<string | null>(null)

  const W = 1100, H = 620
  const trigger = { x: 130, y: H / 2 }

  const nodes = services.map((s, i) => {
    const t = services.length === 1 ? 0.5 : i / (services.length - 1)
    const yPad = 80
    return {
      ...s,
      color: NODE_COLORS[i % NODE_COLORS.length],
      x: 700 + Math.sin((t - 0.5) * Math.PI * 0.4) * 36,
      y: yPad + t * (H - yPad * 2),
    }
  })

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W}/${H}`, maxWidth: W, margin: '0 auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="sf-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)" />
          </pattern>
          <radialGradient id="sf-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.10)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {nodes.map((n) => (
            <linearGradient key={n.slug} id={`sf-grad-${n.slug}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0.9" />
            </linearGradient>
          ))}
        </defs>

        <rect width={W} height={H} fill="url(#sf-bg)" />
        <rect width={W} height={H} fill="url(#sf-grid)" />

        {/* trigger → service connections */}
        {nodes.map((n, i) => {
          const x1 = trigger.x + 70, y1 = trigger.y
          const x2 = n.x - 70, y2 = n.y
          const cx = (x1 + x2) / 2
          const path = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`
          const active = hover === n.slug
          return (
            <g key={n.slug}>
              <path d={path} fill="none" stroke={`url(#sf-grad-${n.slug})`}
                strokeWidth={active ? 2.5 : 1.5} strokeOpacity={active ? 1 : 0.55} />
              <path d={path} fill="none" stroke={n.color} strokeWidth="1.5"
                strokeDasharray="6 8" strokeOpacity={active ? 1 : 0.7}
                className="sf-dash-flow" style={{ animationDelay: `${i * -300}ms` }} />
            </g>
          )
        })}

        {/* service → output connections (decorative) */}
        {nodes.flatMap((n, i) =>
          OUTPUTS.map((o, j) => (
            <line key={`${i}-${j}`}
              x1={n.x + 70} y1={n.y} x2={o.x - 28} y2={o.y}
              stroke="rgba(148,163,184,0.12)" strokeWidth="1" strokeDasharray="2 6" />
          ))
        )}

        {/* trigger node */}
        <g>
          <rect x={trigger.x - 70} y={trigger.y - 30} width="140" height="60" rx="14"
            fill="rgba(13,14,26,0.9)" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
          <circle cx={trigger.x - 70} cy={trigger.y} r="6" fill="#22d3ee">
            <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={trigger.x} y={trigger.y - 4} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
            Webhook 觸發
          </text>
          <text x={trigger.x} y={trigger.y + 14} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            客戶事件 / Cron 排程
          </text>
        </g>

        {/* output nodes */}
        {OUTPUTS.map((o) => (
          <g key={o.name}>
            <circle cx={o.x} cy={o.y} r="22" fill="rgba(13,14,26,0.9)"
              stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <text x={o.x} y={o.y + 4} textAnchor="middle" fontSize="14">{o.icon}</text>
            <text x={o.x + 32} y={o.y + 4} fill="#94a3b8" fontSize="11" fontFamily="monospace">{o.name}</text>
          </g>
        ))}

        {/* service nodes */}
        {nodes.map((n) => {
          const isHover = hover === n.slug
          return (
            <foreignObject key={n.slug} x={n.x - 105} y={n.y - 44} width="210" height="88"
              style={{ overflow: 'visible' }}>
              <div
                onMouseEnter={() => setHover(n.slug)}
                onMouseLeave={() => setHover(null)}
                onClick={() => router.push(`/services/${n.slug}`)}
                className="relative cursor-pointer rounded-2xl p-3 transition-all duration-200"
                style={{
                  background: 'rgba(13,14,26,0.92)',
                  border: `1.5px solid ${isHover ? n.color : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isHover
                    ? `0 0 0 4px ${n.color}22, 0 0 28px ${n.color}55`
                    : '0 1px 0 rgba(255,255,255,0.04) inset, 0 6px 20px rgba(0,0,0,0.5)',
                  transform: isHover ? 'translateY(-3px) scale(1.02)' : 'none',
                  height: '88px',
                }}
              >
                <span style={{
                  position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)',
                  width: 10, height: 10, borderRadius: 999, background: n.color,
                  boxShadow: `0 0 10px ${n.color}aa`,
                }} />
                <span style={{
                  position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
                  width: 10, height: 10, borderRadius: 999, background: '#cbd5e1',
                }} />
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{n.icon}</span>
                  <span className="text-[0.6rem] tracking-[0.18em] uppercase font-semibold"
                    style={{ color: n.color }}>{n.category}</span>
                </div>
                <div className="text-white text-[0.92rem] font-semibold leading-tight tracking-[-0.01em]">
                  {n.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  NT$ {n.price.toLocaleString()}{n.priceNote}
                </div>
              </div>
            </foreignObject>
          )
        })}
      </svg>

      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 flex items-center gap-1.5 pointer-events-none">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        點擊任一節點查看服務詳情
      </div>
    </div>
  )
}
