// ─────────────────────────────────────────────────────────────
// 服務頁 Hero — 專屬版型（Claude Design「Hero 修正 · 2a/2b」）
// 服務頁跟電子報一樣獨立成一套 hero。原本固定尺寸的 workflow SVG 在手機
// 上會被壓成看不清的縮圖，這裡改成「觸發 → 流程 → 輸出」三階段流程面板：
// 桌機橫向、窄螢幕自動直向堆疊、字級不縮水。純 CSS/SVG → server component。
// ─────────────────────────────────────────────────────────────
import Link from 'next/link'

const MONO = 'var(--font-jetbrains), ui-monospace, monospace'
const SANS = 'var(--font-noto), "Noto Sans TC", sans-serif'

// 服務卡片資料——名稱／價格／頁面連結對齊 lib/services-detail.ts 真實資料
const SERVICES = [
  { emoji: '🛒', cat: '電商', catColor: '#a78bfa', border: 'rgba(167,139,250,0.28)', title: '電商訂單自動化', price: 'NT$ 9,000 起', slug: 'ecommerce-automation' },
  { emoji: '📈', cat: '行銷', catColor: '#60a5fa', border: 'rgba(96,165,250,0.28)', title: '行銷漏斗自動化', price: 'NT$ 12,000 起', slug: 'marketing-automation' },
  { emoji: '📊', cat: '電商', catColor: '#67e8f9', border: 'rgba(103,232,249,0.28)', title: '數據報表自動化', price: 'NT$ 6,000 起', slug: 'data-report-automation' },
] as const

const OUTPUTS = [
  { emoji: '💬', label: 'Slack' },
  { emoji: '🟢', label: 'LINE' },
  { emoji: '✉️', label: 'Email' },
  { emoji: '📑', label: 'Sheet' },
] as const

function StageLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em',
      textTransform: 'uppercase', color: '#475569', marginBottom: 12, display: 'block',
    }}>{children}</span>
  )
}

// 階段之間的連接器：桌機顯示水平虛線＋雪佛龍，窄螢幕改成向下箭頭
function Connector() {
  return (
    <div className="svc-conn" aria-hidden>
      <span className="svc-conn-h">
        <span style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg,#3b4252 0 5px,transparent 5px 11px)' }} />
        <span style={{ marginLeft: -2, fontSize: 15, color: '#7c5cff' }}>›</span>
      </span>
      <span className="svc-conn-v" style={{ color: '#7c5cff', fontSize: 17 }}>↓</span>
    </div>
  )
}

export default function HeroBanner() {
  return (
    <section style={{ position: 'relative', width: '100%', overflow: 'hidden', fontFamily: SANS }}>
      <HeroStyles />

      {/* backdrop — violet spotlight + faint dot grid + edge feather */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 55% at 20% -10%, rgba(124,92,255,0.20), transparent 68%), radial-gradient(ellipse 60% 50% at 95% 15%, rgba(34,211,238,0.10), transparent 66%)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(148,163,184,1) 1px, transparent 1px)',
        backgroundSize: '30px 30px', opacity: 0.03,
      }} />
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `linear-gradient(to bottom, #05060a 0%, transparent 14%, transparent 86%, #05060a 100%)`,
      }} />

      <div style={{
        position: 'relative', zIndex: 2, maxWidth: 1180, margin: '0 auto',
        padding: '72px clamp(20px, 5vw, 44px) 56px',
      }}>
        {/* copy */}
        <div style={{ maxWidth: 760 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '6px 15px', borderRadius: 999, marginBottom: 24,
            border: '1px solid rgba(124,92,255,0.3)', background: 'rgba(124,92,255,0.07)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#c4b5fd' }}>Services</span>
          </div>

          <h1 style={{
            margin: '0 0 20px', fontFamily: SANS,
            fontSize: 'clamp(2rem, 5.2vw, 3.5rem)', lineHeight: 1.12,
            fontWeight: 800, letterSpacing: '-0.03em', color: '#fff',
          }}>
            讓 n8n 處理<br />
            <span style={{
              background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>你不該浪費時間的事</span>
          </h1>

          <p style={{ margin: '0 0 28px', maxWidth: '48ch', fontSize: 16, lineHeight: 1.85, color: '#94a3b8' }}>
            專注在電商與行銷流程自動化。每個服務都是從實際專案裡打磨出來的，不賣課程，直接幫你做好。
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <Link href="/contact" className="btn btn--ink">
              <span className="btn__dot" />
              <span className="btn__label">免費諮詢</span>
              <span className="btn__arrow">→</span>
            </Link>
            <Link href="#services" className="btn btn--ink-outline">
              <span className="btn__label">看服務項目</span>
            </Link>
          </div>
        </div>

        {/* workflow panel — 桌機專屬，手機版（≤860px）整塊隱藏 */}
        <div className="svc-panel" style={{
          marginTop: 40, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18,
          background: 'rgba(255,255,255,0.02)', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '15px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: MONO, fontSize: 12.5, color: '#64748b' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
              workflow.json · live
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(244,63,94,0.55)' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(245,158,11,0.55)' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(52,211,153,0.55)' }} />
            </div>
          </div>

          <div className="svc-flow" style={{ padding: 'clamp(20px, 3vw, 30px) clamp(16px, 2.4vw, 26px)' }}>
            {/* Trigger */}
            <div className="svc-trigger">
              <StageLabel>Trigger</StageLabel>
              <div className="svc-trigger-body">
                <div style={{
                  padding: 16, border: '1.5px solid rgba(34,211,238,0.5)', borderRadius: 14,
                  background: 'rgba(13,14,26,0.9)', boxShadow: '0 0 22px rgba(34,211,238,0.14)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 10px rgba(34,211,238,0.8)' }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>Webhook 觸發</span>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>客戶事件 / Cron 排程</div>
                </div>
              </div>
            </div>

            <Connector />

            {/* Workflow — service cards */}
            <div className="svc-work">
              <StageLabel>Workflow</StageLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="svc-svc"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      padding: '13px 16px', border: `1.5px solid ${s.border}`, borderRadius: 14,
                      background: 'rgba(13,14,26,0.92)', textDecoration: 'none',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                      <span style={{ fontSize: 21 }}>{s.emoji}</span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: s.catColor, marginBottom: 2 }}>{s.cat}</span>
                        <span style={{ display: 'block', fontSize: 15.5, fontWeight: 600, color: '#f1f5f9' }}>{s.title}</span>
                      </span>
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{s.price}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Connector />

            {/* Output */}
            <div className="svc-output">
              <StageLabel>Output</StageLabel>
              <div className="svc-output-list">
                {OUTPUTS.map((o) => (
                  <div key={o.label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9,
                    padding: '9px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                    background: 'rgba(13,14,26,0.9)',
                  }}>
                    <span style={{ fontSize: 17 }}>{o.emoji}</span>
                    <span style={{ fontFamily: MONO, fontSize: 12.5, color: '#94a3b8' }}>{o.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            padding: '12px 22px', borderTop: '1px solid rgba(255,255,255,0.06)',
            fontFamily: MONO, fontSize: 12, color: '#475569',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.8)' }} />
            點擊任一服務查看詳情
          </div>
        </div>
      </div>
    </section>
  )
}

// 桌機：三階段流程面板橫向排列（Trigger｜Workflow｜Output）。
// 手機（≤860px）：整塊面板隱藏，Hero 只留 eyebrow＋標題＋副標＋兩顆 CTA。
// 桌機版樣式與現行完全一致，手機/桌機在此明確分流。
function HeroStyles() {
  return (
    <style>{`
      .svc-flow { display: flex; align-items: stretch; gap: 0; }
      .svc-trigger { flex: 0 0 190px; display: flex; flex-direction: column; }
      .svc-trigger-body { flex: 1; display: flex; align-items: center; }
      .svc-work { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
      .svc-output { flex: 0 0 auto; display: flex; flex-direction: column; }
      .svc-output-list { display: flex; flex-direction: column; gap: 9px; }
      .svc-conn { display: flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 52px; margin-top: 23px; }
      .svc-conn-h { display: flex; align-items: center; width: 100%; }
      .svc-conn-v { display: none; }
      .svc-svc { transition: border-color .2s ease, background .2s ease, transform .2s ease; }
      .svc-svc:hover { border-color: rgba(167,139,250,0.55) !important; background: rgba(20,22,40,0.95) !important; transform: translateY(-1px); }

      /* 手機精簡版：拿掉整個桌機流程面板 */
      @media (max-width: 860px) {
        .svc-panel { display: none; }
      }
    `}</style>
  )
}
