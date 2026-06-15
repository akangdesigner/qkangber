import { buildMetadata } from '@/lib/metadata'
import Hero from '@/components/home/Hero'
import HomeCarousel from '@/components/home/HomeCarousel'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import HomeNewsletter from '@/components/home/HomeNewsletter'
import { getAllPosts } from '@/lib/mdx'
import { getAllNewsletterIssues } from '@/lib/newsletter'

export const metadata = buildMetadata({
  title: { absolute: 'Q kangber — 專注於 n8n 與 AI 深度整合的流程架構師' },
  description: '提供 n8n 工作流自動化、AI Agent 與電商／行銷流程整合的接案與顧問服務。實戰派 n8n 流程架構師操刀，把訂單、報表、客服等重複工作交給自動化，讓團隊專注在真正重要的事。',
  keywords: ['n8n 自動化', '流程自動化', 'AI Agent', '電商流程工程'],
  path: '/',
})

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
