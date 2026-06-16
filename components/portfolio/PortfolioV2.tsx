'use client'

/* ─────────────────────────────────────────────────────────────
 * 作品集 v2 — 依 Claude Design「作品集.html / PortfolioPageV2」實作。
 *  1. 高對比 banner：超大字 + 即時系統狀態儀表板（脈動燈號）
 *  2. Bento 卡片網格：非對稱跨欄、hover 紫光、micro tech badge
 *  3. 點卡片開 case-study overlay：便當盒儀表板（旗艦格 + donut /
 *     bars / accent / stat widgets）+ 核心用途 + 輸出範例 + 上/下篇
 * 全站 Nav / Footer 由 layout 提供，這裡只負責頁面內容。
 * ───────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import Image from 'next/image'

const MONO = 'var(--font-jetbrains), ui-monospace, monospace'
const DISP = 'var(--font-space-grotesk), var(--font-noto), "Noto Sans TC", sans-serif'
const SANS = 'var(--font-noto), "Noto Sans TC", sans-serif'
const PAL = { vio: '#8b5cf6', vio2: '#a78bfa', vio3: '#c4b5fd', pink: '#ec4899', cyan: '#22d3ee', amber: '#fbbf24', teal: '#2dd4bf', blue: '#3b82f6', red: '#fb7185' }

type CSS = React.CSSProperties

/* ════════ shared css ════════ */
function PV2Styles() {
  return (
    <style>{`
      .bv2-card { position: relative; border-radius: 18px; border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.02); overflow: hidden;
        transition: border-color .3s ease, box-shadow .3s ease, transform .3s ease; }
      .bv2-card::before { content: ''; position: absolute; inset: 0;
        background-image: radial-gradient(rgba(167,139,250,0.06) 1px, transparent 1px);
        background-size: 22px 22px; pointer-events: none; }
      .bv2-card:hover { border-color: rgba(167,139,250,0.45);
        box-shadow: 0 0 0 1px rgba(124,92,255,0.25), 0 0 70px -18px rgba(124,92,255,0.45), 0 18px 70px -20px rgba(240,171,252,0.18);
        transform: translateY(-2px); }
      .bv2-badge { font-family: ${MONO}; font-size: 10px; font-weight: 500; line-height: 1; letter-spacing: 0.05em;
        padding: 4px 9px; border-radius: 999px; border: 1px solid rgba(99,102,241,0.3);
        background: rgba(99,102,241,0.08); color: #a5b4fc; white-space: nowrap; }
      .bv2-card:hover .bv2-badge { border-color: rgba(99,102,241,0.55); }
      .bv2-wire { position: relative; flex: 1; min-width: 18px; height: 1px; background: rgba(255,255,255,0.10); margin: 0 7px; }
      .bv2-pulse { position: absolute; top: -2px; left: 0; width: 5px; height: 5px; border-radius: 50%;
        background: #67e8f9; box-shadow: 0 0 9px #67e8f9; opacity: 0; }
      .bv2-node { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.03); display: grid; place-items: center; }
      .bv2-ghlink { color: #64748b; text-decoration: none; font-family: ${MONO}; font-size: 10px; letter-spacing: .06em;
        display: inline-flex; align-items: center; gap: 5px; transition: color .2s; }
      .bv2-ghlink:hover { color: #e2e8f0; }
      .bv2-view { position: absolute; right: 18px; bottom: 16px; z-index: 3; font-family: ${MONO};
        font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: #a78bfa; opacity: 0; transform: translateX(-4px);
        transition: opacity .25s ease, transform .25s ease; pointer-events: none; }
      .bv2-card:hover .bv2-view { opacity: 1; transform: none; }
      .bv2-navbtn { transition: border-color .2s, background .2s; }
      .bv2-navbtn:hover { border-color: rgba(167,139,250,0.4) !important; background: rgba(124,92,255,0.06) !important; }
      .bv2-dash { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
      .bv2-rise { opacity: 1; transform: none; }
      @media (prefers-reduced-motion: no-preference) {
        .bv2-rise { opacity: 0; transform: translateY(14px);
          transition: opacity .6s ease, transform .62s cubic-bezier(.22,.68,.18,1); }
        .bv2-rise.is-in { opacity: 1; transform: none; }
      }
      .bv2-dw { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
      .bv2-dw:hover { transform: translateY(-2px); }
      .bv2-dw:not(.bv2-dw-accent):hover { border-color: rgba(167,139,250,0.3); }
      .bv2-dw-hero:hover { box-shadow: 0 0 60px -26px rgba(124,92,255,0.7); border-color: rgba(167,139,250,0.5); }
      .bv2-dw-accent:hover { box-shadow: 0 22px 52px -20px rgba(168,85,247,0.85); }
      @media (max-width: 720px) {
        .bv2-dash { grid-template-columns: 1fr 1fr; }
        .bv2-dash > * { grid-column: span 2 !important; }
        .bv2-dw-hero { flex-direction: column; align-items: flex-start !important; }
      }
      .bv2-metric-val { font-family: ${DISP}; font-weight: 700; letter-spacing: -0.02em; line-height: 1; color: #fff; }
      @media (prefers-reduced-motion: no-preference) {
        .bv2-pulse { animation: bv2-travel 2.6s linear infinite; }
        .bv2-node { animation: bv2-nodeglow 2.6s ease-in-out infinite; animation-delay: var(--nd, 0s); }
        .bv2-light { animation: bv2-blink 2.2s ease-in-out infinite; animation-delay: var(--ld, 0s); }
        .bv2-cursor { animation: bv2-caret 1s step-end infinite; }
      }
      @keyframes bv2-travel { 0% { left: 0; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: calc(100% - 5px); opacity: 0; } }
      @keyframes bv2-nodeglow { 0%,100% { box-shadow: none; border-color: rgba(255,255,255,0.14); } 50% { box-shadow: 0 0 16px -3px #67e8f9; border-color: rgba(103,232,249,0.6); } }
      @keyframes bv2-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      @keyframes bv2-caret { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      @media (max-width: 980px) { .bv2-grid { grid-template-columns: 1fr 1fr !important; } .bv2-span2 { grid-column: span 2 !important; } .bv2-hero { grid-template-columns: 1fr !important; } }
      @media (max-width: 640px) { .bv2-grid { grid-template-columns: 1fr !important; } .bv2-span2 { grid-column: span 1 !important; } }
      @media (max-width: 760px) { .bv2-detail-cols { grid-template-columns: 1fr !important; } }
      @keyframes bv2RevealUp { from { opacity: 0; transform: translateY(42px) scale(0.99); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: no-preference) {
        @supports (animation-timeline: view()) {
          .bv2-reveal { animation: bv2RevealUp linear both; animation-timeline: view(); animation-range: entry 4% cover 28%; }
        }
      }
    `}</style>
  )
}

/* ════════ primitives ════════ */
function PV2Light({ tone, label, delay }: { tone?: string; label: string; delay?: number }) {
  const c = tone === 'amber' ? '#fbbf24' : '#4ade80'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <span className="bv2-light" style={{ '--ld': (delay || 0) + 's', width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: c, boxShadow: `0 0 9px ${c}` } as CSS} />
      <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: c }}>{label}</span>
    </span>
  )
}

type FlowNode = { label: string; shape: 'circle' | 'square' | 'diamond' | 'bars' }
function PV2FlowAnim({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '22px 18px 6px' }}>
      {nodes.map((n, i) => (
        <div key={n.label} style={{ display: 'contents' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <div className="bv2-node" style={{ '--nd': (i * 0.45) + 's' } as CSS}>
              {n.shape === 'circle' && <span style={{ width: 9, height: 9, borderRadius: '50%', border: '1.5px solid #cbd5e1', display: 'block' }} />}
              {n.shape === 'square' && <span style={{ width: 9, height: 9, borderRadius: 2, border: '1.5px solid #cbd5e1', display: 'block' }} />}
              {n.shape === 'diamond' && <span style={{ width: 9, height: 9, border: '1.5px solid #cbd5e1', transform: 'rotate(45deg)', display: 'block' }} />}
              {n.shape === 'bars' && (
                <span style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 10 }}>
                  <span style={{ width: 2.5, height: 5, background: '#cbd5e1', display: 'block' }} />
                  <span style={{ width: 2.5, height: 9, background: '#cbd5e1', display: 'block' }} />
                  <span style={{ width: 2.5, height: 7, background: '#cbd5e1', display: 'block' }} />
                </span>
              )}
            </div>
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>{n.label}</span>
          </div>
          {i < nodes.length - 1 && (
            <div className="bv2-wire" style={{ marginTop: 18 }}>
              <span className="bv2-pulse" style={{ animationDelay: (i * 0.55) + 's' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function PV2Feat({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65, fontFamily: SANS }}>
      <span style={{ fontFamily: MONO, fontSize: 11, color: '#f0abfc', flexShrink: 0 }}>+</span>
      <span>{children}</span>
    </li>
  )
}

function PV2Badges({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {items.map((t) => <span key={t} className="bv2-badge">{t}</span>)}
    </div>
  )
}

const GH_PATH = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'

function PV2GitHub({ href, label }: { href: string; label?: string }) {
  return (
    <a className="bv2-ghlink" href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
      <svg viewBox="0 0 16 16" width={11} height={11} fill="currentColor"><path d={GH_PATH} /></svg>
      {label || 'GitHub'}
    </a>
  )
}

/* ════════ 1 · banner ════════ */
function PV2Hero() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const r = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(r)
  }, [])
  const systems = [
    { name: '教師專案管理系統', env: 'prod', tone: 'live', d: 0 },
    { name: 'AICommand 排行榜', env: 'prod', tone: 'live', d: 0.4 },
    { name: '行銷文章生成工作流', env: 'n8n', tone: 'live', d: 0.8 },
    { name: '新聞電子報工作流', env: 'n8n · cron', tone: 'live', d: 1.2 },
    { name: '產品監控系統', env: 'dev', tone: 'amber', d: 0.2 },
  ]
  const ic = (on: boolean) => 'bv2-rise' + (on ? ' is-in' : '')
  return (
    <header className="bv2-hero" style={{
      maxWidth: 1180, margin: '0 auto', padding: '84px 40px 72px',
      display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 56, alignItems: 'center',
    }}>
      <div>
        <p className={ic(shown)} style={{ margin: '0 0 26px', fontFamily: MONO, fontSize: 11, letterSpacing: '0.22em', color: '#f0abfc', textTransform: 'uppercase', transitionDelay: '.05s' }}>{'// PORTFOLIO — 作品集'}</p>
        <h1 className={ic(shown)} style={{ margin: 0, fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(52px, 6.4vw, 84px)', lineHeight: 0.98, letterSpacing: '-0.035em', color: '#ffffff', transitionDelay: '.13s' }}>
          作品集<span style={{ color: '#f0abfc' }}>.</span>
        </h1>
        <p className={ic(shown)} style={{ margin: '24px 0 0', fontFamily: SANS, fontWeight: 600, fontSize: 'clamp(18px, 2.2vw, 26px)', lineHeight: 1.4, letterSpacing: '-0.01em', color: '#e2e8f0', transitionDelay: '.2s' }}>
          n8n 自動化與 AI 應用實戰案例
        </p>
        <p className={ic(shown)} style={{ margin: '20px 0 0', maxWidth: 440, fontSize: 14, lineHeight: 1.9, color: '#64748b', fontFamily: SANS, textWrap: 'pretty', transitionDelay: '.24s' } as CSS}>
          收錄 n8n 自動化流程、AI Agent 應用與 Vibe Coding 開發的真實專案。每一個都在解決實際問題、在 production 上運作。
        </p>
        <p className={ic(shown)} style={{ margin: '22px 0 0', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', color: '#475569', transitionDelay: '.32s' }}>5 個專案&ensp;·&ensp;4 個上線&ensp;·&ensp;1 個開發中&ensp;·&ensp;始於 2025</p>
      </div>

      <aside aria-label="系統狀態" className={ic(shown)} style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', boxShadow: '0 24px 70px -30px rgba(0,0,0,0.8)', transitionDelay: '.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: '#94a3b8' }}>SYS.STATUS</span>
          <PV2Light tone="live" label="all systems go" />
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0' }}>
          {systems.map((s) => (
            <li key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="bv2-light" style={{ '--ld': s.d + 's', width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: s.tone === 'amber' ? '#fbbf24' : '#4ade80', boxShadow: s.tone === 'amber' ? '0 0 8px #fbbf24' : '0 0 8px #4ade80' } as CSS} />
              <span style={{ flex: 1, fontSize: 12.5, color: '#cbd5e1', fontFamily: SANS, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', color: s.tone === 'amber' ? '#fbbf24' : '#475569' }}>{s.env}</span>
            </li>
          ))}
        </ul>
        <div style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.015)', fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: '#334155' }}>$ watch --all<span className="bv2-cursor" style={{ display: 'inline-block', width: 5, height: 11, background: '#475569', marginLeft: 6, verticalAlign: 'middle' }} /></div>
      </aside>
    </header>
  )
}

/* ════════ 2 · bento cards ════════ */
type OpenFn = (id: string) => void

function PV2CardTeaching({ onOpen }: { onOpen: OpenFn }) {
  return (
    <article onClick={() => onOpen('teaching')} className="bv2-card bv2-span2" style={{ gridColumn: 'span 2', minHeight: 330, display: 'flex', cursor: 'pointer' }}>
      <span className="bv2-view" aria-hidden="true">open ↗</span>
      <div style={{ position: 'relative', zIndex: 2, flex: '0 0 54%', padding: '28px 8px 28px 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <PV2Light tone="live" label="live" />
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: '#475569' }}>FLAGSHIP · PROD 2025</span>
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 21, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em', fontFamily: SANS }}>教師專案管理系統</h3>
        <p style={{ margin: '0 0 18px', fontSize: 12.5, color: '#64748b', lineHeight: 1.7, fontFamily: SANS }}>一個人的補習班後台——AI 幫你記課、寫報告、推通知。</p>
        <ul style={{ listStyle: 'none', margin: '0 0 22px', padding: 0, display: 'grid', gap: 7 }}>
          <PV2Feat>自然語言記課，Groq 解析成結構化資料</PV2Feat>
          <PV2Feat>Claude 自動生成諮詢報告與課程摘要</PV2Feat>
          <PV2Feat>LINE Bot 每日早 8 點推送課程提醒</PV2Feat>
        </ul>
        <div style={{ marginTop: 'auto' }}>
          <PV2Badges items={['React 19', 'Supabase', 'Groq', 'Claude API', 'Google Calendar', 'LINE Bot']} />
        </div>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', zIndex: 1 }}>
        <Image src="/works/teaching-preview.jpg" alt="" fill sizes="(max-width: 980px) 50vw, 380px" style={{ objectFit: 'cover', objectPosition: 'left top', opacity: 0.85, maskImage: 'linear-gradient(to right, transparent 0%, black 38%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 38%)' } as CSS} />
      </div>
    </article>
  )
}

function PV2CardMonitoring({ onOpen }: { onOpen: OpenFn }) {
  return (
    <article onClick={() => onOpen('monitoring')} className="bv2-card" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <span className="bv2-view" aria-hidden="true">open ↗</span>
      <div aria-hidden="true" style={{ position: 'relative', height: 132, flexShrink: 0 }}>
        <Image src="/works/monitoring-preview.jpg" alt="" fill sizes="(max-width: 980px) 50vw, 380px" style={{ objectFit: 'cover', objectPosition: 'top', opacity: 0.8, maskImage: 'linear-gradient(to bottom, black 45%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 100%)' } as CSS} />
      </div>
      <div style={{ position: 'relative', zIndex: 2, padding: '4px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <PV2Light tone="amber" label="building" delay={0.3} />
          <PV2GitHub href="https://github.com/akangdesigner/productmonitoring" />
        </div>
        <h3 style={{ margin: '0 0 7px', fontSize: 16.5, fontWeight: 700, color: '#ffffff', fontFamily: SANS }}>產品監控系統</h3>
        <p style={{ margin: '0 0 18px', fontSize: 12.5, color: '#64748b', lineHeight: 1.7, fontFamily: SANS }}>爬蟲全天候追蹤各平台售價與庫存，異常即時 LINE 推播。</p>
        <div style={{ marginTop: 'auto' }}><PV2Badges items={['Node.js', 'React', 'SQLite', 'Docker']} /></div>
      </div>
    </article>
  )
}

function PV2CardFlow({ id, onOpen, nodes, light, lightDelay, title, desc, badges }: {
  id: string; onOpen: OpenFn; nodes: FlowNode[]; light: string; lightDelay: number; title: string; desc: string; badges: string[]
}) {
  return (
    <article onClick={() => onOpen(id)} className="bv2-card" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <span className="bv2-view" aria-hidden="true">open ↗</span>
      <PV2FlowAnim nodes={nodes} />
      <div style={{ position: 'relative', zIndex: 2, padding: '14px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: 12 }}><PV2Light tone="live" label={light} delay={lightDelay} /></div>
        <h3 style={{ margin: '0 0 7px', fontSize: 16.5, fontWeight: 700, color: '#ffffff', fontFamily: SANS }}>{title}</h3>
        <p style={{ margin: '0 0 18px', fontSize: 12.5, color: '#64748b', lineHeight: 1.7, fontFamily: SANS }}>{desc}</p>
        <div style={{ marginTop: 'auto' }}><PV2Badges items={badges} /></div>
      </div>
    </article>
  )
}

function PV2CardAICommand({ onOpen }: { onOpen: OpenFn }) {
  const rows = [
    { rank: 1, name: 'Claude Code', heat: 100 },
    { rank: 2, name: 'Cursor', heat: 84 },
    { rank: 3, name: 'n8n', heat: 67 },
  ]
  return (
    <article onClick={() => onOpen('aicommand')} className="bv2-card" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <span className="bv2-view" aria-hidden="true">open ↗</span>
      <div aria-hidden="true" style={{ padding: '20px 24px 4px' }}>
        {rows.map((r) => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
            <span style={{ width: 14, fontFamily: MONO, fontSize: 10, fontWeight: 700, color: r.rank === 1 ? '#fbbf24' : '#475569', textAlign: 'center' }}>{r.rank}</span>
            <span style={{ width: 76, fontSize: 11, color: '#94a3b8', fontFamily: MONO, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
            <span style={{ flex: 1, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'block' }}>
              <span style={{ display: 'block', height: '100%', width: r.heat + '%', borderRadius: 999, background: r.rank === 1 ? 'linear-gradient(90deg, #fbbf24, #fde68a)' : '#334155' }} />
            </span>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 2, padding: '14px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <PV2Light tone="live" label="live" delay={1.4} />
          <a className="bv2-ghlink" href="https://aicommand.aiqkangber.com" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>↗ aicommand</a>
        </div>
        <h3 style={{ margin: '0 0 7px', fontSize: 16.5, fontWeight: 700, color: '#ffffff', fontFamily: SANS }}>AICommand · AI 工具排行榜</h3>
        <p style={{ margin: '0 0 18px', fontSize: 12.5, color: '#64748b', lineHeight: 1.7, fontFamily: SANS }}>六大社群的真實討論，量化成 AI 工具熱度榜。</p>
        <div style={{ marginTop: 'auto' }}><PV2Badges items={['Next.js', 'Python', 'PostgreSQL']} /></div>
      </div>
    </article>
  )
}

function PV2CardMore() {
  return (
    <article className="bv2-card bv2-span2" style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '22px 24px', background: 'rgba(255,255,255,0.015)' }}>
      <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', color: '#475569' }}>
        <span style={{ color: '#64748b' }}>{'// '}</span>更多作品即將上線
      </span>
      <span className="bv2-cursor" style={{ display: 'inline-block', width: 6, height: 13, background: '#475569' }} />
    </article>
  )
}

function PV2Bento({ onOpen }: { onOpen: OpenFn }) {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 110px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', color: '#475569' }}>SELECTED WORKS</span>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: '#334155' }}>01 — 05</span>
      </div>
      <div className="bv2-grid bv2-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <PV2CardTeaching onOpen={onOpen} />
        <PV2CardMonitoring onOpen={onOpen} />
        <PV2CardFlow id="marketing" onOpen={onOpen} nodes={[{ label: 'webhook', shape: 'circle' }, { label: 'search', shape: 'square' }, { label: 'ai', shape: 'diamond' }, { label: 'sheets', shape: 'bars' }]} light="active · n8n" lightDelay={0.6} title="行銷文章生成工作流" desc="關鍵字進、多平台文案出——初稿時間省下 80%。" badges={['n8n', 'Groq', 'OpenRouter', 'Sheets']} />
        <PV2CardFlow id="newsletter" onOpen={onOpen} nodes={[{ label: 'cron', shape: 'circle' }, { label: 'news', shape: 'square' }, { label: 'ai', shape: 'diamond' }, { label: 'gmail', shape: 'square' }]} light="active · cron" lightDelay={1.0} title="新聞趨勢電子報工作流" desc="每日自動彙整 AI 新聞，AI 摘要後寄送給訂閱者。" badges={['n8n', 'Google News', 'Groq', 'Gmail']} />
        <PV2CardAICommand onOpen={onOpen} />
        <PV2CardMore />
      </div>
    </section>
  )
}

/* ════════ detail data ════════ */
type Seg = { label: string; color: string; frac?: number }
type Widget =
  | { type: 'donut'; span: number; tag: string; center: string; centerSub?: string; segs: Seg[] }
  | { type: 'bars'; span: number; tag: string; big: string; unit?: string; bars: number[]; sub: string }
  | { type: 'accent'; span: number; tag: string; big: string; unit?: string; sub: string }
  | { type: 'stat'; span: number; tag: string; big: string; unit?: string; sub: string }
  | { type: 'iconlist'; span: number; tag: string; rows: { label: string; color: string }[] }
type GalleryItem = { src: string; label: string; wide?: boolean; full?: boolean; aspect?: string }
type Detail = {
  id: string; index: string; tone: string; light: string; env: string; title: string; tagline: string
  links: { kind: string; href: string; label: string }[]
  media: { src: string; bar: string; aspect?: string; pos?: string }
  purpose: { heading: string; paras: string[] }
  features: { title: string; desc: string }[]
  stack: string[]
  dash: { hero: { big: string; unit?: string; glyph: string; glyphSub: string; title: string; desc: string }; widgets: Widget[] }
  gallery: null | { label: string; items: GalleryItem[] }
}

const PV2_DETAILS: Detail[] = [
  {
    id: 'teaching', index: '01', tone: 'live', light: 'live', env: 'PROD · 2025',
    title: '教師專案管理系統', tagline: '「一個人的補習班後台，AI 幫你記課、寫報告、推通知」', links: [],
    media: { src: '/works/teaching-preview.jpg', bar: '教學管理系統 · localhost:5173' },
    purpose: {
      heading: '1 對 1 線上教師的全功能後台',
      paras: [
        '市面上沒有專為獨立教師設計的管理工具——學生都在 LINE 上，課程紀錄在筆記本，提醒得自己記。這個系統就是為了補上這個缺口。',
        '用自然語言說「今天跟小明上了代數」，AI 自動解析成結構化紀錄；下課後 Claude 生成當堂摘要；隔天早上 LINE Bot 提醒你今天有哪些學生要上課。',
      ],
    },
    features: [
      { title: '學生進度管理', desc: '試聽 / 進行中 / 已完成三階段追蹤，一覽無遺' },
      { title: 'AI 助理', desc: '自然語言輸入課程紀錄，Groq 解析成結構化資料' },
      { title: 'Google Calendar 同步', desc: '課程自動寫入 / 讀取個人行事曆' },
      { title: '自動報告生成', desc: 'Claude API 生成諮詢報告、課程摘要，匯出 Word / PPT' },
      { title: 'LINE Bot 通知', desc: '每日早 8 點推送當日課程提醒' },
    ],
    stack: ['React 19', 'Vite', 'Supabase', 'Groq API', 'Claude API', 'Google Calendar API', 'LINE Bot', 'TailwindCSS'],
    dash: {
      hero: { big: '1', unit: '句話', glyph: 'AI', glyphSub: 'Groq 引擎', title: 'AI 助理記課', desc: '用一句自然語言輸入，Groq 即時把口語結構化成完整課程紀錄，免填表單。' },
      widgets: [
        { type: 'donut', span: 2, tag: '學生進度', center: '3', centerSub: '階段', segs: [{ label: '試聽', color: '#8b5cf6' }, { label: '進行中', color: '#22d3ee' }, { label: '已完成', color: '#ec4899' }] },
        { type: 'bars', span: 4, tag: '每日提醒', big: '08:00', bars: [3, 4, 3, 5, 4, 6, 7], sub: 'LINE Bot 每天早 8 點推送當日課程提醒' },
        { type: 'accent', span: 4, tag: '自動報告', big: '1鍵', sub: 'Claude 生成諮詢報告與課程摘要，匯出 Word · PPT' },
        { type: 'stat', span: 2, tag: '行事曆', big: '雙向', sub: '課程自動寫入 / 讀取 Google Calendar' },
      ],
    },
    gallery: null,
  },
  {
    id: 'monitoring', index: '02', tone: 'amber', light: 'building', env: 'DEV · 2026',
    title: '產品監控系統', tagline: '「自動盯盤、價格追蹤、異常即推播——讓資料替你守夜」',
    links: [{ kind: 'github', href: 'https://github.com/akangdesigner/productmonitoring', label: 'GitHub' }],
    media: { src: '/works/monitoring-preview.jpg', bar: '產品比價監控台 · Beauty Intel v1.0' },
    purpose: {
      heading: '自有品牌的 24hr 自動守價機器人',
      paras: [
        '人工盯競品價格又費時又容易漏接——這套系統讓爬蟲替你持續監控各平台商品售價與庫存，比對自有品牌定價，一旦發現異常立即推播通知。',
        '三層架構設計讓資料存取、業務邏輯、前端展示完全解耦，新增監控平台只需加一個 scraper module，不影響其他層。以微服務思想打造，可獨立擴展任一層。',
      ],
    },
    features: [
      { title: '網路爬蟲監控', desc: '自動抓取各平台商品價格，比對自有品牌與市場即時定價' },
      { title: '即時數據儀表板', desc: 'React + Vite 前端呈現監控數據，支援圖表與時間軸視覺化' },
      { title: '告警通知系統', desc: '價格異常或庫存變動時自動觸發 LINE 推播通知' },
      { title: '排程任務引擎', desc: 'Node.js 排程定時執行爬蟲，數據自動入庫無需人工介入' },
      { title: 'CSV 匯出分析', desc: '商品監控數據一鍵匯出，支援批量比對與離線分析' },
    ],
    stack: ['Node.js', 'Express', 'React', 'Vite', 'SQLite', 'Docker', 'RESTful API', 'LINE Messaging API'],
    dash: {
      hero: { big: '24/7', glyph: '守價', glyphSub: '自動盯盤', title: '全天候爬蟲監控', desc: '爬蟲持續監控各平台商品售價與庫存，比對自有品牌定價，發現異常立即推播。' },
      widgets: [
        { type: 'iconlist', span: 2, tag: '即時告警', rows: [{ label: 'LINE 推播', color: '#8b5cf6' }, { label: '價格異常', color: '#ec4899' }, { label: '庫存變動', color: '#fbbf24' }] },
        { type: 'bars', span: 4, tag: '排程引擎', big: '定時', bars: [4, 5, 4, 6, 5, 6, 5], sub: 'Node.js 排程定時執行爬蟲，數據自動入庫無需人工' },
        { type: 'accent', span: 4, tag: '數據儀表板', big: '即時', sub: 'React + Vite 圖表與時間軸視覺化監控數據' },
        { type: 'stat', span: 2, tag: '匯出分析', big: 'CSV', sub: '監控數據一鍵匯出，批量比對離線分析' },
      ],
    },
    gallery: null,
  },
  {
    id: 'marketing', index: '03', tone: 'live', light: 'active', env: 'n8n · 2026',
    title: '行銷文章生成工作流', tagline: '「輸入關鍵字，n8n 自動找資料、生文章、改寫成各平台格式」', links: [],
    media: { src: '/works/marketing-workflow.png', bar: 'workflow.json · Marketing Article Generator', aspect: '16/7', pos: 'center' },
    purpose: {
      heading: '一鍵從關鍵字到多平台行銷文案',
      paras: [
        '輸入文章標題與關鍵字，Webhook 觸發工作流，n8n 自動網路搜尋相關資料、調用 AI 生成初稿，再依各社群平台邏輯改寫格式。',
        '建議仍需手動改稿確保文章真實性，但可省下 80% 的初稿時間。最終輸出自動寫回 Google Sheets 存檔。',
      ],
    },
    features: [
      { title: '自動資料蒐集', desc: 'Webhook 接收關鍵字後，n8n 自動搜尋網路相關資訊作為文章素材' },
      { title: 'AI 初稿生成', desc: '多 LLM 並行（Groq + OpenRouter），依需求選用不同模型生成初稿' },
      { title: '多平台格式改寫', desc: '同一篇文章自動改寫為 Instagram、Facebook、Twitter/X、LINE 各平台格式' },
      { title: '配圖生成', desc: '文章生成後觸發圖片生成節點，自動產生封面圖並上傳 Google Drive' },
      { title: 'Sheets 自動存檔', desc: '所有輸出文案與圖片連結自動 append 到 Google Sheets，方便批量管理' },
    ],
    stack: ['n8n', 'Webhook', 'Groq API', 'OpenRouter API', 'Google Sheets', 'AI Agent'],
    dash: {
      hero: { big: '80', unit: '%', glyph: 'AI', glyphSub: '多 LLM', title: '初稿時間省下 80%', desc: '輸入關鍵字，Webhook 觸發 n8n 自動搜尋素材、多 LLM 並行生成行銷初稿。' },
      widgets: [
        { type: 'donut', span: 2, tag: '多 LLM 並行', center: '2', centerSub: '模型', segs: [{ label: 'Groq', color: '#8b5cf6' }, { label: 'OpenRouter', color: '#22d3ee' }] },
        { type: 'iconlist', span: 4, tag: '多平台改寫', rows: [{ label: 'Instagram', color: '#ec4899' }, { label: 'Facebook', color: '#3b82f6' }, { label: 'Threads', color: '#e2e8f0' }, { label: 'LINE', color: '#2dd4bf' }] },
        { type: 'accent', span: 4, tag: '自動存檔', big: '存檔', sub: '文案與圖片連結自動 append 到 Google Sheets' },
        { type: 'stat', span: 2, tag: '配圖生成', big: '配圖', sub: '自動產生封面圖並上傳 Google Drive' },
      ],
    },
    gallery: { label: '輸出範例', items: [{ src: '/works/marketing-instagram.png', label: 'Instagram' }, { src: '/works/marketing-twitter.png', label: 'Threads' }] },
  },
  {
    id: 'newsletter', index: '04', tone: 'live', light: 'active', env: 'n8n · CRON',
    title: '新聞趨勢整合電子報工作流', tagline: '「每日自動搜尋 AI 議題，整合成可讀新聞摘要寄出」', links: [],
    media: { src: '/works/newsletter-workflow.png', bar: '電子報 · workflow.json', aspect: '16/7' },
    purpose: {
      heading: 'AI 新聞自動追蹤 + 電子報全自動生成',
      paras: [
        'Schedule Trigger 每日定時啟動，同步抓取三個 Google News 頻道的最新 AI 議題，自動爬取各文章全文，再交由 AI 整合成有觀點的摘要。',
        '整合完成後格式化成電子報，寫入 Google Sheets 存檔，並透過 Gmail 自動寄送給訂閱者。底部 Webhook 節點支援訂閱者動態新增至名單。',
      ],
    },
    features: [
      { title: '每日排程觸發', desc: 'Schedule Trigger 定時啟動，無需手動操作，每天自動執行一次' },
      { title: '多源 Google News 搜尋', desc: '平行抓取三個搜尋頻道，覆蓋 AI 工具發布、研究動態、產業趨勢' },
      { title: '全文爬蟲', desc: '/scrape 節點抓取文章原文，AI 有足夠內容生成有深度的摘要' },
      { title: 'AI 雙模型摘要', desc: 'Groq + OpenRouter 並行處理，確保輸出品質與速度平衡' },
      { title: 'Gmail 自動發送', desc: '整合完成後直接寄出，支援訂閱者名單管理，Webhook 動態新增訂閱' },
    ],
    stack: ['n8n', 'Schedule Trigger', 'Google News', '/scrape', 'Groq API', 'OpenRouter API', 'Google Sheets', 'Gmail'],
    dash: {
      hero: { big: '0', unit: '人工', glyph: 'CRON', glyphSub: '每日觸發', title: '全自動運行', desc: '每日排程 → 多源搜尋 → 全文爬取 → AI 雙模型摘要 → Gmail 寄送，全程零人工。' },
      widgets: [
        { type: 'donut', span: 2, tag: '多源搜尋', center: '3', centerSub: '來源', segs: [{ label: '工具發布', color: '#8b5cf6' }, { label: '研究動態', color: '#22d3ee' }, { label: '產業趨勢', color: '#fbbf24' }] },
        { type: 'bars', span: 4, tag: '排程觸發', big: '每日', bars: [5, 5, 5, 5, 5, 5, 5], sub: 'Schedule Trigger 定時啟動，無需手動操作' },
        { type: 'accent', span: 4, tag: '自動發送', big: 'Gmail', sub: '整合後直接寄出，Webhook 支援訂閱者動態新增' },
        { type: 'stat', span: 2, tag: '全文爬蟲', big: '全文', sub: '/scrape 抓原文，供 AI 深度摘要' },
      ],
    },
    gallery: { label: '輸出範例', items: [{ src: '/works/newsletter-email.png', label: 'Gmail · Q kangber 週報', wide: true }] },
  },
  {
    id: 'aicommand', index: '05', tone: 'live', light: 'live', env: 'PROD · LIVE',
    title: 'AICommand · AI 工具排行榜', tagline: '「從六大社群挖真實討論，幫 AI 工具排出熱度榜」',
    links: [
      { kind: 'ext', href: 'https://aicommand.aiqkangber.com', label: '↗ aicommand.aiqkangber.com' },
      { kind: 'github', href: 'https://github.com/akangdesigner/aicommand', label: 'GitHub' },
    ],
    media: { src: '/works/aicommand-rankings.png', bar: 'aicommand.aiqkangber.com · AI 工具熱度排行', aspect: '1416/861', pos: 'top' },
    purpose: {
      heading: '用真實社群討論排出 AI 工具熱度榜',
      paras: [
        '選 AI 工具時，行銷話術看不出真實口碑。AICommand 從 Reddit、Hacker News、PTT、GitHub、Dcard、Threads 六大社群抓取真實討論，量化成熱度分數與排行榜。',
        '資料流由 Python 爬蟲 + Pipeline 持續抓取與清洗，存進 PostgreSQL，再由 Next.js 前端呈現排行、情緒標記與「Vibe Search」即時熱門。',
      ],
    },
    features: [
      { title: '六大社群來源', desc: 'Reddit、Hacker News、PTT、GitHub、Dcard、Threads 一次彙整真實討論' },
      { title: '熱度分數排名', desc: '結合討論量、情緒傾向、來源權重與週成長，算出每個工具的熱度' },
      { title: 'Vibe Search', desc: '依「氛圍」搜尋當下熱門工具，看開發者社群實際在討論什麼' },
      { title: '分類追蹤', desc: '程式開發、寫作、生圖、生影片、自動化等類別分開排行' },
      { title: '真實開發者聲音', desc: '附帶情緒標記的社群原始討論，不只看行銷話術' },
    ],
    stack: ['Next.js', 'TypeScript', 'Python', 'PostgreSQL', '多平台爬蟲', '資料 Pipeline'],
    dash: {
      hero: { big: '100', unit: '分', glyph: 'HEAT', glyphSub: '量化模型', title: '社群熱度分數排名', desc: '結合討論量、情緒傾向、來源權重與週成長，算出每個 AI 工具的 0–100 熱度分數。' },
      widgets: [
        { type: 'donut', span: 2, tag: '分類排行', center: '5', centerSub: '類別', segs: [{ label: '程式開發', color: '#8b5cf6' }, { label: '寫作', color: '#22d3ee' }, { label: '生圖', color: '#ec4899' }, { label: '生影片', color: '#fbbf24' }, { label: '自動化', color: '#2dd4bf' }] },
        { type: 'iconlist', span: 4, tag: '六大社群', rows: [{ label: 'Reddit', color: '#fb7185' }, { label: 'Hacker News', color: '#fbbf24' }, { label: 'PTT', color: '#22d3ee' }, { label: 'GitHub', color: '#e2e8f0' }, { label: 'Dcard', color: '#3b82f6' }, { label: 'Threads', color: '#ec4899' }] },
        { type: 'accent', span: 4, tag: '真實聲音', big: '真實', sub: '附情緒標記的社群原始討論，不只看行銷話術' },
        { type: 'stat', span: 2, tag: 'Vibe Search', big: '即時', sub: '依氛圍搜尋當下熱門工具' },
      ],
    },
    gallery: {
      label: '產品畫面',
      items: [
        { src: '/works/aicommand-home.png', label: '首頁 · Vibe Search', full: true, aspect: '1563/862' },
        { src: '/works/aicommand-news.png', label: '最新動態' },
        { src: '/works/aicommand-glossary.png', label: '名詞解釋' },
      ],
    },
  },
]

/* ════════ detail widgets ════════ */
function PV2DLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 10, fontFamily: MONO, color: '#a78bfa', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 14px' }}>{'// '}{children}</p>
}

function PV2DMedia({ media }: { media: Detail['media'] }) {
  return (
    <div style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', boxShadow: '0 0 0 1px rgba(124,92,255,0.12), 0 24px 70px -20px rgba(0,0,0,0.7)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
        <span style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.8, display: 'block' }} />)}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#475569', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{media.bar}</span>
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: media.aspect || '16/9' }}>
        <Image src={media.src} alt={media.bar} fill sizes="(max-width: 920px) 100vw, 920px" style={{ objectFit: 'cover', objectPosition: media.pos || 'top' }} />
      </div>
    </div>
  )
}

function PV2Big({ val, unit, size = 38, color = '#fff', ucolor = PAL.vio2 }: { val: string; unit?: string; size?: number; color?: string; ucolor?: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'baseline', gap: 5, width: 'fit-content', lineHeight: 1 }}>
      <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: '-0.025em', color }}>{val}</span>
      {unit && <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: Math.round(size * 0.42), color: ucolor }}>{unit}</span>}
    </span>
  )
}

function PV2DTag({ children, c = PAL.vio2 }: { children: React.ReactNode; c?: string }) {
  return <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: c }}>{children}</span>
}

function donutStops(segs: Seg[]): string {
  const total = segs.reduce((s, x) => s + (x.frac || 1), 0)
  let acc = 0
  return segs.map((s) => {
    const f = (s.frac || 1) / total
    const from = acc * 360; acc += f; const to = acc * 360
    return `${s.color} ${from}deg ${to}deg`
  }).join(', ')
}

function PV2Donut({ segs, center, sub, size = 92, stroke = 12 }: { segs: Seg[]; center: string; sub?: string; size?: number; stroke?: number }) {
  const stops = donutStops(segs)
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: `conic-gradient(${stops})` }} />
      <div style={{ position: 'absolute', inset: stroke, borderRadius: '50%', background: '#0a0b16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 25, color: '#fff', lineHeight: 1 }}>{center}</span>
        {sub && <span style={{ fontFamily: SANS, fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{sub}</span>}
      </div>
    </div>
  )
}

function PV2DWidget({ w }: { w: Widget }) {
  const base: CSS = { gridColumn: 'span ' + w.span, position: 'relative', overflow: 'hidden', borderRadius: 16, padding: '16px 18px', display: 'flex', flexDirection: 'column', minHeight: 118 }

  if (w.type === 'accent') {
    return (
      <div className="bv2-dw bv2-dw-accent" style={{ ...base, justifyContent: 'space-between', background: 'linear-gradient(130deg, #7c5cff 0%, #a855f7 52%, #ec4899 100%)', boxShadow: '0 18px 44px -22px rgba(168,85,247,0.7)', border: '1px solid rgba(255,255,255,0.14)' }}>
        <PV2DTag c="rgba(255,255,255,0.82)">{w.tag}</PV2DTag>
        <div>
          <PV2Big val={w.big} unit={w.unit} size={w.big.length > 3 ? 27 : 36} ucolor="rgba(255,255,255,0.85)" />
          <span style={{ display: 'block', fontSize: 12.5, color: 'rgba(255,255,255,0.92)', marginTop: 8, lineHeight: 1.5, fontFamily: SANS }}>{w.sub}</span>
        </div>
      </div>
    )
  }
  if (w.type === 'donut') {
    return (
      <div className="bv2-dw" style={{ ...base, flexDirection: 'row', alignItems: 'center', gap: 16, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
        <PV2Donut segs={w.segs} center={w.center} sub={w.centerSub} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <PV2DTag>{w.tag}</PV2DTag>
          <div style={{ marginTop: 10, display: 'grid', gap: 7 }}>
            {w.segs.map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: '#cbd5e1', fontWeight: 500, fontFamily: SANS, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (w.type === 'iconlist') {
    return (
      <div className="bv2-dw" style={{ ...base, justifyContent: 'flex-start', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
        <PV2DTag>{w.tag}</PV2DTag>
        <div style={{ marginTop: 13, display: 'grid', gap: '9px 16px', gridTemplateColumns: w.rows.length > 3 ? '1fr 1fr' : '1fr' }}>
          {w.rows.map((r) => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: r.color, flexShrink: 0, boxShadow: `0 0 9px ${r.color}` }} />
              <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500, fontFamily: SANS, whiteSpace: 'nowrap' }}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (w.type === 'bars') {
    const max = Math.max(...w.bars)
    return (
      <div className="bv2-dw" style={{ ...base, justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <PV2DTag c={PAL.cyan}>{w.tag}</PV2DTag>
          <PV2Big val={w.big} unit={w.unit} size={w.big.length > 3 ? 22 : 28} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 48, margin: '14px 0 0' }}>
          {w.bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h / max * 100}%`, borderRadius: 4, background: i === w.bars.length - 1 ? 'linear-gradient(180deg, #a78bfa, #22d3ee)' : 'rgba(167,139,250,0.3)' }} />
          ))}
        </div>
        <span style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, lineHeight: 1.5, fontFamily: SANS }}>{w.sub}</span>
      </div>
    )
  }
  // stat
  return (
    <div className="bv2-dw" style={{ ...base, justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
      <PV2DTag>{w.tag}</PV2DTag>
      <div>
        <PV2Big val={w.big} unit={w.unit} size={String(w.big).length > 3 ? 26 : 36} />
        <span style={{ display: 'block', fontSize: 12.5, color: '#94a3b8', marginTop: 8, lineHeight: 1.5, fontFamily: SANS }}>{w.sub}</span>
      </div>
    </div>
  )
}

function PV2Dashboard({ dash, count }: { dash: Detail['dash']; count: number }) {
  const h = dash.hero
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <span style={{ fontSize: 10, fontFamily: MONO, color: '#a78bfa', letterSpacing: '0.16em', textTransform: 'uppercase', flexShrink: 0 }}>{'// 重點功能 × 指標'}</span>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(167,139,250,0.25), transparent)' }} />
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: '#334155' }}>{String(count).padStart(2, '0')} 項功能</span>
      </div>
      <div className="bv2-dash">
        <div className="bv2-dw bv2-dw-hero" style={{ gridColumn: 'span 6', borderRadius: 18, overflow: 'hidden', position: 'relative', border: '1px solid rgba(167,139,250,0.32)', background: 'radial-gradient(130% 150% at 6% 0%, rgba(124,92,255,0.22), transparent 55%), linear-gradient(180deg, rgba(124,92,255,0.07), rgba(2,3,10,0)), #0a0b16', padding: 'clamp(22px, 3vw, 28px) clamp(24px, 4vw, 32px)', display: 'flex', alignItems: 'center', gap: 26 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <PV2DTag c={PAL.vio3}>{'旗艦功能 · Flagship'}</PV2DTag>
            <div style={{ margin: '12px 0 8px' }}><PV2Big val={h.big} unit={h.unit} size={58} ucolor={PAL.vio3} /></div>
            <span style={{ display: 'block', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em', fontFamily: SANS }}>{h.title}</span>
            <span style={{ display: 'block', fontSize: 13.5, color: '#94a3b8', lineHeight: 1.62, maxWidth: 380, fontFamily: SANS }}>{h.desc}</span>
          </div>
          <div style={{ position: 'relative', width: 138, height: 138, flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 210deg, #8b5cf6, #ec4899, #22d3ee, #8b5cf6)', opacity: 0.92 }} />
            <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', background: '#0a0b16', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: h.glyph.length > 3 ? 22 : 32, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{h.glyph}</span>
              <span style={{ fontFamily: SANS, fontSize: 10.5, color: '#a78bfa' }}>{h.glyphSub}</span>
            </div>
          </div>
        </div>
        {dash.widgets.map((w, k) => <PV2DWidget key={k} w={w} />)}
      </div>
    </section>
  )
}

/* ════════ overlay ════════ */
function PV2DetailOverlay({ openId, onClose, onOpen }: { openId: string | null; onClose: () => void; onOpen: OpenFn }) {
  const i = PV2_DETAILS.findIndex((d) => d.id === openId)
  const data = i >= 0 ? PV2_DETAILS[i] : null

  useEffect(() => {
    if (!data) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onOpen(PV2_DETAILS[(i + 1) % PV2_DETAILS.length].id)
      if (e.key === 'ArrowLeft') onOpen(PV2_DETAILS[(i - 1 + PV2_DETAILS.length) % PV2_DETAILS.length].id)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [openId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return null
  const prev = PV2_DETAILS[(i - 1 + PV2_DETAILS.length) % PV2_DETAILS.length]
  const next = PV2_DETAILS[(i + 1) % PV2_DETAILS.length]

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(2,3,10,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', overflowY: 'auto', padding: '6vh 20px 8vh' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 920, margin: '0 auto', borderRadius: 22, border: '1px solid rgba(167,139,250,0.22)', background: 'linear-gradient(180deg, rgba(124,92,255,0.07), rgba(2,3,10,0) 240px), #070812', boxShadow: '0 0 0 1px rgba(124,92,255,0.1), 0 40px 120px -30px rgba(0,0,0,0.9)', padding: 'clamp(24px, 4vw, 44px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', color: '#475569' }}>CASE {data.index} <span style={{ color: '#334155' }}>/ 05</span></span>
          <button onClick={onClose} aria-label="關閉" style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', fontSize: 14, cursor: 'pointer', fontFamily: MONO, display: 'grid', placeItems: 'center' }}>✕</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
          <PV2Light tone={data.tone} label={data.light} />
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: '#475569' }}>{data.env}</span>
          {data.links.map((l) => (
            <a key={l.href} className="bv2-ghlink" href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11 }}>
              {l.kind === 'github' && <svg viewBox="0 0 16 16" width={11} height={11} fill="currentColor"><path d={GH_PATH} /></svg>}
              {l.label}
            </a>
          ))}
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', fontFamily: SANS }}>{data.title}</h2>
        <p style={{ margin: '0 0 28px', fontSize: 13, fontFamily: MONO, color: '#f0abfc', letterSpacing: '0.02em' }}>{data.tagline}</p>

        <div style={{ marginBottom: 28 }}><PV2DMedia media={data.media} /></div>

        <PV2Dashboard dash={data.dash} count={data.features.length} />

        <section style={{ marginBottom: 40 }}>
          <div className="bv2-detail-cols" style={{ display: 'grid', gridTemplateColumns: '0.82fr 1.18fr', gap: 'clamp(22px, 4vw, 54px)', alignItems: 'start' }}>
            <div style={{ borderLeft: '2px solid rgba(167,139,250,0.55)', paddingLeft: 22 }}>
              <PV2DLabel>核心用途</PV2DLabel>
              <h3 style={{ margin: 0, fontSize: 'clamp(19px, 2.2vw, 23px)', fontWeight: 700, color: '#fff', lineHeight: 1.38, letterSpacing: '-0.01em', fontFamily: SANS, textWrap: 'balance' } as CSS}>{data.purpose.heading}</h3>
            </div>
            <div>
              {data.purpose.paras.map((t, k) => (
                <p key={k} style={{ fontSize: 14.5, color: '#cbd5e1', lineHeight: 1.95, fontFamily: SANS, margin: k < data.purpose.paras.length - 1 ? '0 0 16px' : 0, textWrap: 'pretty' } as CSS}>{t}</p>
              ))}
            </div>
          </div>
        </section>

        {data.gallery && (
          <div style={{ marginBottom: 28 }}>
            <PV2DLabel>{data.gallery.label}</PV2DLabel>
            <div className="bv2-detail-cols" style={{ display: 'grid', gap: 14, gridTemplateColumns: data.gallery.items.length > 1 ? '1fr 1fr' : 'minmax(0, 720px)' }}>
              {data.gallery.items.map((g) => (
                <div key={g.src} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', gridColumn: g.full ? '1 / -1' : undefined }}>
                  <div style={{ padding: '7px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa' }}>{g.label}</div>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: g.aspect || (g.wide ? '16/9' : '4/3') }}>
                    <Image src={g.src} alt={g.label} fill sizes="(max-width: 920px) 100vw, 720px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <PV2DLabel>Tech Stack</PV2DLabel>
          <PV2Badges items={data.stack} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => onOpen(prev.id)} className="bv2-navbtn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, padding: '10px 14px', borderRadius: 12, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: '#94a3b8', fontFamily: SANS, textAlign: 'left', maxWidth: '46%' }}>
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: '#475569' }}>← PREV · {prev.index}</span>
            <span style={{ fontSize: 12.5, color: '#cbd5e1' }}>{prev.title}</span>
          </button>
          <button onClick={() => onOpen(next.id)} className="bv2-navbtn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, padding: '10px 14px', borderRadius: 12, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: '#94a3b8', fontFamily: SANS, textAlign: 'right', maxWidth: '46%' }}>
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: '#475569' }}>NEXT · {next.index} →</span>
            <span style={{ fontSize: 12.5, color: '#cbd5e1' }}>{next.title}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ════════ page ════════ */
export default function PortfolioV2() {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#02030a', color: '#e2e8f0', overflow: 'hidden' }}>
      <PV2Styles />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, height: 680, pointerEvents: 'none', background: 'radial-gradient(ellipse 100% 55% at 50% -10%, rgba(124,92,255,0.10), transparent 70%)' }} />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <PV2Hero />
        <PV2Bento onOpen={setOpenId} />
      </main>
      <PV2DetailOverlay openId={openId} onClose={() => setOpenId(null)} onOpen={setOpenId} />
    </div>
  )
}
