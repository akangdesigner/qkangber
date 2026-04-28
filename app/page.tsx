import Hero from '@/components/home/Hero'
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
