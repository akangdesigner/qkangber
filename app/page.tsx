import { buildMetadata } from '@/lib/metadata'
import Hero from '@/components/home/Hero'
import HomeCarousel from '@/components/home/HomeCarousel'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import HomeNewsletter from '@/components/home/HomeNewsletter'
import { getAllPosts } from '@/lib/mdx'
import { getAllNewsletterIssues } from '@/lib/newsletter'

export const metadata = buildMetadata({
  title: { absolute: 'Q kangber — AI 開發 × n8n 自動化 實作分享' },
  description: 'Q kangber 分享 n8n 自動化、AI 開發與 AI 行銷的實作經驗：開發各種 AI 工具、追蹤最新趨勢情報，用自動化減少繁瑣的人工流程，找到 AI 與人的協作平衡。需要把重複工作交給自動化，也可以直接找我。',
  keywords: ['n8n 自動化', 'AI 開發', 'AI 工具', 'AI 行銷', 'AI Agent'],
  path: '/',
})

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Q kangber',
    url: 'https://aiqkangber.com',
    logo: 'https://aiqkangber.com/logo.png',
    description: '分享 n8n 自動化、AI 開發與 AI 行銷的實作經驗，開發各種 AI 工具、追蹤最新趨勢情報，用自動化減少繁瑣的人工流程，找到 AI 與人的協作平衡。',
    email: 'asdtodd42@gmail.com',
    sameAs: [
      'https://www.threads.com/@q_kangber',
      'https://www.instagram.com/q_kangber',
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
    description: 'n8n 自動化 · AI 開發 · AI 行銷實作分享',
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
