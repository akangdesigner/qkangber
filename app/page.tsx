import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import HomeCarousel from '@/components/home/HomeCarousel'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import HomeNewsletter from '@/components/home/HomeNewsletter'
import { getAllPosts } from '@/lib/mdx'
import { getAllNewsletterIssues } from '@/lib/newsletter'

export const metadata: Metadata = {
  title: 'Q kangber — 專注於 n8n 與 AI 深度整合的流程架構師',
  description: '秉持「AI 不為取代判斷，而是精準表達想法」的核心理念，致力於設計從資料流到系統串接皆極致高效的自動化產出體系；作為 Vibe Coding 的實踐者，我熱衷於實作前沿工具如 Claude Code 與 Claude Design，在人機協作的黃金分工點上，將複雜想法轉化為精確的系統邏輯。',
  keywords: ['N8N 自動化', '提示詞架構', 'AI Agent', 'RAG 資料庫'],
  alternates: { canonical: 'https://aiqkangber.com' },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Q kangber',
    url: 'https://aiqkangber.com',
    logo: 'https://aiqkangber.com/logo.png',
    description: 'Claude 系列、n8n、RAG、提示詞工程——找到 AI 與人類的完美協作點，設計從資料進到結果出的完整自動化體系。',
    email: 'asdtodd42@gmail.com',
    sameAs: [
      'https://www.threads.net/@cutekangber',
      'https://www.instagram.com/cutekangber',
    ],
    founder: {
      '@type': 'Person',
      name: 'Q kangber',
      jobTitle: 'n8n 自動化流程架構師',
      url: 'https://aiqkangber.com/about',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Q kangber',
    url: 'https://aiqkangber.com',
    description: 'n8n 自動化 · AI Agent · 電商流程工程',
  },
]

export default async function HomePage() {
  const allPosts = await getAllPosts()
  const featured = allPosts.filter((p) => p.featured).slice(0, 3)
  const latestPosts = featured.length >= 3 ? featured : allPosts.slice(0, 3)

  const issues = await getAllNewsletterIssues()
  const recentIssues = issues.filter(i => i.published).slice(0, 3)

  const latestPost = allPosts[0] ? { title: allPosts[0].title, slug: allPosts[0].slug } : undefined

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero latestPost={latestPost} />
      <HomeCarousel />
      <FeaturedPosts posts={latestPosts} />
      <HomeNewsletter issues={recentIssues} />
    </>
  )
}
