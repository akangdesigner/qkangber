import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Q康寶 — n8n 自動化 · AI Agent · 電商流程工程'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080b18',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(124,92,255,0.22), transparent 60%)',
          }}
        />
        <div
          style={{
            fontSize: 18,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#a78bfa',
            marginBottom: 24,
            fontWeight: 600,
          }}
        >
          aiqkangber.com
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Q康寶
        </div>
        <div
          style={{
            fontSize: 30,
            color: '#94a3b8',
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          n8n 自動化 · AI Agent · 電商流程工程
        </div>
      </div>
    ),
    { ...size },
  )
}
