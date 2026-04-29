import Link from 'next/link'
import { getNewsletterIssues } from '@/lib/sheets'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '歷期 AI 自動化週報 — q康寶',
  description: '歷期 q康寶 AI 與 n8n 自動化週報——每週精選業界動態，全部公開閱讀，免費無需訂閱。',
}

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
      <span
        className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
        style={{
          background: 'linear-gradient(90deg,#a78bfa,#60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>
    </div>
  )
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default async function ArchivePage() {
  const issues = await getNewsletterIssues()

  return (
    <div className="relative max-w-4xl mx-auto px-6 py-16">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,92,255,0.12), transparent 70%)' }}
      />

      <div className="mb-12">
        <div className="mb-5">
          <EyebrowLabel>Newsletter Archive</EyebrowLabel>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4 tracking-[-0.02em]">
          歷期電子報
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-lg">
          每週精選 AI 業界動態，全部公開閱讀。想直接收到信箱？
          <Link href="/newsletter" className="text-violet-400 hover:text-violet-300 ml-1 transition-colors">
            免費訂閱 →
          </Link>
        </p>
      </div>

      {issues.length === 0 ? (
        <div
          className="rounded-2xl border border-white/[0.06] p-12 text-center"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-slate-500">電子報封存即將上線，敬請期待。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue, idx) => (
            <Link
              key={issue.slug}
              href={`/newsletter/archive/${issue.slug}`}
              className="group relative flex gap-6 rounded-2xl border border-white/[0.06] p-6 transition-all duration-200 hover:border-white/[0.12]"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15), transparent 60%)' }}
              />

              <div className="relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-mono text-xs font-semibold text-slate-500 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                #{String(issues.length - idx).padStart(3, '0')}
              </div>

              <div className="relative flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[0.65rem] tracking-[0.15em] uppercase text-slate-500">
                    {formatDate(issue.date)}
                  </span>
                </div>
                <h2 className="text-white font-semibold leading-snug mb-2 group-hover:text-violet-200 transition-colors duration-150 tracking-[-0.01em]">
                  {issue.subject}
                </h2>
                {issue.summary && (
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {issue.summary}
                  </p>
                )}
              </div>

              <div className="relative flex-shrink-0 flex items-center">
                <span className="text-slate-600 group-hover:text-violet-400 transition-colors duration-150 text-lg">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
