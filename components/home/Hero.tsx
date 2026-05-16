'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import ParticleGlobe from './ParticleGlobe'

function ChangelogPill() {
  return (
    <Link
      href="/blog"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '6px 6px 6px 14px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.10)',
        textDecoration: 'none',
        fontSize: 12, color: '#cbd5e1',
        marginBottom: 32,
        backdropFilter: 'blur(8px)',
        transition: 'border-color 200ms, background 200ms',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(167,139,250,0.45)'
        el.style.background = 'rgba(124,92,255,0.08)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(255,255,255,0.10)'
        el.style.background = 'rgba(255,255,255,0.03)'
      }}
    >
      <span style={{
        padding: '2px 8px', borderRadius: 999,
        background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
        color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>NEW</span>
      <span>RAG 系列 · 從 Pinecone 換到 pgvector 的踩坑筆記</span>
      <span style={{ color: '#a78bfa', marginRight: 12 }}>→</span>
    </Link>
  )
}

function HeroFocusStrip() {
  const words = ['N8N 工作流', 'AI Agent', 'RAG 檢索增強', 'Vibe Coding']
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontSize: 11, color: '#94a3b8',
      letterSpacing: '0.16em', textTransform: 'uppercase',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#34d399', boxShadow: '0 0 10px rgba(52,211,153,0.9)',
        }} />
        <span>NOW WORKING ON</span>
      </span>
      <span style={{ position: 'relative', overflow: 'hidden', height: 14, minWidth: 170, display: 'inline-block', verticalAlign: 'middle' }}>
        {words.map((w, i) => (
          <span
            key={w}
            style={{
              position: 'absolute', left: 0, top: 0,
              color: '#c4b5fd', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em',
              transform: i === idx ? 'translateY(0)' : (i < idx ? 'translateY(-100%)' : 'translateY(100%)'),
              opacity: i === idx ? 1 : 0,
              transition: 'transform 500ms cubic-bezier(.2,.7,.2,1), opacity 500ms',
            }}
          >{w}</span>
        ))}
      </span>
    </div>
  )
}

function PartnerMarquee() {
  const items = ['Shopify Co.', 'Hexschool', 'TechCrew', '六角學院', 'AI Lab', 'CoffeeOps', 'BrandX', 'Studio.tw', 'PromptHub', 'Channel A']
  const all = [...items, ...items]
  return (
    <div style={{
      position: 'relative', marginTop: 60, overflow: 'hidden',
      maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
    }}>
      <style>{`@keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      <div style={{
        display: 'flex', gap: 64, whiteSpace: 'nowrap',
        animation: 'marqueeScroll 38s linear infinite',
        width: 'max-content',
      }}>
        {all.map((n, i) => (
          <span key={i} style={{
            fontSize: 14, fontWeight: 500,
            color: 'rgba(255,255,255,0.32)', letterSpacing: '0.04em',
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 2,
              background: 'linear-gradient(135deg, #8b5cf6, #60a5fa)', opacity: 0.4,
            }} />
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      <style>{`
        @keyframes heroLineIn { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ambient spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.22), transparent 65%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(34,211,238,0.10), transparent 60%)',
        height: 900,
      }} />
      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.16) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.35,
        maskImage: 'linear-gradient(180deg, black, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, black, black 60%, transparent 100%)',
      }} />

      <div className="relative max-w-6xl mx-auto px-6" style={{ paddingTop: 80, paddingBottom: 60 }}>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-center" style={{ minHeight: 560 }}>
          {/* Left — copy */}
          <div>
            <div style={{ opacity: 0, transform: 'translateY(10px)', animation: 'heroLineIn 600ms ease-out 60ms forwards' }}>
              <ChangelogPill />
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5.4vw, 4.4rem)',
              lineHeight: 1.08, fontWeight: 600,
              letterSpacing: '-0.03em', color: '#fff',
              margin: '0 0 24px 0',
            }}>
              <span style={{
                display: 'block',
                opacity: 0, transform: 'translateY(18px)',
                animation: 'heroLineIn 700ms cubic-bezier(.2,.7,.2,1) 180ms forwards',
              }}>
                把 AI 接進你的工作流程，
              </span>
              <span style={{
                display: 'block', fontStyle: 'italic',
                opacity: 0, transform: 'translateY(18px)',
                animation: 'heroLineIn 700ms cubic-bezier(.2,.7,.2,1) 360ms forwards',
                background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                讓自動化真正發生。
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
              lineHeight: 1.85, color: '#94a3b8', maxWidth: 480,
              margin: '0 0 36px 0',
              opacity: 0, animation: 'heroLineIn 700ms ease-out 540ms forwards',
            }}>
              專注於 N8N 工作流、AI Agent、RAG 與提示詞架構。把 LLM 從 demo 帶進你日常營運的 production 流程裡。
            </p>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28,
              opacity: 0, animation: 'heroLineIn 700ms ease-out 700ms forwards',
            }}>
              <Link
                href="/services"
                className="inline-flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #6366f1 50%, #8b5cf6)',
                  color: '#fff', borderRadius: 999,
                  padding: '13px 26px', fontSize: 14, fontWeight: 500,
                  textDecoration: 'none',
                  boxShadow: '0 10px 32px rgba(124,92,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'transform 200ms, box-shadow 200ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-1px)'
                  el.style.boxShadow = '0 14px 38px rgba(124,92,255,0.55), inset 0 1px 0 rgba(255,255,255,0.25)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 10px 32px rgba(124,92,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                免費訂閱電子報 →
              </Link>
              <Link
                href="/blog"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 999, padding: '13px 26px', fontSize: 14, fontWeight: 500,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 200ms, color 200ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(167,139,250,0.45)'
                  el.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.10)'
                  el.style.color = '#e2e8f0'
                }}
              >
                先看看文章
              </Link>
            </div>

            <div style={{ opacity: 0, animation: 'heroLineIn 700ms ease-out 820ms forwards' }}>
              <HeroFocusStrip />
            </div>
          </div>

          {/* Right — particle globe */}
          <div className="relative lg:-mr-20" style={{
            height: 'clamp(420px, 52vw, 580px)',
            opacity: 0, animation: 'heroLineIn 1000ms ease-out 400ms forwards',
          }}>
            <ParticleGlobe />
          </div>
        </div>

        <PartnerMarquee />
      </div>
    </section>
  )
}
