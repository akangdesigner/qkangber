import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import HomeCarousel from '@/components/home/HomeCarousel'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import HomeNewsletter from '@/components/home/HomeNewsletter'
import { getAllPosts } from '@/lib/mdx'
import { getAllNewsletterIssues } from '@/lib/newsletter'

export const metadata: Metadata = {
  title: 'Q kangber — n8n 自動化 · AI Agent · 電商流程工程',
  description: 'Claude 系列、n8n、RAG、提示詞工程——找到 AI 與人類的完美協作點，設計從資料進到結果出的完整自動化體系。',
  alternates: { canonical: 'https://aiqkangber.com' },
}

export default async function HomePage() {
  const allPosts = await getAllPosts()
  const featured = allPosts.filter((p) => p.featured).slice(0, 3)
  const latestPosts = featured.length >= 3 ? featured : allPosts.slice(0, 3)

  const issues = await getAllNewsletterIssues()
  const recentIssues = issues.filter(i => i.published).slice(0, 3)

  const latestPost = allPosts[0] ? { title: allPosts[0].title, slug: allPosts[0].slug } : undefined

  return (
    <>
      <Hero latestPost={latestPost} />
      <HomeCarousel />
      <FeaturedPosts posts={latestPosts} />
      <HomeNewsletter issues={recentIssues} />
    </>
  )
}
