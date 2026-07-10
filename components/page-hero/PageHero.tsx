// ─────────────────────────────────────────────────────────────
// Page heroes (知識庫 / 作品集 / 歷期電子報) — ported from the Claude
// Design "Page Heroes" handoff. Shared full-bleed shell that feathers on
// all four edges into the site background (#05060a) so a hero never reads
// as a contained card. Pure CSS/SVG animation → server component.
//
// Chosen variants:
//   Blog       = Big-Index (cyan)
//   Portfolio  = Split (pink)
//   Newsletter = subscribe-left + astronaut-RIGHT (blue)
// ─────────────────────────────────────────────────────────────
import Image from 'next/image'
import NewsletterSubscribe from './NewsletterSubscribe'

const PH = {
  bg: '#05060a', // match the site background so edges dissolve (design used #02030a)
  violet: '#a78bfa',
  cyan: '#67e8f9',
  pink: '#f0abfc',
  blue: '#60a5fa',
  green: '#34d399',
  white: '#fff',
  text: '#e2e8f0',
  mute: '#94a3b8',
  faint: 'rgba(148,163,184,0.7)',
  mono: 'var(--font-jetbrains), ui-monospace, monospace',
  sans: 'var(--font-noto), "Noto Sans TC", sans-serif',
}

// Four-side feather → dissolves the hero into the page background.
function PHFeather() {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
      background:
        `linear-gradient(to right, ${PH.bg} 0%, transparent 11%, transparent 89%, ${PH.bg} 100%),` +
        `linear-gradient(to bottom, ${PH.bg} 0%, transparent 13%, transparent 87%, ${PH.bg} 100%)`,
    }} />
  )
}

// Violet + per-page accent spotlights + soft dot grid (masked to a soft ellipse).
function PHBackdrop({ accent }: { accent: string }) {
  return (
    <>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(124,92,255,0.20), transparent 70%),' +
          `radial-gradient(ellipse 60% 55% at 85% 20%, ${accent}1f, transparent 68%),` +
          `radial-gradient(ellipse 55% 50% at 12% 90%, ${accent}14, transparent 70%)`,
      }} />
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.16) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: 0.4,
        maskImage: 'radial-gradient(ellipse 78% 70% at 50% 45%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 78% 70% at 50% 45%, black 30%, transparent 100%)',
      }} />
    </>
  )
}

// Editorial corner chrome — domain only (top-right). The section name already
// lives in the pill eyebrow, so the old top-left label was a duplicate.
function CornerMarks() {
  return (
    <div aria-hidden className="ph-corner-url" style={{
      position: 'absolute', top: 22, right: 24, zIndex: 6,
      fontFamily: PH.mono, fontSize: 10.5, letterSpacing: '0.2em',
      color: PH.faint, textTransform: 'lowercase',
    }}>aiqkangber.com</div>
  )
}

function PHEyebrow({ en, accent }: { en: string; accent: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '6px 13px', borderRadius: 999, width: 'fit-content',
      background: `radial-gradient(120% 180% at 50% 50%, ${accent}1c 0%, rgba(2,3,10,0.5) 72%)`,
      boxShadow: `inset 0 0 0 1px ${accent}3a, inset 0 1px 0 rgba(255,255,255,0.05)`,
      backdropFilter: 'blur(8px)',
      fontFamily: PH.mono, fontSize: 10.5, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: '#c4b5fd',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: PH.green, boxShadow: `0 0 10px ${PH.green}` }} />
      {en}
    </div>
  )
}

// ── Motif: scan beam over a brighter dot grid (Blog) ──
function PHScanBeam({ accent }: { accent: string }) {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.26) 1px, transparent 1px)',
        backgroundSize: '26px 26px', opacity: 0.4,
        maskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 25%, transparent 92%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 25%, transparent 92%)',
      }} />
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 130,
        background: `linear-gradient(90deg, transparent, ${accent}55 46%, rgba(255,255,255,0.7) 50%, ${accent}55 54%, transparent)`,
        filter: 'blur(7px)', mixBlendMode: 'screen', animation: 'phSweep 7s linear infinite',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '50%', height: 1,
        background: `linear-gradient(90deg, transparent, ${accent}40 20%, ${accent}40 80%, transparent)`,
        animation: 'phGlow 4s ease-in-out infinite',
      }} />
    </div>
  )
}

// ── Motif: slow aurora wash (Portfolio) ──
function PHAurora({ accent }: { accent: string }) {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', width: '70%', height: '180%', left: '6%', top: '-40%',
        background: 'radial-gradient(closest-side, rgba(124,92,255,0.32), transparent 70%)',
        filter: 'blur(12px)', animation: 'phAurA 19s ease-in-out infinite', mixBlendMode: 'screen',
      }} />
      <div style={{
        position: 'absolute', width: '62%', height: '170%', left: '40%', top: '-35%',
        background: `radial-gradient(closest-side, ${accent}3d, transparent 70%)`,
        filter: 'blur(12px)', animation: 'phAurB 23s ease-in-out infinite', mixBlendMode: 'screen',
      }} />
    </div>
  )
}

// ── Shell every hero wraps in ──
function PHShell({
  accent, motif, children,
}: {
  accent: string
  motif: React.ReactNode; children: React.ReactNode
}) {
  return (
    <section style={{
      position: 'relative', width: '100%',
      minHeight: 'clamp(440px, 58vh, 560px)',
      background: 'transparent', overflow: 'hidden', fontFamily: PH.sans,
      display: 'flex',
    }}>
      <PHBackdrop accent={accent} />
      {motif}
      <CornerMarks />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', alignItems: 'center' }}>
        {children}
      </div>
      <PHFeather />
      <PHStyles />
    </section>
  )
}

// Shared keyframes + responsive grid rules for both heroes.
function PHStyles() {
  return (
    <style>{`
      @keyframes phSweep { 0% { transform: translateX(-12%); } 100% { transform: translateX(112%); } }
      @keyframes phGlow { 0%,100% { opacity: .25; } 50% { opacity: .8; } }
      @keyframes phAurA { 0%,100% { transform: translate(-8%,-18%) scale(1); } 50% { transform: translate(10%,6%) scale(1.15); } }
      @keyframes phAurB { 0%,100% { transform: translate(18%,28%) scale(1.1); } 50% { transform: translate(-14%,-10%) scale(.95); } }
      @keyframes astroWalk {
        0%   { transform: translateY(2px)  rotate(-3.5deg); }
        25%  { transform: translateY(-12px) rotate(0deg); }
        50%  { transform: translateY(2px)  rotate(3.5deg); }
        75%  { transform: translateY(-12px) rotate(0deg); }
        100% { transform: translateY(2px)  rotate(-3.5deg); }
      }
      .astro-walk { animation: astroWalk 4.5s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .astro-walk { animation: none !important; } }

      .ph-inner {
        width: 100%; max-width: 1180px; margin: 0 auto;
        padding: 0 clamp(20px, 5vw, 80px);
        display: grid; align-items: center;
      }
      .ph-grid-bigindex  { grid-template-columns: minmax(0,1.15fr) minmax(0,0.85fr); gap: 56px; }
      .ph-grid-split     { grid-template-columns: minmax(0,1.05fr) minmax(0,1fr); gap: 48px; }
      /* 訂閱欄在左（略寬）、太空人在右 */
      .ph-grid-newsletter { grid-template-columns: minmax(0,1.04fr) minmax(0,1fr); gap: 48px; }

      @media (max-width: 860px) {
        .ph-inner { grid-template-columns: 1fr !important; gap: 32px; padding-top: 96px; padding-bottom: 56px; }
        .ph-rail, .ph-visual { max-width: 440px; }
        .ph-illustration { order: -1; max-width: 360px; margin: 0 auto; }
        /* 訂閱頁太空人：窄欄改成置頂的小尺寸插圖（不再整塊隱藏），避免撐出大空白又保留主視覺 */
        .ph-grid-newsletter .ph-illustration { display: flex !important; max-width: 300px; }
        .nl-disc { min-height: 200px !important; }
        .nl-disc .astro-walk { width: 168px !important; }
      }
      @media (max-width: 560px) {
        .ph-corner-url { display: none; }
      }
    `}</style>
  )
}

// ─────────────────────────────────────────────────────────────
// 知識庫 — Big Index (oversized title left, category rail right)
// ─────────────────────────────────────────────────────────────

type Category = { name: string; count: number }

function BlogCategoryRail({ categories, accent }: { categories: Category[]; accent: string }) {
  return (
    <div style={{
      position: 'relative', borderRadius: 16, padding: '20px 20px 14px',
      background: 'radial-gradient(120% 160% at 50% 0%, rgba(124,92,255,0.10), rgba(2,3,10,0.55) 70%)',
      boxShadow: `inset 0 0 0 1px ${accent}26, inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 56px -28px rgba(124,92,255,0.5)`,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontFamily: PH.mono, fontSize: 10, letterSpacing: '0.22em', color: PH.faint, textTransform: 'uppercase' }}>Filter by</span>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {categories.map((c, i) => (
          <div key={c.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 4px', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: PH.sans, fontSize: 14, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? '#fff' : PH.text,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? accent : 'rgba(148,163,184,0.5)' }} />
              {c.name}
            </span>
            <span style={{ fontFamily: PH.mono, fontSize: 12, color: i === 0 ? accent : PH.faint }}>{String(c.count).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BlogHero({ categories }: { categories: Category[] }) {
  const accent = PH.cyan
  return (
    <PHShell accent={accent} motif={<PHScanBeam accent={accent} />}>
      <div className="ph-inner ph-grid-bigindex">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PHEyebrow en="Knowledge Base" accent={accent} />
          <h1 style={{
            margin: 0, fontFamily: PH.sans,
            fontSize: 'clamp(2.6rem, 7vw, 6rem)', lineHeight: 0.98,
            fontWeight: 600, letterSpacing: '-0.04em', color: PH.white,
          }}>
            AI × n8n<br />知識庫
          </h1>
          <p style={{ margin: 0, fontFamily: PH.sans, fontSize: 15, lineHeight: 1.85, color: PH.mute, maxWidth: 420 }}>
            收錄 n8n 自動化、Vibe Coding、最新 AI 趨勢與 Agent 整合應用——想跟上 AI 時代，這裡都找得到。
          </p>
        </div>
        <div className="ph-rail" style={{ position: 'relative' }}>
          <BlogCategoryRail categories={categories} accent={accent} />
        </div>
      </div>
    </PHShell>
  )
}

// ─────────────────────────────────────────────────────────────
// 歷期電子報 — subscribe LEFT · astronaut RIGHT (neon astronaut over a
// glowing orbit disc). Signature accent: blue. Astronaut is a static
// transparent PNG; the "float/walk" is the pure-CSS `astroWalk` keyframe.
// ─────────────────────────────────────────────────────────────

// Glowing disc + dashed orbit ring (traveling dot) with the astronaut
// floating on top — all CSS/SVG except the transparent PNG.
function NLIllustrationDisc({ accent }: { accent: string }) {
  return (
    <div className="nl-disc" style={{
      position: 'relative', width: '100%', height: '100%', minHeight: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* soft glow behind the astronaut — no hard rim / border, so it reads as a
          diffuse halo rather than a dark bordered bubble */}
      <div aria-hidden style={{
        position: 'absolute', width: 'min(84%, 340px)', aspectRatio: '1', borderRadius: '50%',
        background:
          `radial-gradient(circle at 42% 38%, ${accent}2b, rgba(2,3,10,0) 72%),` +
          `radial-gradient(circle at 70% 78%, ${PH.violet}1c, rgba(2,3,10,0) 70%)`,
        filter: 'blur(6px)',
      }} />
      {/* dashed orbit ring + traveling dot */}
      <svg aria-hidden viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', width: '68%', height: '68%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="nlSubOrbit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.55" />
            <stop offset="1" stopColor={PH.violet} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="200" rx="172" ry="172" fill="none"
          stroke="url(#nlSubOrbit)" strokeWidth="1" strokeDasharray="3 7" />
        <circle r="3.5" fill={accent} style={{ filter: `drop-shadow(0 0 6px ${accent})` }}>
          <animateMotion dur="16s" repeatCount="indefinite" path="M 200,28 A 172,172 0 1,1 199,28" />
        </circle>
      </svg>
      {/* astronaut — static PNG, floats via the astroWalk keyframe */}
      <div className="astro-walk" style={{
        position: 'relative', zIndex: 2, width: 'min(94%, 380px)', aspectRatio: '1 / 1',
        filter: 'drop-shadow(0 18px 24px rgba(2,3,10,0.45))',
      }}>
        <Image
          src="/newsletter/astronaut-centered.png"
          alt="霓虹太空人插圖，漂浮在發光圓盤與虛線軌道環之上"
          fill
          sizes="(max-width: 860px) 360px, 380px"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>
  )
}

export function NewsletterHero() {
  const accent = PH.blue
  return (
    <PHShell accent={accent} motif={<PHAurora accent={accent} />}>
      <div className="ph-inner ph-grid-newsletter">
        {/* LEFT — subscribe */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PHEyebrow en="Newsletter · 每週一" accent={accent} />
          <h1 style={{
            margin: 0, fontFamily: PH.sans,
            fontSize: 'clamp(2.4rem, 4.6vw, 3.5rem)', lineHeight: 1.12,
            fontWeight: 700, letterSpacing: '-0.03em', color: PH.white,
          }}>
            每週精選<br />最值得關注的{' '}
            <span style={{
              background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>AI 動態</span>
          </h1>
          <p style={{ margin: 0, fontFamily: PH.sans, fontSize: 15.5, lineHeight: 1.8, color: PH.mute, maxWidth: 440 }}>
            我用開發者與接案者的角度，幫你判斷哪些資訊真正值得關注，每週省下數小時 AI 資訊整理時間。精選 AI、Agent、Claude、OpenAI、n8n 與實戰案例。
          </p>
          <NewsletterSubscribe />
          <PHMeta items={['5 分鐘讀完', '開發者視角', '免費訂閱']} accent={accent} />
        </div>

        {/* RIGHT — astronaut illustration */}
        <div className="ph-illustration" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <NLIllustrationDisc accent={accent} />
        </div>
      </div>
    </PHShell>
  )
}

// ─────────────────────────────────────────────────────────────
// 作品集 — Split (copy left, project preview card right)
// ─────────────────────────────────────────────────────────────

function PHMeta({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <span key={it} style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          {i > 0 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(148,163,184,0.5)' }} />}
          <span style={{ fontFamily: PH.mono, fontSize: 11.5, letterSpacing: '0.08em', color: i === 0 ? accent : PH.mute }}>{it}</span>
        </span>
      ))}
    </div>
  )
}

function WorkPreviewCard({ accent }: { accent: string }) {
  const rows = [
    { icon: '🎓', label: '學生進度管理', sub: '試聽 / 進行中 / 已完成' },
    { icon: '🤖', label: 'AI 課程紀錄', sub: 'Groq 解析成結構化資料' },
    { icon: '📄', label: '自動報告生成', sub: 'Claude API · Word / PPT' },
  ]
  const stack = ['React 19', 'Supabase', 'Groq', 'Claude API', 'LINE Bot']
  return (
    <div style={{
      width: '100%', maxWidth: 360, borderRadius: 16, overflow: 'hidden',
      background: 'linear-gradient(160deg, #0b1023 0%, #0a0a16 100%)',
      boxShadow: `0 28px 64px rgba(0,0,0,0.6), inset 0 0 0 1px ${accent}3a, 0 0 46px ${accent}1c`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171' }} />
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fbbf24' }} />
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399' }} />
        <span style={{ marginLeft: 'auto', fontFamily: PH.mono, fontSize: 9, letterSpacing: '0.1em', color: accent }}>localhost:5173</span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: PH.sans, fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12 }}>教師專案管理系統</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r) => (
            <div key={r.label} style={{
              display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 10,
              background: 'rgba(255,255,255,0.035)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: 15 }}>{r.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: PH.sans, fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{r.label}</div>
                <div style={{ fontFamily: PH.mono, fontSize: 9, color: PH.faint, marginTop: 2 }}>{r.sub}</div>
              </div>
              <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: PH.green, boxShadow: `0 0 8px ${PH.green}` }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 13 }}>
          {stack.map((s) => (
            <span key={s} style={{ fontFamily: PH.mono, fontSize: 9, color: '#cbd5e1', padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PortfolioHero() {
  const accent = PH.pink
  return (
    <PHShell accent={accent} motif={<PHAurora accent={accent} />}>
      <div className="ph-inner ph-grid-split">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <PHEyebrow en="Portfolio" accent={accent} />
          <h1 style={{
            margin: 0, fontFamily: PH.sans,
            fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', lineHeight: 1.06,
            fontWeight: 600, letterSpacing: '-0.03em', color: PH.white,
          }}>
            <span style={{ display: 'block' }}>作品集</span>
            <span style={{
              display: 'block', fontStyle: 'italic',
              // 與首頁 / 服務頁 hero 招牌漸層一致（紫→藍→青），不跟隨 pink 主色
              background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Selected Works</span>
          </h1>
          <p style={{ margin: 0, fontFamily: PH.sans, fontSize: 15, lineHeight: 1.85, color: PH.mute, maxWidth: 440 }}>
            收錄 n8n 自動化流程、AI Agent 應用與 Vibe Coding 開發的真實專案——每個作品都是解決實際問題的工具，不是 demo。
          </p>
          <PHMeta items={['4 個專案', '持續累積', '非 demo']} accent={accent} />
        </div>
        <div className="ph-visual" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WorkPreviewCard accent={accent} />
        </div>
      </div>
    </PHShell>
  )
}
