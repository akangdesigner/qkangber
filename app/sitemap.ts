import { MetadataRoute } from 'next'
import { getAllPosts, getAllServices } from '@/lib/mdx'

const baseUrl = 'https://aiqkangber.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([
    getAllPosts(),
    getAllServices(),
  ])

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

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
    ...serviceEntries,
    ...postEntries,
  ]
}
