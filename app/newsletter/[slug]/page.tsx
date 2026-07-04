import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNewsletterIssue, getAllNewsletterIssues } from '@/lib/newsletter'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { lazifyContentImages } from '@/lib/html-images'
import { jsonLdScript } from '@/lib/jsonld'

export const dynamicParams = true

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const issues = await getAllNewsletterIssues()
  return issues.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const issue = await getNewsletterIssue(slug)
  if (!issue) return {}
  return {
    ...buildMetadata({
      title: issue.subject,
      description: issue.summary || issue.subject,
      path: `/newsletter/${slug}`,
      type: 'article',
      publishedTime: issue.date,
    }),
    // 期數頁是新聞摘要彙整，搜尋零價值（GSC 三個月 1 曝光 0 點擊）卻稀釋站級品質訊號；
    // noindex 不進索引、follow 讓站內連結權重照傳，訂閱者開連結不受影響
    robots: { index: false, follow: true },
  }
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

  // 信件內文本身帶一個 <h1>Q kangber 週報</h1>，會和頁面 <h1>{issue.subject}</h1> 重複（Multiple H1）。
  // 頁面 h1 較獨特且有意義，予以保留；把預覽內文裡的 h1 降為 h2——email 寄出的原檔不動，只在網頁渲染時轉換。
  const previewHtml = lazifyContentImages(issue.htmlBody.replace(/<(\/?)h1(\b[^>]*)>/gi, '<$1h2$2>'))

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: issue.subject,
      description: issue.summary || issue.subject,
      url: `https://aiqkangber.com/newsletter/${slug}`,
      datePublished: issue.date,
      dateModified: issue.date,
      author: {
        '@type': 'Person',
        name: 'Q kangber',
        url: 'https://aiqkangber.com/about',
      },
      publisher: {
        '@type': 'Person',
        name: 'Q kangber',
        url: 'https://aiqkangber.com/about',
      },
      isPartOf: {
        '@type': 'Periodical',
        name: 'Q kangber AI 自動化週報',
        url: 'https://aiqkangber.com/newsletter',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://aiqkangber.com' },
        { '@type': 'ListItem', position: 2, name: '電子報', item: 'https://aiqkangber.com/newsletter' },
        { '@type': 'ListItem', position: 3, name: issue.subject, item: `https://aiqkangber.com/newsletter/${slug}` },
      ],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <div className="mb-8">
        <Link
          href="/newsletter"
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
      <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1a1b26', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>
          <span className="text-[0.65rem] text-slate-500 tracking-wide ml-1">郵件預覽</span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: previewHtml }}
          className="newsletter-html-body"
          style={{ background: '#ffffff' }}
        />
      </div>

      <div className="mt-12 pt-8 border-t border-white/[0.06] flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-slate-500">
          喜歡這期內容？每週直送信箱，不漏看。
        </p>
        <Link href="/newsletter" className="btn btn--ink flex-shrink-0">
          <span className="btn__dot" />
          <span className="btn__label">免費訂閱</span>
          <span className="btn__arrow">→</span>
        </Link>
      </div>
    </div>
  )
}
