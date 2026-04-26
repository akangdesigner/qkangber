import Hero from '@/components/home/Hero'
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
      <FeaturedPosts posts={latestPosts} />
      <NewsletterBanner />
    </>
  )
}
