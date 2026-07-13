import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import StatusTag from '@/components/activities/StatusTag'
import { getActivitySession, getActivitySessions } from '@/lib/activities-content'
import { buildMetadata } from '@/lib/metadata'
import { jsonLdScript } from '@/lib/jsonld'

const EVENT = 'cloud-day-2026'
const BASE_PATH = '/activities/google-cloud-day-2026'
const MONO = 'var(--font-jetbrains), ui-monospace, monospace'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getActivitySessions(EVENT).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const session = getActivitySession(EVENT, slug)
  if (!session) return {}
  return buildMetadata({
    title: `${session.title} — Google Cloud Day 2026 筆記`,
    description: session.summary,
    path: `${BASE_PATH}/${slug}`,
    type: 'article',
    publishedTime: '2026-07-09',
    authors: ['Q kangber'],
  })
}

export default async function CloudDaySessionPage({ params }: Props) {
  const { slug } = await params
  const session = getActivitySession(EVENT, slug)
  if (!session) notFound()

  const sessions = getActivitySessions(EVENT)
  const idx = sessions.findIndex((s) => s.slug === slug)
  const prev = idx > 0 ? sessions[idx - 1] : null
  const next = idx < sessions.length - 1 ? sessions[idx + 1] : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${session.title} — Google Cloud Day 2026 筆記`,
    description: session.summary,
    url: `https://aiqkangber.com${BASE_PATH}/${slug}`,
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

      <div className="max-w-[860px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
        <Breadcrumbs crumbs={[
          { label: '首頁', href: '/' },
          { label: '活動分享', href: '/activities' },
          { label: 'Google Cloud Day 2026', href: BASE_PATH },
          { label: session.title },
        ]} />

        {/* header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span style={{ fontFamily: MONO, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#7c5cff' }}>
              {String(session.order).padStart(2, '0')} / {String(sessions.length).padStart(2, '0')}
            </span>
            <StatusTag>{session.track}</StatusTag>
            <StatusTag tone="muted">2026.07.09</StatusTag>
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-[-0.02em] leading-[1.2] mb-5">{session.title}</h1>
          <p className="m-0 mb-5 pl-4 sm:pl-5 text-[0.95rem] sm:text-base leading-[1.85] text-slate-400" style={{ borderLeft: '2px solid rgba(139,92,246,0.6)' }}>
            {session.summary}
          </p>
          <ul className="m-0 p-0 list-none flex flex-wrap gap-x-6 gap-y-1.5">
            {session.speakers.map((sp) => (
              <li key={sp.name} className="text-sm leading-relaxed">
                <span className="font-medium text-slate-200">{sp.name}</span>
                <span className="text-slate-500">・{sp.title}</span>
              </li>
            ))}
          </ul>
        </header>

        <div className="prose max-w-none">
          <MDXRemote
            source={session.body}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        {/* 場次間導覽 */}
        <nav aria-label="場次導覽" className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev ? (
            <Link href={`${BASE_PATH}/${prev.slug}`} className="group rounded-2xl p-5 border border-white/[0.08] hover:border-violet-400/40 transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="m-0 mb-1.5 text-[0.72rem] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: '#64748b' }}>← 上一場</p>
              <p className="m-0 text-sm font-medium leading-snug text-slate-200 group-hover:text-white transition-colors">{prev.title}</p>
            </Link>
          ) : <span className="hidden sm:block" />}
          {next && (
            <Link href={`${BASE_PATH}/${next.slug}`} className="group rounded-2xl p-5 sm:text-right border border-white/[0.08] hover:border-violet-400/40 transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="m-0 mb-1.5 text-[0.72rem] tracking-[0.14em] uppercase" style={{ fontFamily: MONO, color: '#64748b' }}>下一場 →</p>
              <p className="m-0 text-sm font-medium leading-snug text-slate-200 group-hover:text-white transition-colors">{next.title}</p>
            </Link>
          )}
        </nav>

        <div className="mt-8 text-center">
          <Link href={BASE_PATH} className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            回 Google Cloud Day 2026 全部場次
          </Link>
        </div>
      </div>
    </main>
  )
}
