import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// 動態 OG 圖：每個網址用自己的標題/描述生成專屬預覽圖。
// 由 lib/metadata.ts 的 buildMetadata 自動帶入 title / subtitle / badge / img。
// 帶 img（站內照片路徑）時走「真實照片底圖＋文字覆蓋」卡片版型，否則走純文字版型。

// ImageResponse 內建字型對部分全形符號沒有字元（會渲染成豆腐 □），先換成半形。
const GLYPH_FIXES: [RegExp, string][] = [
  [/＋/g, '+'],
  [/－/g, '-'],
  [/＝/g, '='],
  [/～/g, '~'],
  [/｜/g, '|'],
  [/％/g, '%'],
  [/＆/g, '&'],
  [/＃/g, '#'],
]
function sanitize(text: string): string {
  return GLYPH_FIXES.reduce((t, [re, s]) => t.replace(re, s), text)
}

export function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const title = sanitize((searchParams.get('title') || 'Q kangber').slice(0, 48))
  const subtitle = sanitize(
    (searchParams.get('subtitle') || 'n8n 自動化 · AI Agent · 電商流程工程').slice(0, 90),
  )
  const eyebrow = (searchParams.get('eyebrow') || 'aiqkangber.com').slice(0, 40)
  const badge = (searchParams.get('badge') || '').slice(0, 12)
  // 只接受站內路徑（'/...'），避免被當開放代理拿去渲染任意外部圖
  const imgParam = searchParams.get('img') || ''
  const photo = imgParam.startsWith('/') ? `${origin}${imgParam}` : ''

  const header = (
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
  )

  if (photo) {
    // 照片卡版型：真實照片滿版＋下方漸層壓暗＋標題覆蓋
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: '56px 72px',
            fontFamily: 'sans-serif',
            background: '#080b18',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(8,11,24,0.34)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(180deg, rgba(8,11,24,0) 0%, rgba(8,11,24,0.55) 48%, rgba(8,11,24,0.96) 86%)',
            }}
          />
          {header}
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 22 ? 54 : 66,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.16,
              marginBottom: 18,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#cbd5e1',
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
        {header}
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
