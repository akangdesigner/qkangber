import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'

export const metadata: Metadata = {
  title: 'q康寶 — n8n 自動化 · AI Agent · 電商流程工程',
  description: '專注 n8n 工作流、AI Agent 架構、電商與行銷流程自動化。把重複性工作交給 n8n，你只管長遠的事。',
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
