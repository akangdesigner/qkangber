import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// 動態 OG 圖：每個網址用自己的標題/描述生成專屬預覽圖。
// 由 lib/metadata.ts 的 buildMetadata 自動帶入 title / subtitle / badge。
export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'Q kangber').slice(0, 48)
  const subtitle = (
    searchParams.get('subtitle') || 'n8n 自動化 · AI Agent · 電商流程工程'
  ).slice(0, 90)
  const eyebrow = (searchParams.get('eyebrow') || 'aiqkangber.com').slice(0, 40)
  const badge = (searchParams.get('badge') || '').slice(0, 12)

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
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
          {badge ? (
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#080b18',
                background: '#fbbf24',
                borderRadius: 999,
                padding: '4px 18px',
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 22 ? 60 : 76,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.12,
            marginBottom: 28,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#94a3b8',
            lineHeight: 1.5,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
