import { MetadataRoute } from 'next'
import { getAllPosts, getAllServices } from '@/lib/mdx'
import { getAllNewsletterIssues } from '@/lib/newsletter'

const baseUrl = 'https://aiqkangber.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services, newsletterIssues] = await Promise.all([
    getAllPosts(),
    getAllServices(),
    getAllNewsletterIssues(),
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

  const newsletterEntries: MetadataRoute.Sitemap = newsletterIssues.map((issue) => ({
    url: `${baseUrl}/newsletter/${issue.slug}`,
    lastModified: new Date(issue.date),
    changeFrequency: 'never',
    priority: 0.5,
  }))

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
    ...newsletterEntries,
  ]
}
