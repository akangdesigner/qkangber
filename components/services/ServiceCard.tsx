'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Service } from '@/types/content'

function PulseBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      borderRadius: 999,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 10, letterSpacing: '0.12em',
      color: '#fde68a',
      background: 'rgba(251,191,36,0.10)',
      boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.30)',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: '#fbbf24', boxShadow: '0 0 6px rgba(251,191,36,0.9)',
        animation: 'specPulse 1.6s ease-in-out infinite',
        display: 'inline-block',
      }} />
      POPULAR
    </span>
  )
}

function KpiHero({
  metric,
  kpis,
  accent,
  accent2,
}: {
  metric: { before: string; after: string; label: string }
  kpis: [string, string, string][]
  accent: string
  accent2: string
}) {
  const others = kpis.filter(([label]) => label !== metric.label).slice(0, 2)
  return (
    <div style={{
      padding: '12px 18px 14px',
      borderRadius: 10,
      background: 'rgba(2,3,10,0.65)',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: '#475569', marginBottom: 12,
      }}>預期效益估算</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 18, alignItems: 'center',
      }}>
      <div>
        <div style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#64748b', marginBottom: 4,
        }}>{metric.label}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 11, color: '#64748b',
          textDecoration: 'line-through',
          textDecorationColor: 'rgba(248,113,113,0.55)',
          marginBottom: 2,
        }}>{metric.before}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 28, fontWeight: 600,
          background: `linear-gradient(135deg, ${accent}, ${accent2})`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>{metric.after}</div>
      </div>
      <div style={{
        borderLeft: '1px dashed rgba(255,255,255,0.08)',
        paddingLeft: 16,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {others.map(([label, , after]) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 12,
          }}>
            <span style={{
              fontFamily: '"Noto Sans TC", sans-serif',
              fontSize: 11.5, color: '#94a3b8',
            }}>{label}</span>
            <span style={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 12, fontWeight: 600, color: accent,
            }}>{after}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default function ServiceCard({ service }: { service: Service }) {
  const [hover, setHover] = useState(false)
  const accent = service.accent ?? '#a78bfa'
  const accent2 = service.accent2 ?? '#67e8f9'

  return (
    <>
      <style>{`@keyframes specPulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }`}</style>
      <Link
        href={`/services/${service.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          display: 'block',
          borderRadius: 14,
          background: 'rgba(8,9,16,0.55)',
          boxShadow: hover
            ? `inset 0 0 0 1px ${accent}55, 0 24px 60px -20px rgba(0,0,0,0.7), 0 0 80px -30px ${accent}66`
            : 'inset 0 0 0 1px rgba(255,255,255,0.07), 0 18px 40px -24px rgba(0,0,0,0.5)',
          transition: 'box-shadow 240ms, transform 240ms',
          transform: hover ? 'translateY(-2px)' : 'none',
          textDecoration: 'none',
          color: '#e2e8f0',
          overflow: 'hidden',
        }}
      >
        {/* Sweeping top accent bar */}
        <div aria-hidden style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: 3,
          background: `linear-gradient(90deg, ${accent}, ${accent2})`,
          transformOrigin: 'left',
          transform: hover ? 'scaleX(1)' : 'scaleX(0.18)',
          opacity: hover ? 1 : 0.75,
          transition: 'transform 320ms ease-out, opacity 240ms',
          zIndex: 3,
        }} />

        {/* Image banner */}
        <div style={{
          position: 'relative',
          height: 180,
          background: 'rgba(2,3,10,0.55)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}>
          {service.previewImage ? (
            <Image
              src={service.previewImage}
              alt={service.title}
              fill
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 12,
              borderRadius: 8,
              border: `1.5px dashed ${accent}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(2,3,10,0.7)',
                boxShadow: `inset 0 0 0 1px ${accent}55`,
                fontFamily: '"Noto Sans TC", sans-serif',
                fontSize: 12, color: accent, letterSpacing: '0.02em',
              }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>＋</span>
                預覽圖片
              </span>
            </div>
          )}
        </div>
        {/* fade from image into card body */}
        <div aria-hidden style={{
          position: 'absolute',
          left: 0, right: 0,
          top: 180 - 36, height: 40,
          background: 'linear-gradient(to bottom, transparent, rgba(8,9,16,0.55))',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Card body */}
        <div style={{ padding: '20px 28px 22px', position: 'relative', zIndex: 2 }}>
          {/* Category + badge */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: accent, opacity: 0.9,
            }}>{service.category}</span>
            {service.featured && <PulseBadge />}
          </div>

          {/* Title */}
          <h3 style={{
            margin: '0 0 8px 0',
            fontFamily: '"Noto Sans TC", sans-serif',
            fontSize: 22, fontWeight: 600, lineHeight: 1.35,
            color: '#fff', letterSpacing: '-0.01em',
          }}>{service.title.replace(/ —.*$/, '')}</h3>

          {/* Description */}
          <p style={{
            margin: '0 0 22px 0',
            fontFamily: '"Noto Sans TC", sans-serif',
            fontSize: 13, lineHeight: 1.7,
            color: '#94a3b8',
          }}>{service.description}</p>

          {/* KPI Hero block */}
          {service.metric && service.kpis && (
            <KpiHero
              metric={service.metric}
              kpis={service.kpis}
              accent={accent}
              accent2={accent2}
            />
          )}

          {/* Platform chips */}
          {service.platforms && service.platforms.length > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6,
              marginTop: 18, marginBottom: 6,
            }}>
              {service.platforms.map((p) => (
                <span key={p} style={{
                  padding: '3px 9px',
                  borderRadius: 6,
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 10.5,
                  color: '#cbd5e1',
                  background: 'rgba(255,255,255,0.035)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                  letterSpacing: '0.02em',
                }}>{p}</span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 18, paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <span style={{
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 11, color: '#64748b', letterSpacing: '0.12em',
                marginRight: 6,
              }}>NT$</span>
              <span style={{
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 22, fontWeight: 600, color: '#fff',
              }}>{service.price.toLocaleString()}</span>
              {service.priceNote && (
                <span style={{
                  fontFamily: '"Noto Sans TC", sans-serif',
                  fontSize: 12, color: '#64748b', marginLeft: 6,
                }}>{service.priceNote}</span>
              )}
            </div>
            <span style={{
              fontFamily: '"Noto Sans TC", sans-serif',
              fontSize: 13, fontWeight: 500,
              color: accent,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              了解詳情
              <span style={{
                display: 'inline-block',
                transition: 'transform 200ms',
                transform: hover ? 'translateX(4px)' : 'none',
              }}>→</span>
            </span>
          </div>
        </div>
      </Link>
    </>
  )
}
