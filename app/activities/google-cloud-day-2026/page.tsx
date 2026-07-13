import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import StatusTag from '@/components/activities/StatusTag'
import { getActivitySessions } from '@/lib/activities-content'
import { buildMetadata } from '@/lib/metadata'
import { jsonLdScript } from '@/lib/jsonld'

export const metadata = buildMetadata({
  title: { absolute: 'Google Cloud Day 2026 八場講座筆記 — Q kangber 活動分享' },
  description:
    '2026-07-09 Google Cloud Day Taipei 現場第一手筆記：Gemini Enterprise、多模態 AI Agent、開放 Lakehouse、BigQuery 對話式 Agent、生成式媒體 AI、GECX Agentic Commerce 與 ADK，共八場完整整理。',
  path: '/activities/google-cloud-day-2026',
  type: 'article',
  publishedTime: '2026-07-09',
  authors: ['Q kangber'],
})

const MONO = 'var(--font-jetbrains), ui-monospace, monospace'

/** 錨點 id：依 order 組 s01~s08 */
function anchorId(order: number) {
  return `s${String(order).padStart(2, '0')}`
}

export default function CloudDay2026Page() {
  const sessions = getActivitySessions('cloud-day-2026')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Google Cloud Day 2026 八場講座筆記',
    description:
      'Google Cloud Day Taipei 2026 現場第一手筆記：Gemini Enterprise、多模態 AI Agent、開放 Lakehouse、BigQuery 對話式 Agent、生成式媒體 AI、GECX Agentic Commerce 與 ADK，共八場完整整理。',
    url: 'https://aiqkangber.com/activities/google-cloud-day-2026',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    author: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
      sameAs: [
        'https://www.threads.com/@q_kangber',
        'https://www.instagram.com/q_kangber',
      ],
    },
    publisher: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com',
    },
  }

  return (
    <main className="relative overflow-hidden pb-16 sm:pb-24">
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.16), transparent 60%)' }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.03 }} />

      <div className="max-w-[940px] mx-auto px-4 sm:px-6 pt-12 sm:pt-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
        <Breadcrumbs crumbs={[
          { label: '首頁', href: '/' },
          { label: '活動分享', href: '/activities' },
          { label: 'Google Cloud Day 2026' },
        ]} />

        {/* hero */}
        <header className="mb-12 sm:mb-16">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full" style={{ padding: '6px 15px', border: '1px solid rgba(124,92,255,0.3)', background: 'rgba(124,92,255,0.07)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#c4b5fd' }}>
              Google Cloud Day 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.12] mb-5">
            Google Cloud Day 2026<br className="hidden sm:block" /> 八場講座筆記
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-[58ch] text-base sm:text-[1.0625rem]">
            2026 年 7 月 9 日在台北現場聽完一整天，從上午主題演講到下午的資料平台、智慧代理場次，再到開發者社群專場——每場的重點投影片、講者觀點與我自己的實務總結，全部整理在這一頁。
          </p>
          <p className="mt-6" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em', color: '#475569', margin: '24px 0 0' }}>
            <span style={{ color: '#a78bfa' }}>2026.07.09</span><span style={{ color: '#334155' }}>·</span>
            <span>台北</span><span style={{ color: '#334155' }}>·</span>
            <span><span style={{ color: '#c4b5fd' }}>{sessions.length}</span> 場筆記</span><span style={{ color: '#334155' }}>·</span>
            <span>22 張現場紀錄</span>
          </p>
        </header>

        {/* 總綱 */}
        <section className="mb-10 sm:mb-14 rounded-2xl p-5 sm:p-7" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
          <p className="m-0 mb-3 font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, fontSize: '0.72rem', color: '#a78bfa' }}>心得筆記</p>
          <p className="m-0 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">
            聽了好多 Google 跟企業合作夥伴的演講，感覺旗下的 ADK 跟 BigQuery 產品讓 Agent 的開發平台有一個很美好的基底，有機會大家可以去試試看。以下分享一些專題講座，也許我們可以給 Gemini 多一點信心 🤣
          </p>
        </section>

        {/* 場次卡片目錄 */}
        <nav aria-label="場次目錄" className="mb-14 sm:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <a
                key={s.slug}
                href={`#${anchorId(s.order)}`}
                className="group flex flex-col gap-3 rounded-2xl p-5 transition-colors duration-200 border border-white/[0.08] hover:border-violet-400/40"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span style={{ fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.06em', color: '#7c5cff' }}>{String(s.order).padStart(2, '0')}</span>
                  <StatusTag>{s.track}</StatusTag>
                </div>
                <h3 className="m-0 text-base sm:text-[1.0625rem] font-semibold leading-snug text-slate-100 group-hover:text-white transition-colors">{s.title}</h3>
                <p className="m-0 text-sm leading-[1.75] text-slate-400 line-clamp-3">{s.summary}</p>
                <p className="m-0 mt-auto flex items-center justify-between gap-3 text-[0.78rem]">
                  <span className="truncate text-slate-500">{s.speakers.map((sp) => sp.name).join('、')}</span>
                  <span className="shrink-0 inline-flex items-center gap-1" style={{ color: '#93c5fd' }}>
                    看這場筆記
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </span>
                </p>
              </a>
            ))}
          </div>
        </nav>

        {/* 八場筆記 */}
        {sessions.map((s, i) => (
          <section key={s.slug} id={anchorId(s.order)} className="scroll-mt-24">
            {i > 0 && <hr className="border-0 h-px my-12 sm:my-16" style={{ background: 'linear-gradient(90deg, rgba(124,92,255,0.35), rgba(255,255,255,0.06))' }} />}
            <header className="mb-7">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span style={{ fontFamily: MONO, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#7c5cff' }}>
                  {String(s.order).padStart(2, '0')} / {String(sessions.length).padStart(2, '0')}
                </span>
                <StatusTag>{s.track}</StatusTag>
              </div>
              <h2 className="text-xl sm:text-3xl font-semibold text-white tracking-[-0.015em] leading-snug m-0 mb-4">{s.title}</h2>
              <p className="m-0 mb-4 pl-4 sm:pl-5 text-[0.95rem] sm:text-base leading-[1.85] text-slate-400" style={{ borderLeft: '2px solid rgba(139,92,246,0.6)' }}>
                {s.summary}
              </p>
              <ul className="m-0 p-0 list-none flex flex-wrap gap-x-6 gap-y-1.5">
                {s.speakers.map((sp) => (
                  <li key={sp.name} className="text-sm leading-relaxed">
                    <span className="font-medium text-slate-200">{sp.name}</span>
                    <span className="text-slate-500">・{sp.title}</span>
                  </li>
                ))}
              </ul>
            </header>
            <div className="prose max-w-none">
              <MDXRemote
                source={s.body}
                components={mdxComponents}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </div>
          </section>
        ))}

        {/* 結尾 CTA */}
        <div className="mt-16 sm:mt-24 rounded-2xl p-6 sm:p-8 text-center" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
          <p className="m-0 mb-5 text-slate-300 leading-relaxed text-[0.95rem] sm:text-base">
            這類 AI Agent、資料治理與自動化的第一手觀察，我會持續整理在活動分享與部落格。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Link href="/activities" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
              回活動分享
            </Link>
            <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              逛 AI × n8n 知識庫
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
