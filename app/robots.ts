import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // /api/og must stay crawlable — it renders every page's og:image.
        allow: ['/', '/api/og'],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://aiqkangber.com/sitemap.xml',
  }
}
