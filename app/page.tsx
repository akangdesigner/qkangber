import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'

export const metadata: Metadata = {
  title: 'Q kangber — n8n 自動化 · AI Agent · 電商流程工程',
  description: 'Claude 系列、n8n、RAG、提示詞工程——找到 AI 與人類的完美協作點，設計從資料進到結果出的完整自動化體系。',
  alternates: { canonical: 'https://aiqkangber.com' },
}
import CapabilityStrip from '@/components/home/CapabilityStrip'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import NewsletterBanner from '@/components/home/NewsletterBanner'
import { getAllPosts } from '@/lib/mdx'

export default async function HomePage() {
  const allPosts = await getAllPosts()
  const featured = allPosts.filter((p) => p.featured).slice(0, 3)
  const latestPosts = featured.length >= 3 ? featured : allPosts.slice(0, 3)

  return (
    <>
      <Hero />
      <CapabilityStrip />
      <FeaturedPosts posts={latestPosts} />
      <NewsletterBanner />
    </>
  )
}
