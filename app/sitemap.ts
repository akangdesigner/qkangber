import { MetadataRoute } from 'next'
import { getAllPosts, getAllServices } from '@/lib/mdx'

const baseUrl = 'https://yourdomain.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([getAllPosts(), getAllServices()])

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

  return [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${baseUrl}/services`, priority: 0.95, changeFrequency: 'weekly' },
    { url: `${baseUrl}/portfolio`, priority: 0.85, changeFrequency: 'monthly' },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' },
    ...serviceEntries,
    ...postEntries,
  ]
}
