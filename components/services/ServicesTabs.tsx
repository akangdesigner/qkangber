'use client'

import { useState } from 'react'
import type { Service } from '@/types/content'
import ServiceCard from './ServiceCard'
import ServiceFlow from './ServiceFlow'

type Props = {
  automationServices: Service[]
  aiServices: Service[]
  productServices: Service[]
}

type TabId = 'automation' | 'ai' | 'product'

function N8nIcon({ size = 22, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="st-n8n-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <g stroke={active ? '#fff' : '#94a3b8'} strokeWidth="1.5" fill="none">
        <path d="M9 14.5L13 10.5M9 17.5L13 21.5M19 10.5L23 14.5M19 21.5L23 17.5" />
      </g>
      <circle cx="6"  cy="16" r="3.5" fill={active ? 'url(#st-n8n-grad)' : '#0a0b14'} stroke={active ? '#fff' : '#a78bfa'} strokeWidth="1.5" />
      <circle cx="16" cy="8"  r="3.5" fill={active ? 'url(#st-n8n-grad)' : '#0a0b14'} stroke={active ? '#fff' : '#a78bfa'} strokeWidth="1.5" />
      <circle cx="16" cy="24" r="3.5" fill={active ? 'url(#st-n8n-grad)' : '#0a0b14'} stroke={active ? '#fff' : '#a78bfa'} strokeWidth="1.5" />
      <circle cx="26" cy="16" r="3.5" fill={active ? 'url(#st-n8n-grad)' : '#0a0b14'} stroke={active ? '#fff' : '#a78bfa'} strokeWidth="1.5" />
    </svg>
  )
}

function AiIcon({ size = 22, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="st-ai-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path
        d="M16 4 L18.2 13.8 L28 16 L18.2 18.2 L16 28 L13.8 18.2 L4 16 L13.8 13.8 Z"
        fill={active ? 'url(#st-ai-grad)' : 'none'}
        stroke={active ? '#fff' : '#a78bfa'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="7"  r="1.5" fill={active ? '#fff' : '#67e8f9'} />
      <circle cx="6"  cy="26" r="1"   fill={active ? '#fff' : '#a78bfa'} />
    </svg>
  )
}

function PackIcon({ size = 22, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="st-pack-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <g stroke={active ? '#fff' : '#a78bfa'} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M16 4 L27 10 L27 22 L16 28 L5 22 L5 10 Z" fill={active ? 'url(#st-pack-grad)' : 'none'} />
        <path d="M5 10 L16 16 L27 10 M16 16 L16 28" stroke={active ? '#fff' : '#94a3b8'} />
      </g>
    </svg>
  )
}

function HoloPill({
  active,
  icon,
  label,
  sub,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  sub: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 22px',
        minWidth: 240,
        borderRadius: 14,
        border: active ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)',
        background: active
          ? 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(139,92,246,0.18) 60%, rgba(34,211,238,0.10))'
          : 'rgba(255,255,255,0.025)',
        cursor: 'pointer',
        color: '#fff',
        fontFamily: 'inherit',
        boxShadow: active
          ? '0 0 0 1px rgba(124,92,255,0.35), 0 16px 38px rgba(124,92,255,0.30), inset 0 1px 0 rgba(255,255,255,0.10)'
          : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        transition: 'background 200ms, border-color 200ms, transform 200ms, box-shadow 200ms',
        transform: active ? 'translateY(-1px)' : 'none',
      }}
    >
      {/* Icon container */}
      <div style={{
        width: 44, height: 44,
        borderRadius: 12,
        display: 'grid', placeItems: 'center',
        background: active
          ? 'linear-gradient(135deg, #2563eb, #6366f1 50%, #8b5cf6)'
          : 'rgba(255,255,255,0.04)',
        border: active ? 'none' : '1px solid rgba(167,139,250,0.18)',
        boxShadow: active ? '0 0 24px rgba(124,92,255,0.5), inset 0 1px 0 rgba(255,255,255,0.18)' : 'none',
        flexShrink: 0,
        transition: 'all 200ms',
      }}>
        {icon}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <span style={{
          fontSize: 15, fontWeight: 600,
          color: active ? '#fff' : '#cbd5e1',
          letterSpacing: '-0.01em',
        }}>{label}</span>
        <span style={{
          fontSize: 10,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          letterSpacing: '0.18em', textTransform: 'uppercase' as const,
          color: active ? '#a5f3fc' : '#64748b',
        }}>{sub}</span>
      </div>

      {/* ACTIVE badge */}
      {active && (
        <div style={{
          position: 'absolute', top: -8, right: 14,
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '3px 9px',
          borderRadius: 999,
          fontSize: 9, fontWeight: 700,
          letterSpacing: '0.22em',
          background: '#02030a',
          border: '1px solid rgba(103,232,249,0.5)',
          color: '#67e8f9',
          pointerEvents: 'none',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#67e8f9',
            boxShadow: '0 0 6px rgba(103,232,249,0.9)',
            animation: 'stHoloPulse 1.6s ease-in-out infinite',
          }} />
          ACTIVE
        </div>
      )}
    </button>
  )
}

export default function ServicesTabs({ automationServices, aiServices, productServices }: Props) {
  const [active, setActive] = useState<TabId>('automation')

  const automationCategories = [...new Set(automationServices.map((s) => s.category))]

  return (
    <>
      <style>{`
        @keyframes stHoloPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes stHoloSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>

      {/* Mode label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 10, color: '#64748b', letterSpacing: '0.22em', textTransform: 'uppercase',
          flexShrink: 0,
        }}>{'// select.mode'}</span>
        <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.06)' }} />
        <span style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 10, color: '#67e8f9', letterSpacing: '0.16em',
          flexShrink: 0,
        }}>v2.4.1</span>
      </div>

      {/* Holographic pills */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <HoloPill
          active={active === 'automation'}
          onClick={() => setActive('automation')}
          icon={<N8nIcon size={22} active={active === 'automation'} />}
          label="n8n 自動化"
          sub="Automation · 4 Services"
        />
        <HoloPill
          active={active === 'ai'}
          onClick={() => setActive('ai')}
          icon={<AiIcon size={22} active={active === 'ai'} />}
          label="AI 應用"
          sub="LINE Bot · RAG · Agents"
        />
        <HoloPill
          active={active === 'product'}
          onClick={() => setActive('product')}
          icon={<PackIcon size={22} active={active === 'product'} />}
          label="自動化產品包"
          sub="Ready-made · Packaged"
        />
      </div>

      {/* Status console bar */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '20px 24px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 40,
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, overflow: 'hidden' }}>
          <div style={{
            width: '40%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(103,232,249,0.7), transparent)',
            animation: 'stHoloSweep 3.2s ease-in-out infinite',
          }} />
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#34d399',
          boxShadow: '0 0 10px rgba(52,211,153,0.7)',
          animation: 'stHoloPulse 1.6s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 12, color: '#cbd5e1', letterSpacing: '0.04em',
        }}>
          {active === 'automation'
            ? 'loaded: workflow.json · 4 nodes · 12 connections'
            : active === 'ai'
            ? 'loaded: ai.config.json · claude-3.5 · 6 endpoints'
            : 'loaded: product.pack · 2 ready-made packages'}
        </span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 10, color: '#64748b', letterSpacing: '0.18em', textTransform: 'uppercase',
          flexShrink: 0,
        }}>READY</span>
      </div>

      {/* 兩個分頁都渲染進 HTML，用 hidden 切換顯示——讓不跑 JS 的爬蟲與 AI 引擎也讀得到 AI 服務清單與內鏈 */}
      <div hidden={active !== 'automation'}>
          <div className="mb-14">
            <ServiceFlow services={automationServices} />
          </div>

          {automationCategories.map((cat) => {
            const catServices = automationServices.filter((s) => s.category === cat)
            return (
              <div key={cat} className="mb-14">
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
                  <span>{cat}</span>
                  <span className="h-px flex-1 bg-white/[0.06]" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {catServices.map((service) => (
                    <ServiceCard key={service.slug} service={service} />
                  ))}
                </div>
              </div>
            )
          })}
      </div>

      {/* AI 應用 content */}
      <div hidden={active !== 'ai'}>
          <div className="mb-10 max-w-xl">
            <p className="text-slate-400 leading-relaxed">
              使用 Claude 系列模型，幫你把 AI 能力包進產品、流程與工具裡。不只是 Prompt，而是從需求到上線的完整交付。
            </p>
          </div>
          <div className="mb-14">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
              <span>客服與 AI</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {aiServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
      </div>

      {/* 自動化產品包 content */}
      <div hidden={active !== 'product'}>
          <div className="mb-10 max-w-xl">
            <p className="text-slate-400 leading-relaxed">
              已經打包好、範圍固定、做到能跑就交付的現成自動化——不用從零開規格，挑一個直接導入。附操作教學，需要再客製也可以延伸。
            </p>
          </div>
          <div className="mb-14">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
              <span>現成產品包</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {productServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
      </div>

    </>
  )
}
