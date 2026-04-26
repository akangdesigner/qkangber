import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

const baseUrl = 'https://yourdomain.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${baseUrl}/blog`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/courses`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/newsletter`, priority: 0.6, changeFrequency: 'monthly' },
    ...postEntries,
  ]
}
