'use client'

import Link from 'next/link'
import type { Post } from '@/types/content'

// Per-tag accent color — only the color varies, layout is always identical
const TAG_THEMES: Record<string, { c1: string; c2: string; mark: string }> = {
  n8n:         { c1: '#60a5fa', c2: '#22d3ee', mark: 'N8' },
  Shopify:     { c1: '#22d3ee', c2: '#60a5fa', mark: 'SH' },
  AI:          { c1: '#f0abfc', c2: '#a78bfa', mark: 'AI' },
  'AI Agent':  { c1: '#f0abfc', c2: '#a78bfa', mark: 'AG' },
  趨勢:        { c1: '#a78bfa', c2: '#67e8f9', mark: 'TR' },
  觀察:        { c1: '#a78bfa', c2: '#67e8f9', mark: 'OB' },
  RAG:         { c1: '#a78bfa', c2: '#60a5fa', mark: 'RG' },
  工具評比:    { c1: '#67e8f9', c2: '#a78bfa', mark: 'VS' },
  教學:        { c1: '#a78bfa', c2: '#22d3ee', mark: 'GD' },
  新手:        { c1: '#a78bfa', c2: '#22d3ee', mark: 'GD' },
  電商:        { c1: '#22d3ee', c2: '#60a5fa', mark: 'EC' },
  物流:        { c1: '#22d3ee', c2: '#60a5fa', mark: 'LG' },
  開發日記:    { c1: '#a78bfa', c2: '#60a5fa', mark: 'DV' },
  工具教學:    { c1: '#67e8f9', c2: '#a78bfa', mark: 'TT' },
  '最新AI趨勢':{ c1: '#f0abfc', c2: '#67e8f9', mark: 'TR' },
}

function themeFor(post: Post) {
  // try primary tag first, then category
  const allKeys = [...post.tags, post.category ?? '']
  for (const t of allKeys) {
    if (TAG_THEMES[t]) return TAG_THEMES[t]
  }
  return { c1: '#a78bfa', c2: '#60a5fa', mark: '··' }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })
}

export default function FeaturedPostCard({ post, idx }: { post: Post; idx: number }) {
  const { c1, c2, mark } = themeFor(post)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
        height: '100%',
        overflow: 'hidden',
        transition: 'background 200ms, border-color 200ms, transform 200ms',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'rgba(255,255,255,0.04)'
        el.style.borderColor = `${c1}55`
        el.style.transform = 'translateY(-2px)'
        const bar = el.querySelector<HTMLElement>('[data-bar]')
        if (bar) bar.style.transform = 'scaleX(1)'
        const title = el.querySelector<HTMLElement>('[data-title]')
        if (title) title.style.color = c1
        const arrow = el.querySelector<HTMLElement>('[data-arrow]')
        if (arrow) arrow.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'rgba(255,255,255,0.025)'
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.transform = 'translateY(0)'
        const bar = el.querySelector<HTMLElement>('[data-bar]')
        if (bar) bar.style.transform = 'scaleX(0)'
        const title = el.querySelector<HTMLElement>('[data-title]')
        if (title) title.style.color = '#fff'
        const arrow = el.querySelector<HTMLElement>('[data-arrow]')
        if (arrow) arrow.style.transform = 'translateX(0)'
      }}
    >
      {/* Top accent bar — slides in from left on hover */}
      <span
        data-bar
        aria-hidden
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${c1}, ${c2})`,
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          transition: 'transform 300ms ease-out',
          zIndex: 2,
        }}
      />

      {/* Card header: index numeral + dot field + monogram chip */}
      <div style={{
        position: 'relative',
        padding: '22px 22px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}>
        {/* Subtle dot field masked to top-right */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(circle, ${c1} 1px, transparent 1px)`,
            backgroundSize: '12px 12px',
            opacity: 0.18,
            maskImage: 'radial-gradient(120% 100% at 100% 0%, black, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(120% 100% at 100% 0%, black, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          {/* Large stroke index numeral */}
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 44, fontWeight: 300, lineHeight: 1,
            letterSpacing: '-0.04em',
            color: 'transparent',
            WebkitTextStroke: `1px ${c1}aa`,
          }}>
            {String(idx + 1).padStart(2, '0')}
          </div>

          {/* Monogram chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 10px 6px 6px',
            borderRadius: 999,
            background: 'rgba(2,3,10,0.55)',
            border: `1px solid ${c1}44`,
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%',
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
              display: 'inline-grid', placeItems: 'center',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 9, fontWeight: 700, color: '#0b1023',
              letterSpacing: '0.04em',
              boxShadow: `0 0 14px ${c1}66`,
            }}>{mark}</span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: '#e2e8f0',
              letterSpacing: '0.02em',
            }}>{post.tags[0] ?? post.category ?? ''}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          data-title
          style={{
            fontSize: 18, fontWeight: 600,
            lineHeight: 1.45, color: '#fff',
            margin: '0 0 12px 0',
            letterSpacing: '-0.01em',
            transition: 'color 200ms',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}
        >
          {post.title}
        </h3>

        <p style={{
          fontSize: 13, lineHeight: 1.7,
          color: '#94a3b8',
          margin: '0 0 20px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          flex: 1,
        }}>
          {post.excerpt}
        </p>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 11, color: '#64748b',
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          letterSpacing: '0.04em',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span>{formatDate(post.date)}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{post.readingTime}</span>
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: c1, fontWeight: 600,
          }}>
            閱讀
            <span
              data-arrow
              style={{ display: 'inline-block', transition: 'transform 200ms' }}
            >→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
