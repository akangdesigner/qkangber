'use client'

import { useState } from 'react'
import Image from 'next/image'

/* ─── icons ─── */
function TeacherIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="p-teacher-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      {/* mortarboard cap */}
      <polygon
        points="16,6 28,12 16,18 4,12"
        fill={active ? 'url(#p-teacher-grad)' : 'none'}
        stroke={active ? '#fff' : '#a78bfa'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 14.5 L9 21 Q16 25 23 21 L23 14.5"
        fill={active ? 'rgba(167,139,250,0.25)' : 'none'}
        stroke={active ? '#fff' : '#a78bfa'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line x1="28" y1="12" x2="28" y2="20" stroke={active ? '#67e8f9' : '#6366f1'} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28" cy="21" r="1.5" fill={active ? '#67e8f9' : '#6366f1'} />
    </svg>
  )
}

function MonitorIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="p-monitor-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* screen */}
      <rect x="3" y="5" width="26" height="18" rx="2"
        fill={active ? 'url(#p-monitor-grad)' : 'none'}
        stroke={active ? '#fff' : '#22d3ee'}
        strokeWidth="1.5"
        opacity={active ? 0.3 : 1}
      />
      {/* chart bars inside */}
      <rect x="7" y="14" width="3" height="6" rx="1" fill={active ? '#67e8f9' : '#22d3ee'} opacity="0.9" />
      <rect x="12" y="11" width="3" height="9" rx="1" fill={active ? '#93c5fd' : '#60a5fa'} opacity="0.9" />
      <rect x="17" y="9" width="3" height="11" rx="1" fill={active ? '#c4b5fd' : '#a78bfa'} opacity="0.9" />
      <rect x="22" y="13" width="3" height="7" rx="1" fill={active ? '#67e8f9' : '#22d3ee'} opacity="0.9" />
      {/* alert dot */}
      <circle cx="26" cy="7" r="3" fill={active ? '#f87171' : '#ef4444'} />
      {/* stand */}
      <line x1="16" y1="23" x2="16" y2="27" stroke={active ? '#fff' : '#22d3ee'} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="27" x2="21" y2="27" stroke={active ? '#fff' : '#22d3ee'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MarketingIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="p-marketing-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      {/* n8n-style node: left circle */}
      <circle cx="6" cy="16" r="4"
        fill={active ? 'url(#p-marketing-grad)' : 'none'}
        stroke={active ? '#f97316' : '#78350f'}
        strokeWidth="1.5"
      />
      {/* middle node */}
      <rect x="13" y="12" width="6" height="8" rx="2"
        fill={active ? 'rgba(249,115,22,0.3)' : 'none'}
        stroke={active ? '#fbbf24' : '#78350f'}
        strokeWidth="1.5"
      />
      {/* right node */}
      <circle cx="26" cy="16" r="4"
        fill={active ? 'rgba(251,191,36,0.25)' : 'none'}
        stroke={active ? '#fbbf24' : '#78350f'}
        strokeWidth="1.5"
      />
      {/* connector lines */}
      <line x1="10" y1="16" x2="13" y2="16" stroke={active ? '#f97316' : '#78350f'} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="16" x2="22" y2="16" stroke={active ? '#fbbf24' : '#78350f'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function NewsletterIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="p-newsletter-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>
      {/* clock / schedule trigger */}
      <circle cx="8" cy="16" r="5"
        fill={active ? 'rgba(34,197,94,0.2)' : 'none'}
        stroke={active ? '#22c55e' : '#14532d'}
        strokeWidth="1.5"
      />
      <path d="M8 13v3.5l2 1.5" stroke={active ? '#22c55e' : '#14532d'} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* connector */}
      <line x1="13" y1="16" x2="17" y2="16" stroke={active ? '#22c55e' : '#14532d'} strokeWidth="1.5" strokeLinecap="round" />
      {/* envelope / email */}
      <rect x="17" y="11" width="11" height="9" rx="1.5"
        fill={active ? 'url(#p-newsletter-grad)' : 'none'}
        stroke={active ? '#86efac' : '#14532d'}
        strokeWidth="1.5"
        opacity={active ? 0.9 : 1}
      />
      <path d="M17 12.5l5.5 4 5.5-4" stroke={active ? '#fff' : '#14532d'} strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function SparklesIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="p-spark-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M16 4 L17.6 12.4 L26 14 L17.6 15.6 L16 24 L14.4 15.6 L6 14 L14.4 12.4 Z"
        fill={active ? 'url(#p-spark-grad)' : 'none'}
        stroke={active ? '#fbbf24' : '#92400e'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M26 4 L26.8 7.2 L30 8 L26.8 8.8 L26 12 L25.2 8.8 L22 8 L25.2 7.2 Z"
        fill={active ? '#fbbf24' : 'none'}
        stroke={active ? '#fbbf24' : '#92400e'}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="25" r="1.5" fill={active ? '#fbbf24' : '#92400e'} />
    </svg>
  )
}

/* ─── tab pill ─── */
function TabPill({
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
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 20px',
        minWidth: 220,
        borderRadius: 14,
        border: active
          ? '1px solid rgba(167,139,250,0.5)'
          : '1px solid rgba(255,255,255,0.07)',
        background: active
          ? 'linear-gradient(135deg, rgba(37,99,235,0.20), rgba(139,92,246,0.20) 60%, rgba(34,211,238,0.08))'
          : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        color: '#fff',
        fontFamily: 'inherit',
        boxShadow: active
          ? '0 0 0 1px rgba(124,92,255,0.3), 0 12px 32px rgba(124,92,255,0.25), inset 0 1px 0 rgba(255,255,255,0.10)'
          : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        transition: 'all 200ms ease',
        transform: active ? 'translateY(-1px)' : 'none',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          display: 'grid',
          placeItems: 'center',
          background: active
            ? 'linear-gradient(135deg, #2563eb, #6366f1 50%, #8b5cf6)'
            : 'rgba(255,255,255,0.04)',
          border: active ? 'none' : '1px solid rgba(167,139,250,0.15)',
          boxShadow: active
            ? '0 0 20px rgba(124,92,255,0.5), inset 0 1px 0 rgba(255,255,255,0.18)'
            : 'none',
          flexShrink: 0,
          transition: 'all 200ms',
        }}
      >
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: active ? '#fff' : '#94a3b8',
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 10,
            color: active ? 'rgba(199,210,254,0.75)' : 'rgba(148,163,184,0.5)',
            fontFamily: 'var(--font-jetbrains), monospace',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {sub}
        </span>
      </div>
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 14,
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06), transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </button>
  )
}

/* ─── status badge ─── */
function StatusBadge({ status }: { status: '已上線' | '開發中' }) {
  const isLive = status === '已上線'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontFamily: 'var(--font-jetbrains), monospace',
        fontWeight: 600,
        letterSpacing: '0.06em',
        border: isLive
          ? '1px solid rgba(34,197,94,0.4)'
          : '1px solid rgba(251,191,36,0.4)',
        background: isLive
          ? 'rgba(34,197,94,0.08)'
          : 'rgba(251,191,36,0.08)',
        color: isLive ? '#4ade80' : '#fbbf24',
        boxShadow: isLive
          ? '0 0 10px rgba(34,197,94,0.2)'
          : '0 0 10px rgba(251,191,36,0.2)',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: isLive ? '#4ade80' : '#fbbf24',
          boxShadow: isLive
            ? '0 0 6px #4ade80'
            : '0 0 6px #fbbf24',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }}
      />
      {status}
    </span>
  )
}

/* ─── tech chip ─── */
function TechChip({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: 6,
        fontSize: 11,
        fontFamily: 'var(--font-jetbrains), monospace',
        letterSpacing: '0.03em',
        border: '1px solid rgba(99,102,241,0.25)',
        background: 'rgba(99,102,241,0.07)',
        color: '#a5b4fc',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

/* ─── feature row ─── */
function FeatureRow({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>{emoji}</span>
      <div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#e2e8f0',
            display: 'block',
            marginBottom: 2,
          }}
        >
          {title}
        </span>
        <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{desc}</span>
      </div>
    </div>
  )
}

/* ─── browser mockup ─── */
function BrowserMockup({ src, title }: { src: string; title: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid rgba(99,102,241,0.3)',
        overflow: 'hidden',
        boxShadow:
          '0 0 0 1px rgba(99,102,241,0.15), 0 24px 60px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.6)',
        background: '#0a0b14',
      }}
    >
      {/* title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          background: '#0d0e1a',
          borderBottom: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
            <div
              key={c}
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: c,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 5,
            padding: '3px 10px',
            fontSize: 11,
            fontFamily: 'var(--font-jetbrains), monospace',
            color: '#475569',
            letterSpacing: '0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      </div>
      {/* screenshot */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
        <Image
          src={src}
          alt="教師專案管理系統截圖"
          fill
          style={{ objectFit: 'cover', objectPosition: 'top' }}
          sizes="(max-width: 768px) 100vw, 55vw"
          priority
        />
        {/* scan-line overlay for sci-fi feel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
            pointerEvents: 'none',
          }}
        />
        {/* corner brackets */}
        {[
          { top: 8, left: 8 },
          { top: 8, right: 8 },
          { bottom: 8, left: 8 },
          { bottom: 8, right: 8 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 14,
              height: 14,
              borderTop: i < 2 ? '1.5px solid rgba(99,102,241,0.7)' : 'none',
              borderBottom: i >= 2 ? '1.5px solid rgba(99,102,241,0.7)' : 'none',
              borderLeft: i % 2 === 0 ? '1.5px solid rgba(99,102,241,0.7)' : 'none',
              borderRight: i % 2 === 1 ? '1.5px solid rgba(99,102,241,0.7)' : 'none',
              ...pos,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── placeholder for coming soon tab ─── */
function ComingSoon() {
  return (
    <div
      style={{
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* dot grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(99,102,241,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 22,
          color: '#475569',
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <span style={{ color: '#6366f1' }}>//</span>
        <span>&nbsp;更多作品即將上線</span>
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1.1em',
            background: '#6366f1',
            marginLeft: 4,
            animation: 'blink-cursor 1s step-end infinite',
            verticalAlign: 'middle',
          }}
        />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 12,
          color: '#334155',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        status: building
      </p>
    </div>
  )
}

/* ─── main component ─── */
export default function PortfolioTabs() {
  const [active, setActive] = useState<'teaching' | 'monitoring' | 'marketing' | 'newsletter' | 'more'>('teaching')

  const monitoringStack = [
    'Node.js', 'Express', 'React', 'Vite', 'SQLite', 'Docker', 'RESTful API', 'LINE Messaging API',
  ]

  const monitoringFeatures = [
    { emoji: '🕷️', title: '網路爬蟲監控', desc: '自動抓取各平台商品價格，比對自有品牌與市場即時定價' },
    { emoji: '📊', title: '即時數據儀表板', desc: 'React + Vite 前端呈現監控數據，支援圖表與時間軸視覺化' },
    { emoji: '🚨', title: '告警通知系統', desc: '價格異常或庫存變動時自動觸發 LINE 推播通知' },
    { emoji: '⏰', title: '排程任務引擎', desc: 'Node.js 排程定時執行爬蟲，數據自動入庫無需人工介入' },
    { emoji: '📤', title: 'CSV 匯出分析', desc: '商品監控數據一鍵匯出，支援批量比對與離線分析' },
  ]

  const techStack = [
    'React 19', 'Vite', 'Supabase', 'Groq API',
    'Claude API', 'Google Calendar API', 'LINE Bot', 'TailwindCSS',
  ]

  const features = [
    { emoji: '🎓', title: '學生進度管理', desc: '試聽 / 進行中 / 已完成三階段追蹤，一覽無遺' },
    { emoji: '🤖', title: 'AI 助理', desc: '自然語言輸入課程紀錄，Groq 解析成結構化資料' },
    { emoji: '📅', title: 'Google Calendar 同步', desc: '課程自動寫入 / 讀取個人行事曆' },
    { emoji: '📄', title: '自動報告生成', desc: 'Claude API 生成諮詢報告、課程摘要，匯出 Word / PPT' },
    { emoji: '🔔', title: 'LINE Bot 通知', desc: '每日早 8 點推送當日課程提醒' },
  ]

  return (
    <>
      {/* global keyframes */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '80px 24px 120px',
        }}
      >
        {/* ── hero ── */}
        <div style={{ marginBottom: 56 }}>
          <p
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              letterSpacing: '0.18em',
              color: '#4f46e5',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            PORTFOLIO
          </p>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 58px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              marginBottom: 14,
            }}
          >
            作品集
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', letterSpacing: '-0.01em' }}>
            每個專案都是解決真實問題的工具
          </p>
        </div>

        {/* ── tab pills ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 48,
          }}
        >
          <TabPill
            active={active === 'teaching'}
            icon={<TeacherIcon active={active === 'teaching'} />}
            label="教師專案管理系統"
            sub="prod · 2025"
            onClick={() => setActive('teaching')}
          />
          <TabPill
            active={active === 'monitoring'}
            icon={<MonitorIcon active={active === 'monitoring'} />}
            label="產品監控系統"
            sub="dev · 2026"
            onClick={() => setActive('monitoring')}
          />
          <TabPill
            active={active === 'marketing'}
            icon={<MarketingIcon active={active === 'marketing'} />}
            label="行銷文章生成工作流"
            sub="n8n · 2026"
            onClick={() => setActive('marketing')}
          />
          <TabPill
            active={active === 'newsletter'}
            icon={<NewsletterIcon active={active === 'newsletter'} />}
            label="新聞電子報工作流"
            sub="n8n · 2026"
            onClick={() => setActive('newsletter')}
          />
          <TabPill
            active={active === 'more'}
            icon={<SparklesIcon active={active === 'more'} />}
            label="更多作品"
            sub="coming soon"
            onClick={() => setActive('more')}
          />
        </div>

        {/* ── separator ── */}
        <div
          style={{
            height: 1,
            background:
              'linear-gradient(90deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2) 40%, transparent)',
            marginBottom: 48,
          }}
        />

        {/* ── project content ── */}
        {active === 'teaching' && (
          <div key="teaching" style={{ animation: 'fade-in-up 300ms ease both' }}>

            {/* ── row 1: title + mockup ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,45fr) minmax(0,55fr)',
                gap: 48,
                alignItems: 'start',
                marginBottom: 40,
              }}
              className="portfolio-grid"
            >
              {/* left: title block */}
              <div style={{ order: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <StatusBadge status="已上線" />
                </div>
                <h2 style={{
                  fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700,
                  color: '#fff', letterSpacing: '-0.02em', marginBottom: 8,
                }}>
                  教師專案管理系統
                </h2>
                <p style={{
                  fontSize: 13, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#6366f1', letterSpacing: '0.02em', marginBottom: 24,
                }}>
                  「一個人的補習班後台，AI 幫你記課、寫報告、推通知」
                </p>
                {/* tech stack */}
                <div>
                  <p style={{
                    fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                    color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                    marginBottom: 10,
                  }}>TECH STACK</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {techStack.map((t) => <TechChip key={t} label={t} />)}
                  </div>
                </div>
              </div>

              {/* right: browser mockup */}
              <div style={{ order: 1 }}>
                <BrowserMockup
                  src="/works/teaching-preview.jpg"
                  title="教學管理系統 · localhost:5173"
                />
              </div>
            </div>

            {/* ── row 2: 核心用途 + 重點功能 ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
              }}
              className="portfolio-blocks"
            >
              {/* 核心用途 */}
              <div style={{
                padding: '28px 28px 28px 28px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#6366f1', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  marginBottom: 14,
                }}>// 核心用途</p>
                <p style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.5, marginBottom: 12 }}>
                  1 對 1 線上教師的全功能後台
                </p>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>
                  市面上沒有專為獨立教師設計的管理工具——學生都在 LINE 上，課程紀錄在筆記本，提醒得自己記。這個系統就是為了補上這個缺口。
                </p>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8 }}>
                  用自然語言說「今天跟小明上了代數」，AI 自動解析成結構化紀錄；下課後 Claude 生成當堂摘要；隔天早上 LINE Bot 提醒你今天有哪些學生要上課。
                </p>
              </div>

              {/* 重點功能 */}
              <div style={{
                padding: '28px 28px 28px 28px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#6366f1', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  marginBottom: 14,
                }}>// 重點功能</p>
                <div>
                  {features.map((f) => <FeatureRow key={f.title} {...f} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {active === 'monitoring' && (
          <div key="monitoring" style={{ animation: 'fade-in-up 300ms ease both' }}>

            {/* row 1: title + mockup */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,45fr) minmax(0,55fr)',
                gap: 48,
                alignItems: 'start',
                marginBottom: 40,
              }}
              className="portfolio-grid"
            >
              {/* left */}
              <div style={{ order: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <StatusBadge status="開發中" />
                  <a
                    href="https://github.com/akangdesigner/productmonitoring"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '3px 10px', borderRadius: 999,
                      fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace',
                      color: '#94a3b8', letterSpacing: '0.04em',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      textDecoration: 'none',
                      transition: 'color 150ms, border-color 150ms',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = '#e2e8f0'
                      el.style.borderColor = 'rgba(255,255,255,0.18)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = '#94a3b8'
                      el.style.borderColor = 'rgba(255,255,255,0.08)'
                    }}
                  >
                    <svg viewBox="0 0 16 16" width={12} height={12} fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    GitHub
                  </a>
                </div>
                <h2 style={{
                  fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700,
                  color: '#fff', letterSpacing: '-0.02em', marginBottom: 8,
                }}>
                  產品監控系統
                </h2>
                <p style={{
                  fontSize: 13, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#22d3ee', letterSpacing: '0.02em', marginBottom: 24,
                }}>
                  「自動盯盤、價格追蹤、異常即推播——讓資料替你守夜」
                </p>
                <div>
                  <p style={{
                    fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                    color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                    marginBottom: 10,
                  }}>TECH STACK</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {monitoringStack.map((t) => (
                      <span key={t} style={{
                        padding: '3px 10px', borderRadius: 6,
                        fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace',
                        letterSpacing: '0.03em',
                        border: '1px solid rgba(34,211,238,0.25)',
                        background: 'rgba(34,211,238,0.06)',
                        color: '#67e8f9',
                        whiteSpace: 'nowrap' as const,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* right: screenshot mockup */}
              <div style={{ order: 1 }}>
                <BrowserMockup
                  src="/works/monitoring-preview.jpg"
                  title="產品比價監控台 · Beauty Intel v1.0"
                />
              </div>
            </div>

            {/* row 2: 核心用途 + 重點功能 */}
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
              className="portfolio-blocks"
            >
              <div style={{
                padding: '28px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#22d3ee', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  marginBottom: 14,
                }}>// 核心用途</p>
                <p style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.5, marginBottom: 12 }}>
                  自有品牌的 24hr 自動守價機器人
                </p>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>
                  人工盯競品價格又費時又容易漏接——這套系統讓爬蟲替你持續監控各平台商品售價與庫存，比對自有品牌定價，一旦發現異常立即推播通知。
                </p>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8 }}>
                  三層架構設計讓資料存取、業務邏輯、前端展示完全解耦，新增監控平台只需加一個 scraper module，不影響其他層。以微服務思想打造，可獨立擴展任一層。
                </p>
              </div>

              <div style={{
                padding: '28px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#22d3ee', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  marginBottom: 14,
                }}>// 重點功能</p>
                <div>
                  {monitoringFeatures.map((f) => <FeatureRow key={f.title} {...f} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {active === 'marketing' && (
          <div key="marketing" style={{ animation: 'fade-in-up 300ms ease both' }}>

            {/* row 1: title + workflow canvas */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,42fr) minmax(0,58fr)',
                gap: 48,
                alignItems: 'start',
                marginBottom: 40,
              }}
              className="portfolio-grid"
            >
              {/* left */}
              <div style={{ order: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <StatusBadge status="已上線" />
                </div>
                <h2 style={{
                  fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700,
                  color: '#fff', letterSpacing: '-0.02em', marginBottom: 8,
                }}>
                  行銷文章生成工作流
                </h2>
                <p style={{
                  fontSize: 13, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#f97316', letterSpacing: '0.02em', marginBottom: 24,
                }}>
                  「輸入關鍵字，n8n 自動找資料、生文章、改寫成各平台格式」
                </p>
                <div>
                  <p style={{
                    fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                    color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                    marginBottom: 10,
                  }}>TECH STACK</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {['n8n', 'Webhook', 'Groq API', 'OpenRouter API', 'Google Sheets', 'AI Agent'].map((t) => (
                      <span key={t} style={{
                        padding: '3px 10px', borderRadius: 6,
                        fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace',
                        letterSpacing: '0.03em',
                        border: '1px solid rgba(249,115,22,0.3)',
                        background: 'rgba(249,115,22,0.07)',
                        color: '#fdba74',
                        whiteSpace: 'nowrap' as const,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* right: n8n workflow canvas frame */}
              <div style={{ order: 1 }}>
                <div style={{
                  borderRadius: 12,
                  border: '1px solid rgba(249,115,22,0.3)',
                  overflow: 'hidden',
                  boxShadow: '0 0 0 1px rgba(249,115,22,0.12), 0 24px 60px rgba(249,115,22,0.12), 0 4px 16px rgba(0,0,0,0.6)',
                  background: '#111218',
                }}>
                  {/* n8n-style title bar */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    background: '#0d0e1a',
                    borderBottom: '1px solid rgba(249,115,22,0.2)',
                  }}>
                    <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                      {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
                        <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.85 }} />
                      ))}
                    </div>
                    <div style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 5, padding: '3px 10px',
                      fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace',
                      color: '#475569', letterSpacing: '0.02em',
                    }}>
                      workflow.json · Marketing Article Generator
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '2px 8px', borderRadius: 4,
                      background: 'rgba(249,115,22,0.12)',
                      border: '1px solid rgba(249,115,22,0.25)',
                      fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                      color: '#fb923c', letterSpacing: '0.08em',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
                      active
                    </div>
                  </div>
                  {/* workflow screenshot */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7' }}>
                    <Image
                      src="/works/marketing-workflow.png"
                      alt="行銷文章生成 n8n 工作流截圖"
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      sizes="(max-width: 768px) 100vw, 58vw"
                      priority
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
                      pointerEvents: 'none',
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* row 2: core purpose + features */}
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}
              className="portfolio-blocks"
            >
              <div style={{
                padding: '28px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#f97316', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  marginBottom: 14,
                }}>// 核心用途</p>
                <p style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.5, marginBottom: 12 }}>
                  一鍵從關鍵字到多平台行銷文案
                </p>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>
                  輸入文章標題與關鍵字，Webhook 觸發工作流，n8n 自動網路搜尋相關資料、調用 AI 生成初稿，再依各社群平台邏輯改寫格式。
                </p>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8 }}>
                  建議仍需手動改稿確保文章真實性，但可省下 80% 的初稿時間。最終輸出自動寫回 Google Sheets 存檔。
                </p>
              </div>

              <div style={{
                padding: '28px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#f97316', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  marginBottom: 14,
                }}>// 重點功能</p>
                <div>
                  {[
                    { emoji: '🔎', title: '自動資料蒐集', desc: 'Webhook 接收關鍵字後，n8n 自動搜尋網路相關資訊作為文章素材' },
                    { emoji: '✍️', title: 'AI 初稿生成', desc: '多 LLM 並行（Groq + OpenRouter），依需求選用不同模型生成初稿' },
                    { emoji: '📱', title: '多平台格式改寫', desc: '同一篇文章自動改寫為 Instagram、Facebook、Twitter/X、LINE 各平台格式' },
                    { emoji: '🖼️', title: '配圖生成', desc: '文章生成後觸發圖片生成節點，自動產生封面圖並上傳 Google Drive' },
                    { emoji: '📊', title: 'Sheets 自動存檔', desc: '所有輸出文案與圖片連結自動 append 到 Google Sheets，方便批量管理' },
                  ].map((f) => <FeatureRow key={f.title} {...f} />)}
                </div>
              </div>
            </div>

            {/* row 3: social output gallery */}
            <div>
              <p style={{
                fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                color: '#475569', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                marginBottom: 16,
              }}>// 輸出範例</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="portfolio-blocks">
                {[
                  { src: '/works/marketing-instagram.png', label: 'Instagram', color: '#e1306c' },
                  { src: '/works/marketing-twitter.png',   label: 'Twitter / X', color: '#1d9bf0' },
                ].map(({ src, label, color }) => (
                  <div key={label} style={{
                    borderRadius: 12,
                    border: `1px solid ${color}33`,
                    overflow: 'hidden',
                    boxShadow: `0 0 0 1px ${color}15, 0 12px 32px rgba(0,0,0,0.5)`,
                    background: '#0d0e1a',
                  }}>
                    <div style={{
                      padding: '8px 12px',
                      background: '#0d0e1a',
                      borderBottom: `1px solid ${color}22`,
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{
                        fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                        color, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                      }}>{label}</span>
                    </div>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                      <Image
                        src={src}
                        alt={`${label} 輸出範例`}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                        sizes="(max-width: 768px) 100vw, 45vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === 'newsletter' && (
          <div key="newsletter" style={{ animation: 'fade-in-up 300ms ease both' }}>

            {/* row 1: title + workflow canvas */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,42fr) minmax(0,58fr)',
                gap: 48,
                alignItems: 'start',
                marginBottom: 40,
              }}
              className="portfolio-grid"
            >
              {/* left */}
              <div style={{ order: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <StatusBadge status="已上線" />
                </div>
                <h2 style={{
                  fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700,
                  color: '#fff', letterSpacing: '-0.02em', marginBottom: 8,
                }}>
                  新聞趨勢整合電子報工作流
                </h2>
                <p style={{
                  fontSize: 13, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#22c55e', letterSpacing: '0.02em', marginBottom: 24,
                }}>
                  「每日自動搜尋 AI 議題，整合成可讀新聞摘要寄出」
                </p>
                <div>
                  <p style={{
                    fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                    color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                    marginBottom: 10,
                  }}>TECH STACK</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {['n8n', 'Schedule Trigger', 'Google News', '/scrape', 'Groq API', 'OpenRouter API', 'Google Sheets', 'Gmail'].map((t) => (
                      <span key={t} style={{
                        padding: '3px 10px', borderRadius: 6,
                        fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace',
                        letterSpacing: '0.03em',
                        border: '1px solid rgba(34,197,94,0.3)',
                        background: 'rgba(34,197,94,0.07)',
                        color: '#86efac',
                        whiteSpace: 'nowrap' as const,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* right: n8n workflow canvas */}
              <div style={{ order: 1 }}>
                <div style={{
                  borderRadius: 12,
                  border: '1px solid rgba(34,197,94,0.3)',
                  overflow: 'hidden',
                  boxShadow: '0 0 0 1px rgba(34,197,94,0.12), 0 24px 60px rgba(34,197,94,0.1), 0 4px 16px rgba(0,0,0,0.6)',
                  background: '#111218',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    background: '#0d0e1a',
                    borderBottom: '1px solid rgba(34,197,94,0.2)',
                  }}>
                    <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                      {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
                        <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.85 }} />
                      ))}
                    </div>
                    <div style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 5, padding: '3px 10px',
                      fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace',
                      color: '#475569', letterSpacing: '0.02em',
                    }}>
                      電子報 · workflow.json
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '2px 8px', borderRadius: 4,
                      background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.25)',
                      fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                      color: '#4ade80', letterSpacing: '0.08em',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
                      published
                    </div>
                  </div>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7' }}>
                    <Image
                      src="/works/newsletter-workflow.png"
                      alt="新聞電子報 n8n 工作流截圖"
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                      sizes="(max-width: 768px) 100vw, 58vw"
                      priority
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
                      pointerEvents: 'none',
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* row 2: core purpose + features */}
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}
              className="portfolio-blocks"
            >
              <div style={{
                padding: '28px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#22c55e', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  marginBottom: 14,
                }}>// 核心用途</p>
                <p style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.5, marginBottom: 12 }}>
                  AI 新聞自動追蹤 + 電子報全自動生成
                </p>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>
                  Schedule Trigger 每日定時啟動，同步抓取三個 Google News 頻道的最新 AI 議題，自動爬取各文章全文，再交由 AI 整合成有觀點的摘要。
                </p>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.8 }}>
                  整合完成後格式化成電子報，寫入 Google Sheets 存檔，並透過 Gmail 自動寄送給訂閱者。底部 Webhook 節點支援訂閱者動態新增至名單。
                </p>
              </div>

              <div style={{
                padding: '28px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                  color: '#22c55e', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  marginBottom: 14,
                }}>// 重點功能</p>
                <div>
                  {[
                    { emoji: '⏰', title: '每日排程觸發', desc: 'Schedule Trigger 定時啟動，無需手動操作，每天自動執行一次' },
                    { emoji: '📰', title: '多源 Google News 搜尋', desc: '平行抓取三個搜尋頻道，覆蓋 AI 工具發布、研究動態、產業趨勢' },
                    { emoji: '🕷️', title: '全文爬蟲', desc: '/scrape 節點抓取文章原文，AI 有足夠內容生成有深度的摘要' },
                    { emoji: '🤖', title: 'AI 雙模型摘要', desc: 'Groq + OpenRouter 並行處理，確保輸出品質與速度平衡' },
                    { emoji: '📧', title: 'Gmail 自動發送', desc: '整合完成後直接寄出，支援訂閱者名單管理，Webhook 動態新增訂閱' },
                  ].map((f) => <FeatureRow key={f.title} {...f} />)}
                </div>
              </div>
            </div>

            {/* row 3: email output preview */}
            <div>
              <p style={{
                fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                color: '#475569', letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                marginBottom: 16,
              }}>// 輸出範例</p>
              <div style={{
                borderRadius: 12,
                border: '1px solid rgba(34,197,94,0.25)',
                overflow: 'hidden',
                boxShadow: '0 0 0 1px rgba(34,197,94,0.1), 0 12px 32px rgba(0,0,0,0.5)',
                background: '#0d0e1a',
                maxWidth: 860,
              }}>
                <div style={{
                  padding: '8px 14px',
                  background: '#0d0e1a',
                  borderBottom: '1px solid rgba(34,197,94,0.15)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                    color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                  }}>Gmail · Q kangber 週報</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace',
                    color: '#475569',
                  }}>2026-05-11</span>
                </div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                  <Image
                    src="/works/newsletter-email.png"
                    alt="Q kangber 週報電子報輸出截圖"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    sizes="(max-width: 768px) 100vw, 860px"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {active === 'more' && (
          <div
            key="more"
            style={{ animation: 'fade-in-up 300ms ease both' }}
          >
            <ComingSoon />
          </div>
        )}
      </div>

      {/* responsive override */}
      <style>{`
        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }
          .portfolio-grid > *:first-child {
            order: 1 !important;
          }
          .portfolio-grid > *:last-child {
            order: 0 !important;
          }
          .portfolio-blocks {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
