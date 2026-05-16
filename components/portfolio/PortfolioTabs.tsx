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
  const [active, setActive] = useState<'teaching' | 'more'>('teaching')

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
          <div
            key="teaching"
            style={{ animation: 'fade-in-up 300ms ease both' }}
          >
            {/* two-column grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,45fr) minmax(0,55fr)',
                gap: 48,
                alignItems: 'start',
              }}
              className="portfolio-grid"
            >
              {/* left: info */}
              <div style={{ order: 0 }}>
                {/* header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <StatusBadge status="已上線" />
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(22px, 3vw, 28px)',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                  }}
                >
                  教師專案管理系統
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    fontFamily: 'var(--font-jetbrains), monospace',
                    color: '#6366f1',
                    letterSpacing: '0.02em',
                    marginBottom: 16,
                  }}
                >
                  「一個人的補習班後台，AI 幫你記課、寫報告、推通知」
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: '#94a3b8',
                    lineHeight: 1.7,
                    marginBottom: 28,
                  }}
                >
                  專為 1 對 1 線上教師設計的全功能管理系統。用自然語言更新課程紀錄，AI 自動結構化並生成 Word 報告，課程同步 Google Calendar，LINE Bot 每日提醒。
                </p>

                {/* features */}
                <div style={{ marginBottom: 28 }}>
                  {features.map((f) => (
                    <FeatureRow key={f.title} {...f} />
                  ))}
                </div>

                {/* tech stack */}
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--font-jetbrains), monospace',
                      color: '#475569',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: 10,
                    }}
                  >
                    TECH STACK
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {techStack.map((t) => (
                      <TechChip key={t} label={t} />
                    ))}
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
        }
      `}</style>
    </>
  )
}
