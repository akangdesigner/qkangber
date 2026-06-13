/* ─────────────────────────────────────────────────────────────
 * 作品集 marquee 帶 — 改寫自 Claude Design「Portfolio Banner · V1
 * Marquee Mosaic」。保留橫向滑動的案例縮圖帶、點陣背景與聚光，
 * 拿掉大字標（hero 由 PortfolioHero 負責，不重複）。
 * 純 CSS 動畫，作品資料對齊下方 PortfolioTabs 的真實專案。
 * ───────────────────────────────────────────────────────────── */

const SANS = 'var(--font-noto), "Noto Sans TC", sans-serif'
const MONO = 'var(--font-jetbrains), ui-monospace, monospace'

type Work = {
  no: string
  title: string
  titleEn: string
  tag: string
  year: string
  metric: string
  accent: string
}

// 對齊 PortfolioTabs 的五個真實專案（accent 沿用各分頁主色）
const WORKS: Work[] = [
  { no: '01', title: '教師專案管理系統', titleEn: 'Teacher Ops System',  tag: 'React · Supabase', year: '2025', metric: '全功能後台',   accent: '#a78bfa' },
  { no: '02', title: '產品監控系統',     titleEn: 'Product Monitor',     tag: 'Node · 爬蟲',      year: '2026', metric: '24h 守價',     accent: '#22d3ee' },
  { no: '03', title: '行銷文章生成工作流', titleEn: 'Marketing Pipeline',  tag: 'n8n · AI Agent',   year: '2026', metric: '多平台改寫',   accent: '#f97316' },
  { no: '04', title: '新聞電子報工作流',  titleEn: 'Newsletter Flow',     tag: 'n8n · Gmail',      year: '2026', metric: '每日自動寄送', accent: '#22c55e' },
  { no: '05', title: 'AICommand 排行榜', titleEn: 'AI Tools Ranking',    tag: 'Next.js · 爬蟲',   year: '2026', metric: '六大社群源',   accent: '#fb7185' },
]

function MarqueeCard({ w }: { w: Work }) {
  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 240,
        height: 150,
        borderRadius: 14,
        padding: 14,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10), 0 12px 30px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* accent bar */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${w.accent}, transparent)`,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: w.accent, letterSpacing: '0.18em' }}>{w.no}</div>
        <div style={{ fontFamily: MONO, fontSize: 9.5, color: '#64748b', letterSpacing: '0.14em' }}>{w.year}</div>
      </div>

      <div>
        <div style={{ fontFamily: SANS, fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
          {w.title}
        </div>
        <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 9.5, color: '#64748b', letterSpacing: '0.12em' }}>
          {w.titleEn}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontFamily: SANS, fontSize: 10.5, color: '#94a3b8' }}>{w.tag}</div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: w.accent, fontWeight: 600 }}>{w.metric}</div>
      </div>
    </div>
  )
}

export default function PortfolioMarquee() {
  // 複製一份做無縫循環
  const loop = [...WORKS, ...WORKS]

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        background: '#02030a',
        color: '#fff',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
      aria-label="作品集精選滑動帶"
    >
      <style>{`
        @keyframes pmqMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pmqPulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
        @media (prefers-reduced-motion: reduce) {
          .pmq-track { animation: none !important; }
        }
      `}</style>

      {/* dot grid background */}
      <svg
        aria-hidden
        width="100%"
        height="100%"
        viewBox="0 0 1180 320"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }}
      >
        <defs>
          <radialGradient id="pmq-dg" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 13 }, (_, row) =>
          Array.from({ length: 50 }, (_, col) => {
            const x = 20 + col * 24 + (row % 2 ? 12 : 0)
            const y = 16 + row * 24
            const dist = Math.hypot(x - 900, y - 160)
            const r = Math.max(0.5, 1.6 - dist / 500)
            return <circle key={`${row}-${col}`} cx={x} cy={y} r={r} fill="url(#pmq-dg)" />
          })
        )}
      </svg>

      {/* spotlight */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 80% 70% at 18% 20%, rgba(124,92,255,0.16), transparent 60%),' +
            'radial-gradient(ellipse 70% 60% at 100% 90%, rgba(34,211,238,0.10), transparent 60%)',
        }}
      />

      {/* top meta bar */}
      <div
        style={{
          position: 'relative',
          maxWidth: 1180,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          padding: '36px 24px 0',
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(124,92,255,0.10)',
            boxShadow: 'inset 0 0 0 1px rgba(124,92,255,0.35)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#a78bfa',
              boxShadow: '0 0 8px #a78bfa',
              animation: 'pmqPulse 1.6s ease-in-out infinite',
            }}
          />
          <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#c4b5fd' }}>
            作品集 · SELECTED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: MONO, fontSize: 11, color: '#64748b', letterSpacing: '0.16em' }}>
          <span>2025 — 2026</span>
          <span style={{ color: '#334155' }}>/</span>
          <span style={{ color: '#94a3b8' }}>5 PROJECTS</span>
          <span style={{ color: '#334155' }}>/</span>
          <span>真實上線</span>
        </div>
      </div>

      {/* marquee strip */}
      <div
        style={{
          position: 'relative',
          marginTop: 22,
          padding: '14px 0',
          zIndex: 3,
          maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        }}
      >
        <div className="pmq-track" style={{ display: 'flex', gap: 18, width: 'max-content', animation: 'pmqMarquee 38s linear infinite' }}>
          {loop.map((w, i) => (
            <MarqueeCard key={i} w={w} />
          ))}
        </div>
      </div>

      {/* bottom tagline + CTA */}
      <div
        style={{
          position: 'relative',
          maxWidth: 1180,
          margin: '0 auto',
          // 底部留多一點空間，讓「查看專案細節」CTA 不被右下角浮動聊天 widget 蓋到
          padding: '14px 24px 96px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          zIndex: 3,
        }}
      >
        <p style={{ margin: 0, maxWidth: 460, fontFamily: SANS, fontSize: 15, lineHeight: 1.7, color: '#94a3b8' }}>
          這些是我做過、留下痕跡的工作。把工具串成自動化的脈絡，再用 AI 接上判斷與表達。
        </p>

        <a
          href="#portfolio-detail"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 26px',
            borderRadius: 6,
            background: 'transparent',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.6)',
            fontFamily: SANS,
            fontSize: 14.5,
            fontWeight: 500,
            letterSpacing: '0.02em',
            textDecoration: 'none',
          }}
        >
          查看專案細節
          <span style={{ color: '#a78bfa' }}>→</span>
        </a>
      </div>
    </section>
  )
}
