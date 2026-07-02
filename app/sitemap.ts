import { MetadataRoute } from 'next'
import { getAllPosts, getAllServices } from '@/lib/mdx'

const baseUrl = 'https://aiqkangber.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([
    getAllPosts(),
    getAllServices(),
  ])

  // Sheet 端偶爾出現未來日期；lastmod 不可信會讓 Google 忽略整份 sitemap，故封頂到現在
  const now = new Date()
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const d = new Date(post.date)
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: d > now ? now : d,
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  })

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  // 電子報期數頁已設 noindex（新聞摘要彙整、無搜尋價值），不進 sitemap；/newsletter 主頁保留
  return [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${baseUrl}/services`, priority: 0.95, changeFrequency: 'weekly' },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about`, priority: 0.75, changeFrequency: 'monthly' },
    { url: `${baseUrl}/portfolio`, priority: 0.75, changeFrequency: 'monthly' },
    { url: `${baseUrl}/faq`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/tools`, priority: 0.65, changeFrequency: 'monthly' },
    { url: `${baseUrl}/tools/pet-talk`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/newsletter`, priority: 0.6, changeFrequency: 'weekly' },
    { url: `${baseUrl}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: 'yearly' },
    ...serviceEntries,
    ...postEntries,
  ]
}
