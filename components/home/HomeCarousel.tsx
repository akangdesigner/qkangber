'use client'
import { useState, useEffect, useRef } from 'react'
import { useTilt } from '@/hooks/useTilt'

const SLIDES = [
  {
    key: 'RAG',
    chinese: '檢索增強生成',
    tagline: '把私有知識變成可以對話的資料庫。',
    desc: '比較 Pinecone / Qdrant / pgvector，從 chunk 切割、embedding 模型挑選、到查詢重排序，做出真正 production-ready 的 RAG。',
    chips: ['pgvector', 'Chunking', 'Reranker', 'Hybrid Search'],
    accent: ['#a78bfa', '#60a5fa'] as [string, string],
    visual: 'rag' as const,
  },
  {
    key: 'N8N',
    chinese: '工作流自動化',
    tagline: '把日常重複的事情，交給一條會自我癒合的工作流。',
    desc: 'Webhook、Cron、Self-hosted。從 Shopify × 物流、Lead → CRM、到內容批次發佈，每條工作流都附監控與重試機制。',
    chips: ['Webhook', 'Cron', 'Error Branch', 'Self-host'],
    accent: ['#60a5fa', '#22d3ee'] as [string, string],
    visual: 'n8n' as const,
  },
  {
    key: 'CLAUDE',
    chinese: '整合型 AI 代理人',
    tagline: '以 Claude 為核心，把設計、程式、流程、資料串成一條線。',
    desc: '用 Claude Sonnet 系列當主腦，把 Figma 設計稿、IDE 程式碼、n8n 工作流與資料庫串在同一個 Agent 裡——一個請求穿過所有環節，每一步都會回頭檢查。',
    chips: ['Design → Code', 'Code → n8n', 'n8n → DB', 'Multi-step'],
    accent: ['#f0abfc', '#a78bfa'] as [string, string],
    visual: 'claude' as const,
  },
  {
    key: 'VIBE',
    chinese: 'Vibe Coding',
    tagline: '寫程式不再是寫程式，是描述一個感覺。',
    desc: '用自然語言把模糊的想法快速變成可運作的原型。從 Cursor、Claude Code 到 Lovable，整套工作流＋我的提示詞拆解。',
    chips: ['Cursor', 'Claude Code', 'Prompt', 'Rapid Proto'],
    accent: ['#67e8f9', '#a78bfa'] as [string, string],
    visual: 'vibe' as const,
  },
]

// ── SVG Visuals ──────────────────────────────────────────────

function VisualRAG({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg viewBox="0 0 400 360" width="100%" height="100%" style={{ display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id="ragLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c1} stopOpacity="0" />
          <stop offset="0.5" stopColor={c1} stopOpacity="0.9" />
          <stop offset="1" stopColor={c2} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="translate(20,40)">
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={i * 4} y={i * 4} width="80" height="104" rx="6"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" />
        ))}
        <g transform="translate(12,12)" opacity="0.7">
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x="0" y={i * 14} width={56 - i * 4} height="3" rx="1.5" fill={c1} fillOpacity={0.45 - i * 0.05} />
          ))}
        </g>
      </g>
      <g transform="translate(120,90)">
        <line x1="0" y1="0" x2="80" y2="0" stroke="url(#ragLine)" strokeWidth="1.5" />
        {[15, 35, 55, 70].map(x => (
          <circle key={x} cx={x} cy="0" r="3" fill={c1}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" begin={`${x * 0.02}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <g transform="translate(220,40)">
        <rect x="0" y="0" width="160" height="180" rx="14"
          fill="rgba(15,18,32,0.6)" stroke={c1} strokeOpacity="0.4" strokeWidth="1" />
        <text x="14" y="24" fontFamily="ui-monospace,monospace" fontSize="10" fill={c1} fillOpacity="0.85" letterSpacing="0.1em">VECTOR_DB</text>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
          const row = Math.floor(i / 4), col = i % 4
          return (
            <g key={i} transform={`translate(${14 + col * 36},${40 + row * 36})`}>
              <rect width="30" height="30" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              <circle cx="15" cy="15" r="3" fill={i % 3 === 0 ? c2 : c1} fillOpacity={0.4 + (i % 4) * 0.15}>
                <animate attributeName="r" values="2;4;2" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
              </circle>
            </g>
          )
        })}
      </g>
      <g transform="translate(20,260)">
        <rect x="0" y="0" width="360" height="80" rx="12"
          fill="rgba(15,18,32,0.6)" stroke="rgba(255,255,255,0.08)" />
        <text x="14" y="22" fontFamily="ui-monospace,monospace" fontSize="10" fill={c2} fillOpacity="0.95">Q:</text>
        <text x="32" y="22" fontFamily="ui-monospace,monospace" fontSize="10" fill="#e2e8f0" fillOpacity="0.85">retrieve relevant docs about pricing…</text>
        <text x="14" y="44" fontFamily="ui-monospace,monospace" fontSize="10" fill={c1} fillOpacity="0.95">A:</text>
        <rect x="32" y="36" width="200" height="3" rx="1.5" fill={c1} fillOpacity="0.5" />
        <rect x="32" y="44" width="260" height="3" rx="1.5" fill={c1} fillOpacity="0.35" />
        <rect x="32" y="52" width="180" height="3" rx="1.5" fill={c1} fillOpacity="0.25" />
        <text x="14" y="72" fontFamily="ui-monospace,monospace" fontSize="9" fill="rgba(148,163,184,0.7)">source: docs/pricing.md · 0.91 cos · re-ranked #1</text>
      </g>
    </svg>
  )
}

function VisualN8N({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg viewBox="0 0 400 360" width="100%" height="100%" style={{ display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id="n8nWire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c1} stopOpacity="0.8" />
          <stop offset="1" stopColor={c2} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#n8nWire)" strokeWidth="1.5" opacity="0.85">
        <path d="M 110,80 C 150,80 170,160 210,160" />
        <path d="M 110,80 C 150,80 170,220 210,220" />
        <path d="M 302,160 C 340,160 340,260 200,290" />
        <path d="M 302,220 C 340,220 340,260 200,290" />
      </g>
      <g>
        <circle r="3" fill={c1}><animateMotion dur="2.6s" repeatCount="indefinite" path="M 110,80 C 150,80 170,160 210,160" /></circle>
        <circle r="3" fill={c2}><animateMotion dur="2.6s" begin="0.6s" repeatCount="indefinite" path="M 110,80 C 150,80 170,220 210,220" /></circle>
        <circle r="3" fill={c1}><animateMotion dur="2.6s" begin="1.1s" repeatCount="indefinite" path="M 302,160 C 340,160 340,260 200,290" /></circle>
      </g>
      {([
        [20, 56, 'Webhook', 'POST /order'],
        [210, 136, 'AI Agent', 'Claude 3.5'],
        [210, 196, 'DB Query', 'inventory'],
        [154, 268, 'Notify', 'LINE + Email'],
      ] as [number, number, string, string][]).map(([x, y, label, sub]) => (
        <g key={label} transform={`translate(${x},${y})`}>
          <rect x="0" y="0" width="92" height="46" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
          <circle cx="14" cy="23" r="4" fill={c1} opacity="0.85">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="26" y="22" fontFamily="ui-monospace,monospace" fontSize="9" fill="#e2e8f0" fontWeight="600">{label}</text>
          <text x="26" y="34" fontFamily="ui-monospace,monospace" fontSize="8" fill="rgba(148,163,184,0.7)">{sub}</text>
        </g>
      ))}
      <g transform="translate(20,300)">
        <rect width="100" height="20" rx="10" fill="rgba(52,211,153,0.10)" stroke="rgba(52,211,153,0.4)" />
        <circle cx="12" cy="10" r="3" fill="#34d399">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <text x="22" y="14" fontFamily="ui-monospace,monospace" fontSize="9" fill="#a7f3d0">RUNNING · 28s</text>
      </g>
    </svg>
  )
}

function VisualClaude({ c1, c2 }: { c1: string; c2: string }) {
  const nodes = [
    { x: 70,  y: 80,  label: 'Design',   sub: 'Figma · UI' },
    { x: 330, y: 80,  label: 'Code',     sub: 'Cursor · IDE' },
    { x: 330, y: 240, label: 'n8n',      sub: 'Workflow' },
    { x: 70,  y: 240, label: 'Database', sub: 'pgvector · SQL' },
  ]
  return (
    <svg viewBox="0 0 400 360" width="100%" height="100%" style={{ display: 'block' }} aria-hidden>
      <defs>
        <radialGradient id="claudeOrb" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.4" stopColor={c1} />
          <stop offset="1" stopColor={c2} stopOpacity="0.4" />
        </radialGradient>
      </defs>
      {nodes.map((n, i) => (
        <line key={i} x1={n.x} y1={n.y} x2="200" y2="160"
          stroke={c1} strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 4" />
      ))}
      {nodes.map((n, i) => (
        <g key={`p${i}`}>
          <circle r="3" fill={c1}>
            <animate attributeName="opacity" values="0;1;0" dur="2.6s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animateMotion dur="2.6s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={`M ${n.x},${n.y} L 200,160`} />
          </circle>
          <circle r="2" fill={c2}>
            <animate attributeName="opacity" values="0;0.9;0" dur="2.6s" begin={`${i * 0.5 + 1.3}s`} repeatCount="indefinite" />
            <animateMotion dur="2.6s" begin={`${i * 0.5 + 1.3}s`} repeatCount="indefinite" path={`M 200,160 L ${n.x},${n.y}`} />
          </circle>
        </g>
      ))}
      <g transform="translate(200,160)">
        <circle r="80" fill={c1} fillOpacity="0.08" />
        <circle r="60" fill="url(#claudeOrb)" opacity="0.9" />
        <circle r="60" fill="none" stroke={c1} strokeOpacity="0.55" />
        <circle r="74" fill="none" stroke={c1} strokeOpacity="0.2" strokeDasharray="2 6">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="22s" repeatCount="indefinite" />
        </circle>
        <text textAnchor="middle" y="-2" fontFamily="sans-serif" fontSize="18" fontWeight="600" fill="#fff" opacity="0.95">Claude</text>
        <text textAnchor="middle" y="14" fontFamily="ui-monospace, monospace" fontSize="9" fill={c1} opacity="0.85" letterSpacing="0.16em">CORE AGENT</text>
      </g>
      {nodes.map(n => (
        <g key={n.label} transform={`translate(${n.x},${n.y})`}>
          <rect x="-46" y="-22" width="92" height="44" rx="10" fill="rgba(15,18,32,0.78)" stroke={c1} strokeOpacity="0.4" />
          <text x="-6" y="-2" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#fff">{n.label}</text>
          <text x="-6" y="12" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="rgba(148,163,184,0.85)">{n.sub}</text>
          <circle cx="40" cy="-12" r="3" fill="#34d399">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <g transform="translate(20,322)">
        <rect width="360" height="26" rx="13" fill="rgba(15,18,32,0.6)" stroke="rgba(255,255,255,0.06)" />
        {['Design', 'Code', 'n8n', 'DB'].map((step, i) => {
          const x = 18 + i * 88
          return (
            <g key={step}>
              <text x={x} y="17" fontFamily="ui-monospace, monospace" fontSize="10" fill={i === 0 ? c1 : '#e2e8f0'} fontWeight="600">{step}</text>
              {i < 3 && (
                <>
                  <line x1={x + 46} y1="13" x2={x + 72} y2="13" stroke={c1} strokeOpacity="0.4" />
                  <text x={x + 58} y="17" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill={c1}>→</text>
                  <circle r="2" fill={c2}>
                    <animateMotion dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={`M ${x + 46},13 L ${x + 72},13`} />
                    <animate attributeName="opacity" values="0;1;0" dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  </circle>
                </>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

function VisualVibe({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg viewBox="0 0 400 360" width="100%" height="100%" style={{ display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id="vibeFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <g transform="translate(20,30)">
        <rect width="220" height="120" rx="12" fill="rgba(15,18,32,0.7)" stroke="rgba(255,255,255,0.12)" />
        <rect x="0" y="0" width="220" height="22" rx="12" fill="rgba(255,255,255,0.04)" />
        <circle cx="10" cy="11" r="3" fill="#ef4444" opacity="0.7" />
        <circle cx="22" cy="11" r="3" fill="#f59e0b" opacity="0.7" />
        <circle cx="34" cy="11" r="3" fill="#10b981" opacity="0.7" />
        <text x="200" y="14" fontFamily="ui-monospace,monospace" fontSize="9" fill="rgba(148,163,184,0.7)" textAnchor="end">prompt.md</text>
        <g transform="translate(14,40)" fontFamily="ui-monospace,monospace" fontSize="10" fill="#e2e8f0">
          <text y="0">{'> 我要一個'}<tspan fill={c1}>{'會員後台'}</tspan></text>
          <text y="16">{'> 帶'}<tspan fill={c2}>{'登入'}</tspan>{' / '}<tspan fill={c2}>{'消費紀錄'}</tspan></text>
          <text y="32">{'> 風格 '}<tspan fill={c1}>warm</tspan>{' · '}<tspan fill={c1}>少裝飾</tspan></text>
          <text y="48" fill="rgba(148,163,184,0.7)">_</text>
        </g>
      </g>
      <g transform="translate(244,90)">
        <line x1="0" y1="0" x2="40" y2="0" stroke={c1} strokeWidth="1.5" />
        <polyline points="34,-5 40,0 34,5" stroke={c1} strokeWidth="1.5" fill="none" />
        <text y="-10" x="20" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill={c2}>vibe</text>
      </g>
      <g transform="translate(290,30)">
        <rect width="90" height="120" rx="12" fill="url(#vibeFill)" opacity="0.18" />
        <rect width="90" height="120" rx="12" fill="none" stroke={c1} strokeOpacity="0.5" />
        <circle cx="22" cy="32" r="11" fill="rgba(255,255,255,0.18)" />
        <rect x="40" y="24" width="38" height="6" rx="3" fill="rgba(255,255,255,0.6)" />
        <rect x="40" y="36" width="24" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="12" y="56" width="66" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
        <rect x="12" y="66" width="54" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="12" y="76" width="60" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="12" y="98" width="50" height="14" rx="7" fill={c1} fillOpacity="0.8" />
      </g>
      <g transform="translate(20,180)">
        <rect width="360" height="150" rx="12" fill="rgba(15,18,32,0.7)" stroke="rgba(255,255,255,0.10)" />
        <text x="14" y="22" fontFamily="ui-monospace,monospace" fontSize="10" fill={c1} letterSpacing="0.1em" fontWeight="600">BUILD LOG · live</text>
        {[
          { c: '#34d399', t: '✓ generated MemberLayout.tsx' },
          { c: '#34d399', t: '✓ wired auth.signIn() to /api/login' },
          { c: c2,        t: '⚙ rebuilding OrderHistory…' },
          { c: c1,        t: '◐ writing PaymentMethod card' },
          { c: 'rgba(148,163,184,0.7)', t: '· tailwind: 14 utilities added' },
        ].map((l, i) => (
          <text key={i} x="14" y={42 + i * 16} fontFamily="ui-monospace,monospace" fontSize="9" fill={l.c}>{l.t}</text>
        ))}
      </g>
    </svg>
  )
}

function DotGrid() {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.6) 1px, transparent 1px)',
      backgroundSize: '26px 26px',
      opacity: 0.07,
      borderRadius: 'inherit',
    }} />
  )
}

function SlideCard({
  slide,
  pointer,
  active,
}: {
  slide: typeof SLIDES[number]
  pointer: { nx: number; ny: number }
  active: boolean
}) {
  const [c1, c2] = slide.accent
  return (
    <div style={{
      position: 'absolute', inset: 0,
      borderRadius: 28,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 28px 80px rgba(0,0,0,0.55), 0 0 70px rgba(124,92,255,0.16)',
      backdropFilter: 'blur(14px)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${c1}, ${c2})`,
        boxShadow: `0 0 22px ${c1}AA`,
      }} />
      <DotGrid />

      <div style={{
        position: 'relative', height: '100%',
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        gap: 36,
        padding: 44,
      }}>
        {/* Left copy */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 999,
              background: `linear-gradient(135deg, ${c1}22, ${c2}22)`,
              border: `1px solid ${c1}55`,
              fontSize: 10, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: c1,
              marginBottom: 24,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c1, boxShadow: `0 0 8px ${c1}` }} />
              {slide.key}
            </div>
            <h3 style={{
              fontSize: 'clamp(2rem, 4.4vw, 3.2rem)',
              lineHeight: 1.05, fontWeight: 600,
              letterSpacing: '-0.025em',
              color: '#fff',
              margin: '0 0 14px 0',
            }}>
              {slide.chinese}
            </h3>
            <p style={{
              fontSize: 18, lineHeight: 1.5, fontWeight: 500,
              margin: 0,
              background: `linear-gradient(90deg, ${c1}, ${c2})`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {slide.tagline}
            </p>
            <p style={{
              fontSize: 14, lineHeight: 1.85,
              color: '#94a3b8',
              margin: '20px 0 0 0', maxWidth: 460,
            }}>{slide.desc}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {slide.chips.map(c => (
                <span key={c} style={{
                  display: 'inline-block',
                  fontSize: 11, fontWeight: 500,
                  letterSpacing: '0.04em',
                  padding: '5px 11px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.10)',
                  fontFamily: 'ui-monospace, monospace',
                }}>{c}</span>
              ))}
            </div>
            <a href="/blog" style={{
              fontSize: 13, color: c1, fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              看相關文章
              <span style={{ display: 'inline-block', transition: 'transform 200ms', transform: active ? 'translateX(3px)' : 'translateX(0)' }}>→</span>
            </a>
          </div>
        </div>

        {/* Right visual */}
        <div style={{
          position: 'relative',
          borderRadius: 18,
          background: 'rgba(2,3,10,0.4)',
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          {slide.visual === 'rag'    && <VisualRAG c1={c1} c2={c2} />}
          {slide.visual === 'n8n'   && <VisualN8N c1={c1} c2={c2} />}
          {slide.visual === 'claude' && <VisualClaude c1={c1} c2={c2} />}
          {slide.visual === 'vibe'  && <VisualVibe c1={c1} c2={c2} />}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(380px circle at ${50 + pointer.nx * 30}% ${50 + pointer.ny * 30}%, ${c1}33, transparent 60%)`,
            mixBlendMode: 'plus-lighter' as const,
            opacity: active ? 1 : 0.4,
            transition: 'opacity 300ms',
          }} />
        </div>
      </div>
    </div>
  )
}

function SideHint({ side, slide, onClick }: { side: 'left' | 'right'; slide: typeof SLIDES[number]; onClick: () => void }) {
  const [c1] = slide.accent
  const isLeft = side === 'left'
  return (
    <button
      onClick={onClick}
      aria-label={`${isLeft ? 'Previous' : 'Next'}: ${slide.key}`}
      style={{
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        [isLeft ? 'left' : 'right']: -16,
        width: 80, height: 200,
        background: 'transparent', border: 'none', padding: 0,
        cursor: 'pointer', opacity: 0.6,
        transition: 'opacity 200ms',
        zIndex: 10,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.6' }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', gap: 8,
        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
      }}>
        <span style={{ fontSize: 18, color: c1 }}>{isLeft ? '←' : '→'}</span>
        <span style={{
          writingMode: 'vertical-rl' as const,
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10, letterSpacing: '0.24em',
          color: '#cbd5e1', textOrientation: 'mixed' as const,
        }}>{slide.key}</span>
      </div>
    </button>
  )
}

export default function HomeCarousel() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const len = SLIDES.length
  const next = () => setIdx(i => (i + 1) % len)
  const prev = () => setIdx(i => (i - 1 + len) % len)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window & { __jumpToSlide?: (key: string) => void }).__jumpToSlide = (key: string) => {
        const i = SLIDES.findIndex(s => s.key === key)
        if (i >= 0) {
          setIdx(i); setPaused(true); setHighlight(true)
          setTimeout(() => setHighlight(false), 1100)
        }
      }
    }
    return () => { if (typeof window !== 'undefined') delete (window as Window & { __jumpToSlide?: (key: string) => void }).__jumpToSlide }
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5200)
    return () => clearInterval(t)
  }, [paused, len])

  const slide = SLIDES[idx]
  const [c1] = slide.accent
  const { ref: tiltRef, style: tiltStyle, active, pointer } = useTilt({ max: 5, scale: 1.0, perspective: 1600 })

  const navBtn: React.CSSProperties = {
    width: 38, height: 38, borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#cbd5e1', fontSize: 16, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'border-color 200ms, color 200ms',
  }

  return (
    <section id="skills" style={{ position: 'relative', padding: '60px 0 100px', scrollMarginTop: 24 }}>
      <style>{`@keyframes dotFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 24, marginBottom: 32, flexWrap: 'wrap' as const,
        }}>
          <div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ height: 1, width: 28, background: 'linear-gradient(90deg, transparent, #7c5cff)', flexShrink: 0 }} />
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase' as const,
                background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>What I work with</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
              fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', margin: 0,
            }}>
              我正在深入的四件事
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#94a3b8', letterSpacing: '0.12em' }}>
              <span style={{ color: '#fff' }}>{String(idx + 1).padStart(2, '0')}</span> / {String(len).padStart(2, '0')}
            </span>
            <button onClick={prev} aria-label="Previous" style={navBtn}>←</button>
            <button onClick={next} aria-label="Next" style={navBtn}>→</button>
          </div>
        </div>

        {/* Stage */}
        <div
          ref={tiltRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            position: 'relative', height: 460,
            boxShadow: highlight ? `0 0 0 2px ${c1}cc, 0 0 60px ${c1}66` : 'none',
            borderRadius: 28,
            transition: 'box-shadow 700ms ease-out',
          }}
        >
          <div style={{
            ...tiltStyle,
            position: 'absolute', inset: 0,
            borderRadius: 28,
            overflow: 'hidden',
          }}>
            {SLIDES.map((s, i) => {
              const isActive = i === idx
              const offset = ((i - idx) % len + len) % len
              return (
                <div key={s.key} style={{
                  position: 'absolute', inset: 0,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0)' : (offset === 1 ? 'translateX(60px)' : 'translateX(-60px)'),
                  transition: 'opacity 700ms cubic-bezier(.2,.7,.2,1), transform 700ms cubic-bezier(.2,.7,.2,1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}>
                  <SlideCard slide={s} pointer={pointer} active={active} />
                </div>
              )
            })}
          </div>

          <SideHint side="left" slide={SLIDES[(idx - 1 + len) % len]} onClick={prev} />
          <SideHint side="right" slide={SLIDES[(idx + 1) % len]} onClick={next} />
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 28 }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setIdx(i)}
              aria-label={`Go to ${s.key}`}
              style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
            >
              <div style={{
                position: 'relative',
                width: i === idx ? 42 : 8, height: 8, borderRadius: 999,
                background: i === idx ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.10)',
                transition: 'width 350ms cubic-bezier(.2,.7,.2,1), background 200ms',
                overflow: 'hidden',
              }}>
                {i === idx && !paused && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(90deg, ${s.accent[0]}, ${s.accent[1]})`,
                    transformOrigin: 'left',
                    animation: 'dotFill 5.2s linear forwards',
                    borderRadius: 999,
                  }} />
                )}
                {i === idx && paused && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(90deg, ${s.accent[0]}, ${s.accent[1]})`,
                    borderRadius: 999, opacity: 0.55,
                  }} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
