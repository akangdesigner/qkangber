import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNewsletterIssue, getNewsletterIssues } from '@/lib/sheets'
import type { Metadata } from 'next'

export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const issues = await getNewsletterIssues()
  return issues.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const issue = await getNewsletterIssue(slug)
  if (!issue) return {}
  return { title: issue.subject, description: issue.summary }
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

export default async function IssuePage({ params }: Props) {
  const { slug } = await params
  const issue = await getNewsletterIssue(slug)
  if (!issue) notFound()

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link
          href="/newsletter/archive"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors duration-150"
        >
          ← 所有期數
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-slate-500 mb-3">
          {formatDate(issue.date)}
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-[-0.015em]">
          {issue.subject}
        </h1>
      </div>

      {/* email preview container */}
      <div className="rounded-2xl overflow-hidden border border-white/[0.08]" style={{ background: '#0d0e1a' }}>
        <div
          dangerouslySetInnerHTML={{ __html: issue.htmlBody }}
          className="newsletter-html-body"
        />
      </div>

      <div className="mt-12 pt-8 border-t border-white/[0.06] flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-slate-500">
          喜歡這期內容？每週直送信箱，不漏看。
        </p>
        <Link
          href="/newsletter"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-100 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
            boxShadow: '0 0 20px rgba(99,102,241,0.3)',
          }}
        >
          免費訂閱 →
        </Link>
      </div>
    </div>
  )
}
