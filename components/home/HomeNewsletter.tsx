'use client'
import { useTilt } from '@/hooks/useTilt'
import SubscribeForm from '@/components/shared/SubscribeForm'
import type { NewsletterIssue } from '@/lib/newsletter'

const NL = { c1: '#a78bfa', c2: '#67e8f9' }

function DotGrid() {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.6) 1px, transparent 1px)',
      backgroundSize: '26px 26px', opacity: 0.07, borderRadius: 'inherit',
    }} />
  )
}

function IssueCard({
  tone, subject, summary, date, offset = 0, z = 1, scale = 1, opacity = 1,
}: {
  tone: 'next' | 'past'; subject: string; summary: string; date: string
  offset?: number; z?: number; scale?: number; opacity?: number
}) {
  const isNext = tone === 'next'
  return (
    <div style={{
      position: 'absolute',
      left: '50%', top: '50%',
      transform: `translate(-50%, calc(-50% + ${offset}px)) scale(${scale})`,
      width: '100%', maxWidth: 320,
      padding: '18px 20px', borderRadius: 14,
      background: isNext
        ? `linear-gradient(180deg, rgba(167,139,250,0.16), rgba(2,3,10,0.85))`
        : 'rgba(15,18,32,0.85)',
      border: isNext ? `1px solid ${NL.c1}66` : '1px solid rgba(255,255,255,0.08)',
      boxShadow: isNext
        ? `0 20px 40px rgba(0,0,0,0.5), 0 0 40px ${NL.c1}33`
        : '0 8px 20px rgba(0,0,0,0.4)',
      zIndex: z, opacity, backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.16em', color: isNext ? NL.c1 : '#64748b' }}>
          {isNext ? 'UPCOMING' : 'PAST ISSUE'}
        </span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: isNext ? NL.c1 : '#64748b' }}>{date}</span>
      </div>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', margin: '0 0 6px 0', lineHeight: 1.45,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{subject}</p>
      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.6,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{summary}</p>
    </div>
  )
}

function NewsletterVisual({ issues, pointer, active }: {
  issues: NewsletterIssue[]
  pointer: { nx: number; ny: number }
  active: boolean
}) {
  const recent = issues.slice(0, 3)
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg aria-hidden viewBox="0 0 400 320" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="nlSendLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={NL.c1} stopOpacity="0" />
            <stop offset="0.5" stopColor={NL.c1} stopOpacity="0.5" />
            <stop offset="1" stopColor={NL.c2} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="url(#nlSendLine)" strokeWidth="1" />
        <circle r="3" fill={NL.c1}><animateMotion dur="4s" repeatCount="indefinite" path="M 200,0 L 200,320" /></circle>
        <circle r="2" fill={NL.c2}><animateMotion dur="4s" begin="1.6s" repeatCount="indefinite" path="M 200,0 L 200,320" /></circle>
      </svg>

      <div style={{ position: 'relative', width: '100%', maxWidth: 360, height: 280 }}>
        <IssueCard tone="next" subject="AI · Agent · Claude · n8n"
          summary="用開發者與接案者角度，精選本週真正值得關注的 AI、Agent、n8n 與實戰案例。"
          date="每週一更新" offset={0} z={3} scale={1} />
        {recent.map((iss, i) => (
          <IssueCard key={iss.slug} tone="past"
            subject={iss.subject}
            summary={iss.summary}
            date={new Date(iss.date).toLocaleDateString('en-CA')}
            offset={(i + 1) * 18} z={2 - i} scale={1 - (i + 1) * 0.04} opacity={1 - (i + 1) * 0.22}
          />
        ))}
        <div style={{
          position: 'absolute', right: 14, top: -10,
          padding: '5px 10px', borderRadius: 999,
          background: `linear-gradient(135deg, ${NL.c1}, ${NL.c2})`,
          color: '#0b1023', fontFamily: 'ui-monospace, monospace',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
          boxShadow: `0 6px 20px ${NL.c1}66`, zIndex: 5,
        }}>NEXT</div>
      </div>

      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(380px circle at ${50 + pointer.nx * 30}% ${50 + pointer.ny * 30}%, ${NL.c1}33, transparent 60%)`,
        mixBlendMode: 'plus-lighter' as const,
        opacity: active ? 1 : 0.4, transition: 'opacity 300ms', borderRadius: 'inherit',
      }} />
    </div>
  )
}

export default function HomeNewsletter({ issues = [] }: { issues?: NewsletterIssue[] }) {
  const { ref, style: tiltStyle, active, pointer } = useTilt({ max: 5, scale: 1.0, perspective: 1600 })

  return (
    <section id="subscribe" style={{ position: 'relative', padding: '60px 0 100px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 32, flexWrap: 'wrap' as const }}>
          <div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ height: 1, width: 28, background: 'linear-gradient(90deg, transparent, #7c5cff)', flexShrink: 0 }} />
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase' as const,
                background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Weekly Newsletter</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
              每週一封 · 把實戰拆給你看
            </h2>
          </div>
        </div>

        <div ref={ref} style={{ position: 'relative', height: 460, perspective: 1600 }}>
          <div style={{
            ...tiltStyle,
            position: 'absolute', inset: 0,
            borderRadius: 28, overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 28px 80px rgba(0,0,0,0.55), 0 0 70px rgba(124,92,255,0.16)',
            backdropFilter: 'blur(14px)',
          }}>
            <div aria-hidden style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${NL.c1}, ${NL.c2})`,
              boxShadow: `0 0 22px ${NL.c1}AA`,
            }} />
            <DotGrid />

            <div style={{
              position: 'relative', height: '100%',
              display: 'grid', gridTemplateColumns: '1.05fr 1fr',
              gap: 36, padding: 44,
            }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                <div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', borderRadius: 999,
                    background: `linear-gradient(135deg, ${NL.c1}22, ${NL.c2}22)`,
                    border: `1px solid ${NL.c1}55`,
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                    color: NL.c1, marginBottom: 24,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: NL.c1, boxShadow: `0 0 8px ${NL.c1}` }} />
                    NEWSLETTER · 每週一更新
                  </div>
                  <h3 style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', lineHeight: 1.05, fontWeight: 600, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 14px 0' }}>
                    一週一封信
                  </h3>
                  <p style={{ fontSize: 18, lineHeight: 1.5, fontWeight: 500, margin: 0,
                    background: `linear-gradient(90deg, ${NL.c1}, ${NL.c2})`,
                    WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AI 不負責思考，但會幫你省下整週時間。
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.85, color: '#94a3b8', margin: '20px 0 0 0', maxWidth: 460 }}>
                    用開發者與接案者的角度，幫你從 AI、Agent、Claude、OpenAI、n8n 與實戰案例裡篩出真正值得關注的，5 分鐘看完，每週省下數小時整理時間。
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {['AI', 'Agent', 'Claude', 'OpenAI', 'n8n', '實戰案例'].map(c => (
                      <span key={c} style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em',
                        padding: '5px 11px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.04)', color: '#cbd5e1',
                        border: '1px solid rgba(255,255,255,0.10)',
                        fontFamily: 'ui-monospace, monospace',
                      }}>{c}</span>
                    ))}
                  </div>
                  <SubscribeForm />
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0, letterSpacing: '0.04em' }}>
                    免費　·　不灌水　·　隨時可退訂
                  </p>
                </div>
              </div>

              {/* Right */}
              <div style={{
                position: 'relative', borderRadius: 18,
                background: 'rgba(2,3,10,0.4)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
              }}>
                <NewsletterVisual issues={issues} pointer={pointer} active={active} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
