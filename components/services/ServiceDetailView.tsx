'use client'

// ─────────────────────────────────────────────────────────────
// Service detail — "case study" layer, ported from the Claude Design
// 服務內頁 handoff (service-detail.jsx + service-detail.css). Mirrors the
// 作品集內頁 language: // mono labels, framed n8n workflow canvas, a
// flagship metric dashboard, two-column purpose, scope ✅/❌, price tiers,
// FAQ accordion. Services signature hue is green (#34d399).
//
// Nav/footer come from the app layout; the prototype's bottom service
// switcher is dropped (each service is its own route → prev/next nav).
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { ServiceDetail } from '@/lib/services-detail'

const DOT_PAL = ['#34d399', '#22d3ee', '#a78bfa', '#f0abfc', '#fbbf24', '#60a5fa']
const KIND_ENV: Record<ServiceDetail['kind'], string> = {
  n8n: 'n8n automation',
  ai: 'ai application',
  product: 'product pack',
}

type IconProps = React.SVGProps<SVGSVGElement>

const CheckIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="10" fill="rgba(52,211,153,0.16)" />
    <path d="M8 12.5l2.5 2.5 5.5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const XIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="10" fill="rgba(148,163,184,0.12)" />
    <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const ArrowR = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Plus = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

function resolveDeliverables(svc: ServiceDetail): string[] {
  if (svc.deliverables && svc.deliverables.length) return svc.deliverables
  return ['流程設計與需求確認', svc.kind === 'ai' ? 'AI 應用建置與測試' : 'n8n 工作流程全套建置', 'API 串接與測試', '操作教學文件', '上線後 2 週免費調整']
}

function CSLabel({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="svc-cslabel">
      <span>{'// '}{children}</span>
      <span className="svc-cslabel__rule" />
      {note && <span className="svc-cslabel__n">{note}</span>}
    </div>
  )
}

function WorkflowCanvas({ svc }: { svc: ServiceDetail }) {
  const flow = svc.flow ?? []
  return (
    <div className="svc-frame">
      <div className="svc-frame__bar">
        <span className="svc-frame__lights">
          <span style={{ background: '#ff5f56' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#27c93f' }} />
        </span>
        <span className="svc-frame__name">workflow.json · {svc.title}</span>
      </div>
      <div className="svc-canvas">
        <div className="svc-chain">
          {flow.map((s, i) => (
            <div className="svc-cstep-wrap" key={i}>
              <div className="svc-cstep">
                <div className="svc-cnode" style={{ '--nd': `${i * 0.45}s` } as React.CSSProperties}>{String(i + 1).padStart(2, '0')}</div>
                <div className="svc-cnode-t">{s.title}</div>
              </div>
              {i < flow.length - 1 && (
                <div className="svc-cwire"><span className="svc-cpulse" style={{ animationDelay: `${i * 0.55}s` }} /></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Big({ val, unit }: { val: string; unit?: string }) {
  return <span className="svc-big">{val}{unit && <span className="u">{unit}</span>}</span>
}

function Dashboard({ svc }: { svc: ServiceDetail }) {
  const deliv = resolveDeliverables(svc)
  const hasFlow = !!(svc.flow && svc.flow.length)
  const countW = hasFlow
    ? { tag: '流程步驟', big: String(svc.flow!.length), unit: '步', sub: `${svc.flowLabel ?? '流程'}，全程自動串接` }
    : { tag: '能力範圍', big: String((svc.caps || []).length), unit: '項', sub: '可交付的應用方向' }

  return (
    <div className="svc-dash">
      <div className="svc-w svc-w-hero">
        <div className="svc-w-hero__body">
          {svc.metric ? (
            <>
              <span className="svc-w__tag" style={{ color: '#6ee7b7' }}>關鍵指標 · {svc.metric.label}</span>
              <div style={{ margin: '12px 0 0' }}><Big val={svc.metric.after} /></div>
              <span className="svc-w-hero__title">{svc.metric.label}</span>
              <span className="svc-w-hero__desc">原本{svc.metric.before}，自動化後{svc.metric.after}——同樣的事，速度差一個量級。</span>
            </>
          ) : (
            <>
              <span className="svc-w__tag" style={{ color: '#6ee7b7' }}>方案費用 · Project</span>
              <div style={{ margin: '12px 0 0' }}><Big val={svc.price} unit="起" /></div>
              <span className="svc-w-hero__title">一次付清買斷 · 專案制</span>
              <span className="svc-w-hero__desc">基礎方案價格，非月費／訂閱。{svc.priceNote}。</span>
            </>
          )}
        </div>
        <div className="svc-w-hero__badge">
          <span className="ring" />
          <span className="core"><span className="glyph">{svc.icon}</span><span className="glyphSub">{svc.cat}</span></span>
        </div>
      </div>

      <div className="svc-w svc-w-list" style={{ gridColumn: 'span 3' }}>
        <span className="svc-w__tag">支援平台</span>
        <div className="svc-w-list__rows">
          {svc.platforms.slice(0, 6).map((r, k) => (
            <div className="svc-w-list__row" key={k}>
              <span className="d" style={{ background: DOT_PAL[k % DOT_PAL.length], boxShadow: `0 0 9px ${DOT_PAL[k % DOT_PAL.length]}` }} />
              <span className="l">{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="svc-w" style={{ gridColumn: 'span 3', justifyContent: 'space-between' }}>
        <span className="svc-w__tag">{countW.tag}</span>
        <div><Big val={countW.big} unit={countW.unit} /><span className="svc-w__sub">{countW.sub}</span></div>
      </div>

      <div className="svc-w svc-w-accent" style={{ gridColumn: 'span 3', justifyContent: 'space-between' }}>
        <span className="svc-w__tag">上線交付</span>
        <div><Big val={String(deliv.length)} unit="項" /><span className="svc-w__sub">含教學文件與上線後免費調整</span></div>
      </div>

      <div className="svc-w" style={{ gridColumn: 'span 3', justifyContent: 'space-between' }}>
        <span className="svc-w__tag">初次諮詢</span>
        <div><Big val="免費" /><span className="svc-w__sub">先評估你的現有狀況，再依範圍報價</span></div>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [maxH, setMaxH] = useState(0)
  useEffect(() => {
    setMaxH(open ? ref.current?.scrollHeight ?? 400 : 0)
  }, [open])
  return (
    <div className="svc-faq__item" data-open={open}>
      <button className="svc-faq__q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span><Plus className="svc-faq__icon" />
      </button>
      <div className="svc-faq__a" ref={ref} style={{ maxHeight: maxH }}>
        <p>{a}</p>
      </div>
    </div>
  )
}

function PlanBlock({ svc }: { svc: ServiceDetail }) {
  const deliv = resolveDeliverables(svc)
  return (
    <div className="svc-plan">
      <div>
        <div className="svc-plan__label">服務費用</div>
        <div className="svc-plan__amt">
          <span className="svc-plan__num">{svc.price}</span>
          <span className="svc-plan__from">起</span>
        </div>
        <p className="svc-plan__note">{svc.priceNote}</p>
        <p className="svc-plan__oneoff">
          <span className="svc-plan__oneoff-pill">一次付清買斷</span>
          以上為基礎方案價格，非月費或訂閱制。實際費用依你的需求範圍報價。
        </p>
        <Link href="/contact" className="svc-plan__cta">
          <span>立即諮詢</span>
          <ArrowR className="btn__arrow" />
        </Link>
        <p className="svc-plan__sub">初次諮詢免費 · 評估後再報價</p>
      </div>
      <div className="svc-plan__divider" />
      <div>
        <div className="svc-plan__inc-label">方案包含</div>
        <ul className="svc-plan__inc">
          {deliv.map((d, i) => <li key={i}><CheckIcon /><span>{d}</span></li>)}
        </ul>
        {svc.addons && (
          <>
            <div className="svc-plan__inc-label" style={{ marginTop: 18 }}>可加購</div>
            <ul className="svc-plan__inc svc-plan__inc--addon">
              {svc.addons.map((d, i) => <li key={i}><Plus style={{ width: 14, height: 14, color: '#94a3b8' }} /><span>{d}</span></li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

type NavLink = { slug: string; index: string; title: string }

export default function ServiceDetailView({
  svc, total, prev, next,
}: {
  svc: ServiceDetail
  total: number
  prev: NavLink
  next: NavLink
}) {
  const hasFlow = !!(svc.flow && svc.flow.length)

  return (
    <div className="service-page">
      <style>{SERVICE_DETAIL_CSS}</style>
      <div className="service-page__glow" />

      <div className="svc-cs">
        <nav className="svc-crumb" aria-label="breadcrumb">
          <Link href="/">首頁</Link>
          <span className="svc-crumb__sep">/</span>
          <Link href="/services">服務</Link>
          <span className="svc-crumb__sep">/</span>
          <span className="svc-crumb__here">{svc.title}</span>
        </nav>

        {/* header */}
        <div className="svc-cs-index">SERVICE <b>{svc.index}</b> / {String(total).padStart(2, '0')}</div>
        <div className="svc-cs-meta">
          {svc.published ? (
            <span className="svc-light"><span className="svc-light__dot" /><span className="svc-light__t">accepting work</span></span>
          ) : (
            <span className="svc-light"><span className="svc-light__dot draft" /><span className="svc-light__t draft">draft · 未上線</span></span>
          )}
          <span className="svc-env">{KIND_ENV[svc.kind]}</span>
          <span className="svc-cat"><span className="svc-cat__emoji">{svc.icon}</span>{svc.cat}</span>
        </div>
        <h1 className="svc-cs-title">{svc.title}</h1>
        <p className="svc-cs-tagline">「{svc.tagline}」</p>
        <p className="svc-cs-lede">{svc.desc}</p>
        <div className="svc-badges">
          {svc.tags.map((t) => <span className="svc-badge" key={t}>{t}</span>)}
        </div>

        {/* workflow canvas (pipeline services only) */}
        {hasFlow && (
          <section className="svc-csec">
            <CSLabel note="n8n pipeline">{svc.flowLabel} · Workflow</CSLabel>
            <WorkflowCanvas svc={svc} />
          </section>
        )}

        {/* metric dashboard */}
        <section className="svc-csec">
          <CSLabel note={svc.metric ? svc.metric.label : '方案概覽'}>重點指標 · Metrics</CSLabel>
          <Dashboard svc={svc} />
        </section>

        {/* problem */}
        <section className="svc-csec">
          <CSLabel>痛點 · The Problem</CSLabel>
          <div className="svc-purpose">
            <div className="svc-purpose__l"><h3>{svc.title}要解決的，是這件事</h3></div>
            <div className="svc-purpose__r"><p>{svc.problem}</p></div>
          </div>
        </section>

        {/* breakdown (flow) OR capabilities (caps) */}
        {hasFlow ? (
          <section className="svc-csec">
            <CSLabel>流程拆解 · Breakdown</CSLabel>
            <ol className="svc-steps">
              {svc.flow!.map((s, k) => (
                <li className="svc-step" key={k}>
                  <div className="svc-step__n">{String(k + 1).padStart(2, '0')}</div>
                  <div className="svc-step__body">
                    <h4 className="svc-step__t">{s.title}</h4>
                    <p className="svc-step__d">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : svc.caps ? (
          <section className="svc-csec">
            <CSLabel note={`${String(svc.caps.length).padStart(2, '0')} 項`}>{svc.capsLabel} · Capabilities</CSLabel>
            <div className="svc-cap">
              {svc.caps.map((c, k) => (
                <div className="svc-cap__card" key={k}>
                  <span className="svc-cap__plus">+</span>
                  <div>
                    <h4 className="svc-cap__t">{c.title}</h4>
                    <p className="svc-cap__d">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* scope (product packs) */}
        {svc.scope && (
          <section className="svc-csec">
            <CSLabel>服務範圍 · Scope</CSLabel>
            <div className="svc-scope">
              <div className="svc-scope__col">
                <div className="svc-scope__h svc-scope__h--yes">包含</div>
                <ul>{svc.scope.yes.map((s, k) => <li key={k}><CheckIcon className="svc-mark" />{s}</li>)}</ul>
              </div>
              <div className="svc-scope__col">
                <div className="svc-scope__h svc-scope__h--no">不含</div>
                <ul>{svc.scope.no.map((s, k) => <li key={k} className="no"><XIcon className="svc-mark mute" />{s}</li>)}</ul>
              </div>
            </div>
          </section>
        )}

        {/* good fit */}
        {svc.audience && (
          <section className="svc-csec">
            <CSLabel>適合對象 · Good Fit</CSLabel>
            <ul className="svc-fit">
              {svc.audience.map((a, k) => <li key={k}><CheckIcon className="svc-mark" />{a}</li>)}
            </ul>
          </section>
        )}

        {/* impact table */}
        {svc.kpis && (
          <section className="svc-csec">
            <CSLabel>效益估算 · Impact</CSLabel>
            <table className="svc-table">
              <thead><tr><th>指標</th><th>改善前</th><th className="after">改善後</th></tr></thead>
              <tbody>
                {svc.kpis.map((b, k) => (
                  <tr key={k}><td>{b[0]}</td><td className="before">{b[1]}</td><td className="after">{b[2]}</td></tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: '12px 2px 0', fontFamily: 'var(--sans)', fontSize: 12.5, lineHeight: 1.6, color: '#475569' }}>
              以上為實際導入的典型成效，實際數字依產業、流程與資料狀況而異。
            </p>
          </section>
        )}

        {/* plan */}
        <section className="svc-csec">
          <CSLabel>方案與費用 · Pricing</CSLabel>
          {svc.tiers && (
            <table className="svc-table" style={{ marginBottom: 16 }}>
              <thead><tr><th>類型</th><th>範圍</th><th className="after">參考報價</th></tr></thead>
              <tbody>
                {svc.tiers.map((t, k) => (
                  <tr key={k}><td>{t.type}</td><td className="before">{t.range}</td><td className="after">{t.price}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          <PlanBlock svc={svc} />
        </section>

        {/* faq */}
        <section className="svc-csec">
          <CSLabel>常見問題 · FAQ</CSLabel>
          <div className="svc-faq">{svc.faq.map((f, k) => <FaqItem key={k} q={f.q} a={f.a} />)}</div>
        </section>

        {/* other services */}
        <section className="svc-csec">
          <CSLabel>其他服務 · More</CSLabel>
          <div className="svc-nav">
            <Link className="svc-nav__btn" href={`/services/${prev.slug}`}>
              <span className="svc-nav__k">← PREV · {prev.index}</span>
              <span className="svc-nav__t">{prev.title}</span>
            </Link>
            <Link className="svc-nav__btn next" href={`/services/${next.slug}`}>
              <span className="svc-nav__k">NEXT · {next.index} →</span>
              <span className="svc-nav__t">{next.title}</span>
            </Link>
          </div>
        </section>

        {!svc.published && (
          <div className="svc-draftnote">
            <span />此頁為網站草稿（published: false），尚未對外公開——文案以 repo 內容為準。
          </div>
        )}
      </div>
    </div>
  )
}

const SERVICE_DETAIL_CSS = `
.service-page {
  --acc: #34d399; --acc2: #2dd4bf;
  --acc-soft: rgba(52,211,153,0.5); --acc-dim: rgba(52,211,153,0.12);
  --line: rgba(255,255,255,0.08);
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --disp: "Space Grotesk", "Noto Sans TC", sans-serif;
  --sans: "Noto Sans TC", sans-serif;
  position: relative; color: #cbd5e1; overflow: hidden;
}
.service-page__glow {
  position: absolute; inset: 0; height: 720px; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 90% 50% at 50% -12%, rgba(52,211,153,0.11), transparent 70%),
    radial-gradient(ellipse 56% 46% at 88% 6%, rgba(124,92,255,0.1), transparent 70%);
}
.svc-cs { position: relative; z-index: 1; max-width: 960px; margin: 0 auto; padding: 40px 32px 110px; }

.svc-crumb { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; font-family: var(--mono); font-size: 11px; letter-spacing: 0.04em; color: rgba(148,163,184,0.6); margin-bottom: 30px; }
.svc-crumb a { color: rgba(148,163,184,0.6); text-decoration: none; transition: color .18s; }
.svc-crumb a:hover { color: var(--acc); }
.svc-crumb__sep { color: rgba(148,163,184,0.3); }
.svc-crumb__here { color: #94a3b8; }

.svc-cs-index { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; color: #475569; margin-bottom: 18px; }
.svc-cs-index b { color: var(--acc); font-weight: 600; }
.svc-cs-meta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.svc-light { display: inline-flex; align-items: center; gap: 7px; }
.svc-light__dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 9px #4ade80; flex: none; }
.svc-light__dot.draft { background: #fbbf24; box-shadow: 0 0 9px #fbbf24; }
.svc-light__t { font-family: var(--mono); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #4ade80; }
.svc-light__t.draft { color: #fbbf24; }
.svc-env { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; color: #475569; text-transform: uppercase; }
.svc-cat { display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px 4px 9px; border-radius: 999px; background: var(--acc-dim); box-shadow: inset 0 0 0 1px rgba(52,211,153,0.3); font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--acc); }
.svc-cat__emoji { font-size: 13px; }

.svc-cs-title { margin: 0 0 12px; font-family: var(--sans); color: #fff; font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; font-size: clamp(2rem, 4.2vw, 3.1rem); max-width: 18ch; }
.svc-cs-tagline { margin: 0 0 22px; font-family: var(--mono); font-size: clamp(0.95rem, 1.6vw, 1.15rem); letter-spacing: 0.01em; color: #f0abfc; }
.svc-cs-lede { margin: 0 0 24px; max-width: 64ch; font-family: var(--sans); font-size: 1.05rem; line-height: 1.85; color: #94a3b8; text-wrap: pretty; }

.svc-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.svc-badge { font-family: var(--mono); font-size: 10.5px; font-weight: 500; line-height: 1; letter-spacing: 0.04em; padding: 6px 11px; border-radius: 999px; border: 1px solid rgba(52,211,153,0.28); background: rgba(52,211,153,0.07); color: #6ee7b7; white-space: nowrap; }

.svc-csec { margin-top: 56px; }
.svc-cslabel { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--acc); }
.svc-cslabel__rule { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(52,211,153,0.28), transparent); }
.svc-cslabel__n { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; color: #334155; }

.svc-frame { border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; background: rgba(255,255,255,0.02); box-shadow: 0 0 0 1px rgba(52,211,153,0.1), 0 24px 70px -20px rgba(0,0,0,0.7); }
.svc-frame__bar { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-bottom: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); }
.svc-frame__lights { display: flex; gap: 5px; flex: none; }
.svc-frame__lights span { width: 8px; height: 8px; border-radius: 50%; opacity: 0.85; }
.svc-frame__name { font-family: var(--mono); font-size: 11px; color: #475569; letter-spacing: 0.02em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.svc-canvas { position: relative; padding: 34px 26px; background: radial-gradient(circle, rgba(52,211,153,0.07) 1px, transparent 1px) 0 0 / 24px 24px, radial-gradient(ellipse 70% 80% at 50% 50%, rgba(52,211,153,0.05), transparent 70%); overflow-x: auto; }
.svc-chain { display: flex; align-items: flex-start; min-width: min-content; }
.svc-cstep-wrap { display: contents; }
.svc-cstep { display: flex; flex-direction: column; align-items: center; gap: 10px; flex: none; width: 118px; }
.svc-cnode { width: 46px; height: 46px; border-radius: 13px; display: grid; place-items: center; font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--acc); border: 1px solid rgba(52,211,153,0.4); background: #060d12; }
.svc-cnode-t { font-family: var(--sans); font-size: 12.5px; font-weight: 500; color: #cbd5e1; text-align: center; line-height: 1.4; }
.svc-cwire { position: relative; flex: 1; min-width: 22px; height: 2px; margin: 22px 2px 0; background: rgba(52,211,153,0.16); }
.svc-cpulse { position: absolute; top: -2px; left: 0; width: 6px; height: 6px; border-radius: 50%; background: var(--acc); box-shadow: 0 0 10px var(--acc); opacity: 0; }
@media (prefers-reduced-motion: no-preference) {
  .svc-cpulse { animation: svcTravel 2.8s linear infinite; }
  .svc-cnode { animation: svcNodeGlow 2.8s ease-in-out infinite; animation-delay: var(--nd, 0s); }
}
@keyframes svcTravel { 0% { left: 0; opacity: 0; } 14% { opacity: 1; } 86% { opacity: 1; } 100% { left: calc(100% - 6px); opacity: 0; } }
@keyframes svcNodeGlow { 0%, 100% { box-shadow: none; border-color: rgba(52,211,153,0.4); } 50% { box-shadow: 0 0 18px -3px var(--acc); border-color: var(--acc-soft); } }

.svc-purpose { display: grid; grid-template-columns: 0.82fr 1.18fr; gap: clamp(22px, 4vw, 54px); align-items: start; }
.svc-purpose__l { border-left: 2px solid var(--acc-soft); padding-left: 22px; }
.svc-purpose__l h3 { margin: 0; font-family: var(--sans); font-size: clamp(1.15rem, 2.2vw, 1.45rem); font-weight: 700; color: #fff; line-height: 1.4; letter-spacing: -0.01em; text-wrap: balance; }
.svc-purpose__r p { margin: 0 0 16px; font-family: var(--sans); font-size: 1.02rem; line-height: 1.95; color: #cbd5e1; text-wrap: pretty; }
.svc-purpose__r p:last-child { margin-bottom: 0; }

.svc-steps { position: relative; display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 0; }
.svc-steps::before { content: ""; position: absolute; left: 18px; top: 24px; bottom: 24px; width: 2px; background: linear-gradient(180deg, var(--acc-soft), rgba(52,211,153,0.08)); }
.svc-step { position: relative; display: flex; gap: 20px; align-items: flex-start; padding: 12px 0; list-style: none; }
.svc-step__n { position: relative; z-index: 1; flex: none; width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; font-family: var(--mono); font-size: 12px; font-weight: 600; color: var(--acc); background: #060d12; box-shadow: inset 0 0 0 1px rgba(52,211,153,0.4); }
.svc-step__body { flex: 1; min-width: 0; }
.svc-step__t { margin: 4px 0 4px; font-family: var(--sans); font-size: 1.06rem; font-weight: 600; color: #f1f5f9; }
.svc-step__d { margin: 0; font-family: var(--sans); font-size: 0.96rem; line-height: 1.65; color: #94a3b8; max-width: 56ch; }

.svc-dash { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.svc-w { position: relative; overflow: hidden; border-radius: 16px; padding: 16px 18px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); display: flex; flex-direction: column; min-height: 116px; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.svc-w:hover { transform: translateY(-2px); border-color: rgba(52,211,153,0.3); }
.svc-w__tag { font-family: var(--mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--acc); }
.svc-big { display: flex; align-items: baseline; gap: 5px; line-height: 1; font-family: var(--disp); font-weight: 700; letter-spacing: -0.025em; color: #fff; }
.svc-big .u { font-size: 0.45em; font-weight: 600; color: var(--acc); }
.svc-w__sub { display: block; font-family: var(--sans); font-size: 12.5px; line-height: 1.5; color: #94a3b8; margin-top: 8px; }

.svc-w-hero { grid-column: span 6; flex-direction: row; align-items: center; gap: 26px; min-height: 0; border-radius: 18px; padding: clamp(22px,3vw,28px) clamp(24px,4vw,32px); border: 1px solid rgba(52,211,153,0.32); background: radial-gradient(130% 150% at 6% 0%, rgba(52,211,153,0.18), transparent 55%), linear-gradient(180deg, rgba(52,211,153,0.06), rgba(2,3,10,0)), #060d12; }
.svc-w-hero:hover { box-shadow: 0 0 60px -26px rgba(52,211,153,0.7); border-color: rgba(52,211,153,0.5); transform: none; }
.svc-w-hero__body { flex: 1; min-width: 0; }
.svc-w-hero .svc-big { font-size: 54px; }
.svc-w-hero__title { display: block; font-family: var(--sans); font-weight: 700; font-size: 19px; color: #fff; margin: 10px 0 6px; letter-spacing: -0.01em; }
.svc-w-hero__desc { display: block; font-family: var(--sans); font-size: 13.5px; color: #94a3b8; line-height: 1.62; max-width: 400px; }
.svc-w-hero__badge { position: relative; width: 132px; height: 132px; flex: none; }
.svc-w-hero__badge .ring { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 210deg, #34d399, #2dd4bf, #22d3ee, #34d399); opacity: 0.9; }
.svc-w-hero__badge .core { position: absolute; inset: 11px; border-radius: 50%; background: #060d12; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; }
.svc-w-hero__badge .glyph { font-size: 34px; line-height: 1; }
.svc-w-hero__badge .glyphSub { font-family: var(--sans); font-size: 10.5px; color: var(--acc); }

.svc-w-accent { justify-content: space-between; color: #04130d; border: 1px solid rgba(255,255,255,0.16); background: linear-gradient(130deg, #34d399 0%, #22c08a 55%, #2dd4bf 100%); box-shadow: 0 18px 44px -22px rgba(52,211,153,0.7); }
.svc-w-accent:hover { box-shadow: 0 22px 52px -20px rgba(52,211,153,0.85); border-color: rgba(255,255,255,0.22); }
.svc-w-accent .svc-w__tag { color: rgba(4,19,13,0.7); }
.svc-w-accent .svc-big { color: #04130d; }
.svc-w-accent .svc-big .u { color: rgba(4,19,13,0.78); }
.svc-w-accent .svc-w__sub { color: rgba(4,19,13,0.85); }

.svc-w-list { justify-content: flex-start; }
.svc-w-list__rows { margin-top: 13px; display: grid; gap: 9px 16px; grid-template-columns: 1fr 1fr; }
.svc-w-list__row { display: flex; align-items: center; gap: 9px; }
.svc-w-list__row span.d { width: 7px; height: 7px; border-radius: 50%; flex: none; }
.svc-w-list__row span.l { font-family: var(--sans); font-size: 12.5px; color: #e2e8f0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.svc-fit { display: grid; gap: 11px; margin: 0; padding: 0; }
.svc-fit li { list-style: none; display: flex; align-items: flex-start; gap: 13px; font-family: var(--sans); font-size: 1.02rem; line-height: 1.5; color: #cbd5e1; padding: 15px 18px; border-radius: 12px; background: rgba(255,255,255,0.02); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06); }
.svc-mark { flex: none; margin-top: 2px; width: 18px; height: 18px; color: var(--acc); }

.svc-table { width: 100%; border-collapse: separate; border-spacing: 0; overflow: hidden; border-radius: 14px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); }
.svc-table th, .svc-table td { text-align: left; padding: 15px 20px; font-family: var(--sans); font-size: 1rem; }
.svc-table thead th { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(148,163,184,0.8); background: rgba(255,255,255,0.03); font-weight: 500; }
.svc-table tbody tr + tr td { border-top: 1px solid rgba(255,255,255,0.06); }
.svc-table td:first-child { color: #cbd5e1; font-weight: 500; }
.svc-table td.before { color: #94a3b8; font-family: var(--mono); }
.svc-table th.after, .svc-table td.after { background: rgba(52,211,153,0.07); }
.svc-table td.after { color: var(--acc); font-family: var(--mono); font-weight: 600; }
.svc-table thead th.after { color: var(--acc); }

.svc-plan { position: relative; overflow: hidden; border-radius: 20px; padding: 30px 32px; border: 1px solid rgba(52,211,153,0.3); background: radial-gradient(130% 130% at 100% 0%, rgba(52,211,153,0.16), transparent 58%), linear-gradient(180deg, rgba(13,20,30,0.85), rgba(6,10,18,0.85)); box-shadow: 0 24px 60px rgba(2,3,10,0.5), 0 0 50px rgba(52,211,153,0.06); display: grid; grid-template-columns: 1fr 1px 1fr; gap: 32px; align-items: center; }
.svc-plan__divider { width: 1px; align-self: stretch; background: rgba(255,255,255,0.09); }
.svc-plan__label { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(148,163,184,0.8); }
.svc-plan__amt { margin: 10px 0 0; display: flex; align-items: baseline; gap: 8px; }
.svc-plan__num { font-family: var(--disp); font-size: 2.7rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.svc-plan__from { font-family: var(--sans); font-size: 1rem; color: #94a3b8; }
.svc-plan__note { margin: 8px 0 0; font-family: var(--sans); font-size: 0.88rem; line-height: 1.55; color: #94a3b8; }
.svc-plan__oneoff { margin: 12px 0 0; font-family: var(--sans); font-size: 0.82rem; line-height: 1.6; color: #94a3b8; }
.svc-plan__oneoff-pill { display: inline-block; margin-right: 8px; padding: 2px 9px; border-radius: 999px; font-family: var(--mono); font-size: 10px; font-weight: 600; letter-spacing: 0.06em; color: var(--acc); background: var(--acc-dim); box-shadow: inset 0 0 0 1px rgba(52,211,153,0.3); vertical-align: middle; }
.svc-plan__inc-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(148,163,184,0.7); margin-bottom: 13px; }
.svc-plan__inc { display: grid; gap: 10px; margin: 0; padding: 0; }
.svc-plan__inc li { list-style: none; display: flex; align-items: flex-start; gap: 11px; font-family: var(--sans); font-size: 0.95rem; line-height: 1.45; color: #cbd5e1; }
.svc-plan__inc svg { flex: none; margin-top: 2px; width: 16px; height: 16px; color: var(--acc); }
.svc-plan__inc--addon li { color: #94a3b8; }
.svc-plan__cta { margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 22px; border-radius: 12px; font-family: var(--sans); font-size: 0.98rem; font-weight: 600; text-decoration: none; cursor: pointer; color: #04130d; background: linear-gradient(135deg, #34d399, #22c08a 55%, #2dd4bf); background-size: 160% 160%; background-position: 0% 50%; box-shadow: 0 0 24px rgba(52,211,153,0.4), 0 10px 28px rgba(52,211,153,0.22), inset 0 1px 0 rgba(255,255,255,0.3); transition: transform .2s, background-position .3s, box-shadow .2s; }
.svc-plan__cta:hover { transform: translateY(-2px); background-position: 100% 50%; box-shadow: 0 0 34px rgba(52,211,153,0.55), 0 16px 36px rgba(52,211,153,0.3), inset 0 1px 0 rgba(255,255,255,0.35); }
.svc-plan__cta .btn__arrow { width: 16px; height: 16px; }
.svc-plan__sub { margin: 11px 0 0; text-align: center; font-family: var(--mono); font-size: 10px; letter-spacing: 0.04em; color: rgba(148,163,184,0.75); }

.svc-faq { display: grid; gap: 12px; }
.svc-faq__item { border-radius: 14px; background: rgba(255,255,255,0.02); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07); overflow: hidden; transition: box-shadow .2s, background .2s; }
.svc-faq__item[data-open="true"] { background: rgba(52,211,153,0.04); box-shadow: inset 0 0 0 1px rgba(52,211,153,0.28); }
.svc-faq__q { width: 100%; text-align: left; cursor: pointer; border: 0; background: transparent; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 22px; font-family: var(--sans); font-size: 1.04rem; font-weight: 500; color: #e2e8f0; }
.svc-faq__icon { flex: none; width: 18px; height: 18px; color: var(--acc); transition: transform .25s; }
.svc-faq__item[data-open="true"] .svc-faq__icon { transform: rotate(45deg); }
.svc-faq__a { max-height: 0; overflow: hidden; transition: max-height .3s ease; }
.svc-faq__a p { margin: 0; padding: 0 22px 19px; font-family: var(--sans); font-size: 0.98rem; line-height: 1.75; color: #94a3b8; max-width: 62ch; text-wrap: pretty; }

.svc-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 24px; }
.svc-nav__btn { display: flex; flex-direction: column; gap: 5px; padding: 16px 18px; border-radius: 14px; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color: #cbd5e1; font-family: var(--sans); text-decoration: none; transition: border-color .2s, background .2s; }
.svc-nav__btn:hover { border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.05); }
.svc-nav__btn.next { align-items: flex-end; text-align: right; }
.svc-nav__k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.14em; color: #475569; }
.svc-nav__t { font-size: 13.5px; color: #e2e8f0; font-weight: 500; }

.svc-cap { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.svc-cap__card { display: flex; gap: 13px; padding: 18px 20px; border-radius: 14px; background: rgba(255,255,255,0.02); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06); transition: border-color .2s, background .2s; }
.svc-cap__card:hover { background: rgba(52,211,153,0.04); box-shadow: inset 0 0 0 1px rgba(52,211,153,0.28); }
.svc-cap__plus { font-family: var(--mono); color: var(--acc); font-size: 15px; flex: none; line-height: 1.6; }
.svc-cap__t { margin: 0 0 5px; font-family: var(--sans); font-size: 1.04rem; font-weight: 600; color: #f1f5f9; }
.svc-cap__d { margin: 0; font-family: var(--sans); font-size: 0.95rem; line-height: 1.6; color: #94a3b8; text-wrap: pretty; }

.svc-scope { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.svc-scope__h { font-family: var(--mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 15px; }
.svc-scope__h--yes { color: var(--acc); }
.svc-scope__h--no { color: #94a3b8; }
.svc-scope__col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.svc-scope__col li { display: flex; align-items: flex-start; gap: 11px; font-family: var(--sans); font-size: 0.98rem; line-height: 1.5; color: #cbd5e1; }
.svc-scope__col li.no { color: #94a3b8; }
.svc-mark.mute { color: #64748b; }

.svc-draftnote { margin-top: 30px; padding: 14px 18px; border-radius: 12px; font-family: var(--sans); font-size: 13px; line-height: 1.6; color: #fbbf24; background: rgba(251,191,36,0.06); box-shadow: inset 0 0 0 1px rgba(251,191,36,0.22); display: flex; gap: 11px; align-items: center; }
.svc-draftnote span { width: 6px; height: 6px; border-radius: 50%; background: #fbbf24; box-shadow: 0 0 8px #fbbf24; flex: none; }

@media (max-width: 720px) {
  .svc-dash { grid-template-columns: 1fr 1fr; }
  .svc-dash > * { grid-column: span 2 !important; }
  .svc-w-hero { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 680px) {
  .svc-purpose { grid-template-columns: 1fr; }
  .svc-plan { grid-template-columns: 1fr; gap: 22px; }
  .svc-plan__divider { display: none; }
  .svc-nav { grid-template-columns: 1fr; }
  .svc-cap { grid-template-columns: 1fr; }
  .svc-scope { grid-template-columns: 1fr; gap: 18px; }
  .svc-cs { padding-left: 22px; padding-right: 22px; }
}
`
