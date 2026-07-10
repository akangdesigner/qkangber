// ─────────────────────────────────────────────────────────────
// 服務頁 Hero — 桌機／手機分流
//   桌機（>860px）：舊版——左文案＋右側浮動 n8n 流程視窗與 AI 助理對話。
//   手機（≤860px）：新版 RWD——「觸發 → 流程 → 輸出」三階段流程面板直向堆疊。
// 用 CSS media query 切換（兩份都預先渲染，無 hydration 閃爍）。純 CSS/SVG。
// ─────────────────────────────────────────────────────────────
import Link from 'next/link'

const MONO = 'var(--font-jetbrains), "JetBrains Mono", ui-monospace, monospace'
const SANS = 'var(--font-noto), "Noto Sans TC", sans-serif'

/* ══════════════ 桌機舊版：浮動視窗 hero ══════════════ */

function DotWaveBg() {
  const dots: React.ReactNode[] = []
  for (let row = 0; row < 26; row++) {
    for (let col = 0; col < 36; col++) {
      const x = 80 + col * 28 + (row % 2 ? 14 : 0)
      const y = 16 + row * 18
      const dist = Math.hypot(x - 900, y - 170)
      const r = Math.max(0.6, 2.0 - dist / 350)
      dots.push(<circle key={`${row}-${col}`} cx={x} cy={y} r={r} fill="url(#hb-dot-grad)" />)
    }
  }
  return (
    <svg aria-hidden width="100%" height="100%" viewBox="0 0 1100 460"
      preserveAspectRatio="xMaxYMid slice"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="hb-dot-grad" cx="80%" cy="35%" r="55%">
          <stop offset="0" stopColor="#f0abfc" stopOpacity="1" />
          <stop offset="0.4" stopColor="#a78bfa" stopOpacity="1" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <mask id="hb-wave-mask">
          <rect width="100%" height="100%" fill="#000" />
          <ellipse cx="900" cy="170" rx="420" ry="230" fill="#fff" />
          <ellipse cx="1050" cy="350" rx="320" ry="220" fill="#fff" opacity="0.6" />
        </mask>
      </defs>
      <g mask="url(#hb-wave-mask)">{dots}</g>
      <path d="M 1100 60 Q 700 140, 760 460" stroke="#f0abfc" strokeOpacity="0.4"
        strokeWidth="1" fill="none" strokeDasharray="2 8">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="3.2s" repeatCount="indefinite" />
      </path>
      <path d="M 1100 200 Q 820 300, 850 460" stroke="#a78bfa" strokeOpacity="0.5"
        strokeWidth="1" fill="none" strokeDasharray="2 6">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2.6s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function WorkflowScreen() {
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 18,
      background: 'linear-gradient(160deg, #0b1023 0%, #0a0a1a 100%)',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10), 0 18px 40px rgba(124,92,255,0.30), 0 0 0 1px rgba(124,92,255,0.20)',
      padding: 14, overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171' }} />
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24' }} />
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
        <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 8.5, color: '#67e8f9', letterSpacing: '0.12em' }}>n8n · live</span>
      </div>
      <svg viewBox="0 0 192 160" width="100%" height="160">
        <defs>
          <linearGradient id="ws-grad" x1="0" y1="0" x2="192" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#67e8f9" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <path d="M 30 40 C 60 40, 60 100, 96 100" stroke="url(#ws-grad)" strokeWidth="1.2" fill="none" />
        <path d="M 96 100 C 132 100, 132 60, 162 60" stroke="url(#ws-grad)" strokeWidth="1.2" fill="none" />
        <path d="M 96 100 C 132 100, 132 130, 162 130" stroke="url(#ws-grad)" strokeWidth="1.2" fill="none" />
        {([
          [30, 40, '#67e8f9'],
          [96, 100, '#a78bfa'],
          [162, 60, '#f0abfc'],
          [162, 130, '#34d399'],
        ] as [number, number, string][]).map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="12" fill="#0a0a1a" stroke={c} strokeWidth="1.2" />
            <circle cx={x} cy={y} r="4" fill={c} style={{ filter: `drop-shadow(0 0 6px ${c})` }} />
          </g>
        ))}
        <circle r="2" fill="#67e8f9">
          <animateMotion dur="2.6s" repeatCount="indefinite">
            <mpath href="#ws-arc" />
          </animateMotion>
        </circle>
        <path id="ws-arc" d="M 30 40 C 60 40, 60 100, 96 100" fill="none" stroke="none" />
      </svg>
      <div style={{ marginTop: 2, fontFamily: MONO, fontSize: 9.5, color: '#94a3b8', textAlign: 'center' }}>order.received → check_stock → notify</div>
    </div>
  )
}

function Bubble({ side, children }: { side: 'user' | 'bot'; children: React.ReactNode }) {
  const isUser = side === 'user'
  return (
    <div style={{
      maxWidth: '80%', padding: '6px 10px', borderRadius: 8,
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      background: isUser ? 'rgba(124,92,255,0.25)' : 'rgba(255,255,255,0.05)',
      boxShadow: isUser ? 'inset 0 0 0 1px rgba(167,139,250,0.4)' : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
      color: '#e2e8f0', fontFamily: SANS, fontSize: 9.5, lineHeight: 1.5,
    }}>{children}</div>
  )
}

function AIScreen() {
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 20,
      background: 'linear-gradient(160deg, #1a1230 0%, #0a0a1a 100%)',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10), 0 24px 50px rgba(124,92,255,0.45), 0 0 0 1px rgba(167,139,250,0.30)',
      padding: 14, overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 7,
          background: 'linear-gradient(135deg, #a78bfa, #7c5cff)',
          display: 'grid', placeItems: 'center', fontSize: 13, color: '#fff',
        }}>✦</div>
        <div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: '#fff', fontWeight: 600, lineHeight: 1 }}>AI 助理</div>
          <div style={{ fontFamily: MONO, fontSize: 7.5, color: '#67e8f9', letterSpacing: '0.10em', marginTop: 2 }}>● Claude / GPT</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bubble side="user">這筆訂單是 VIP？</Bubble>
        <Bubble side="bot">是的，過去 12 個月消費 {'>'} 5 萬，已自動標記 VIP 流程。</Bubble>
        <Bubble side="bot">已發送專屬包裝通知給倉庫 ✓</Bubble>
      </div>
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.65), transparent)',
        animation: 'hbScan 3.6s ease-in-out infinite', pointerEvents: 'none',
      }} />
    </div>
  )
}

function PlatformRing() {
  return (
    <div aria-hidden style={{
      position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
      width: 360, height: 360, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,92,255,0.55) 0%, rgba(124,92,255,0.18) 35%, transparent 60%)',
        filter: 'blur(8px)',
      }} />
      <div style={{
        position: 'absolute', bottom: 30, left: '50%',
        transform: 'translateX(-50%) perspective(400px) rotateX(70deg)',
        width: 280, height: 280, borderRadius: '50%',
        boxShadow: 'inset 0 0 0 2px rgba(167,139,250,0.7), inset 0 0 30px rgba(167,139,250,0.45), 0 0 40px rgba(124,92,255,0.5)',
      }} />
      <div style={{
        position: 'absolute', bottom: 60, left: '50%',
        transform: 'translateX(-50%) perspective(400px) rotateX(70deg)',
        width: 200, height: 200, borderRadius: '50%',
        boxShadow: 'inset 0 0 0 1px rgba(103,232,249,0.5), 0 0 20px rgba(103,232,249,0.4)',
      }} />
    </div>
  )
}

function DesktopHero() {
  return (
    <section style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', minHeight: 520, overflow: 'hidden' }}>
        <DotWaveBg />
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 0% 30%, rgba(124,92,255,0.22), transparent 60%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(34,211,238,0.10), transparent 60%)',
        }} />
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, #02030a 0%, transparent 12%, transparent 88%, #02030a 100%)',
        }} />

        <div style={{
          position: 'relative', maxWidth: 1180, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
          alignItems: 'center', gap: 40, padding: '80px 44px', minHeight: 520,
        }}>
          {/* LEFT: copy */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '5px 12px', borderRadius: 999,
              background: 'rgba(124,92,255,0.10)', boxShadow: 'inset 0 0 0 1px rgba(124,92,255,0.35)',
              marginBottom: 22,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', animation: 'hbPulse 1.6s ease-in-out infinite' }} />
              <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#c4b5fd' }}>整合服務 · 接案中</span>
            </div>

            <h1 style={{
              margin: 0, fontFamily: SANS, fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.15, fontWeight: 600, color: '#fff', letterSpacing: '-0.025em',
            }}>
              AI 幫你處理<br />
              <span style={{
                background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>你不該浪費時間的事</span>
            </h1>

            <p style={{ margin: '20px 0 0', fontFamily: SANS, fontSize: 15, lineHeight: 1.8, color: '#94a3b8', maxWidth: 440 }}>
              n8n 流程自動化、Claude AI 應用開發——從重複性作業到智慧判斷，每個環節都可以設計得更好。
            </p>

            <div style={{ marginTop: 30 }}>
              <Link href="/contact" className="btn btn--ink-outline">
                <span className="btn__label">免費諮詢</span>
                <span className="btn__arrow">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: floating screens */}
          <div style={{ position: 'relative', height: 380, display: 'grid', placeItems: 'center' }}>
            <PlatformRing />
            <div style={{ position: 'relative', width: 380, height: 280 }}>
              <div style={{ position: 'absolute', left: 0, top: 20, width: 220, height: 240, animation: 'hbFloat 4.2s ease-in-out infinite' }}>
                <WorkflowScreen />
              </div>
              <div style={{ position: 'absolute', right: 0, top: 0, width: 220, height: 260, animation: 'hbFloat2 4.8s ease-in-out infinite' }}>
                <AIScreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════ 手機新版：三階段流程 hero ══════════════ */

function MobileHero() {
  return (
    <section style={{ position: 'relative', width: '100%', overflow: 'hidden', fontFamily: SANS }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 55% at 30% -10%, rgba(124,92,255,0.20), transparent 68%)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(148,163,184,1) 1px, transparent 1px)',
        backgroundSize: '26px 26px', opacity: 0.03,
      }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '48px 20px 40px' }}>
        {/* copy */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 9,
          padding: '6px 15px', borderRadius: 999, marginBottom: 20,
          border: '1px solid rgba(124,92,255,0.3)', background: 'rgba(124,92,255,0.07)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
          <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#c4b5fd' }}>整合服務 · 接案中</span>
        </div>

        <h1 style={{ margin: '0 0 16px', fontFamily: SANS, fontSize: '2rem', lineHeight: 1.16, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff' }}>
          AI 幫你處理<br />
          <span style={{
            background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>你不該浪費時間的事</span>
        </h1>

        <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.8, color: '#94a3b8' }}>
          n8n 流程自動化、Claude AI 應用開發——從重複性作業到智慧判斷，每個環節都可以設計得更好。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
          <Link href="/contact" className="btn btn--ink" style={{ width: '100%' }}>
            <span className="btn__dot" />
            <span className="btn__label">免費諮詢</span>
            <span className="btn__arrow">→</span>
          </Link>
          <Link href="#services" className="btn btn--ink-outline" style={{ width: '100%' }}>
            <span className="btn__label">看服務項目</span>
          </Link>
        </div>

      </div>
    </section>
  )
}

/* ══════════════ 分流：桌機 / 手機 ══════════════ */

export default function HeroBanner() {
  return (
    <>
      <style>{`
        @keyframes hbPulse  { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes hbFloat  { 0%,100% { transform:rotate(-8deg) translateY(0) } 50% { transform:rotate(-8deg) translateY(-6px) } }
        @keyframes hbFloat2 { 0%,100% { transform:rotate(6deg) translateY(0) } 50% { transform:rotate(6deg) translateY(-9px) } }
        @keyframes hbScan   { 0% { transform:translateY(-100%) } 100% { transform:translateY(120%) } }
        .svc-svc { transition: border-color .2s ease, background .2s ease, transform .2s ease; }
        .svc-svc:hover { border-color: rgba(167,139,250,0.55) !important; background: rgba(20,22,40,0.95) !important; transform: translateY(-1px); }
        /* 桌機顯示舊版、手機顯示新版三階段 */
        .svc-hero-mobile { display: none; }
        @media (max-width: 860px) {
          .svc-hero-desktop { display: none; }
          .svc-hero-mobile { display: block; }
        }
      `}</style>
      <div className="svc-hero-desktop"><DesktopHero /></div>
      <div className="svc-hero-mobile"><MobileHero /></div>
    </>
  )
}
