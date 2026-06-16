import { getAllPosts } from '@/lib/mdx'
import BlogFilter from '@/components/blog/BlogFilter'
import { BlogHero } from '@/components/page-hero/PageHero'
import { buildMetadata } from '@/lib/metadata'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'AI × n8n 知識庫 — n8n 自動化與 AI 開發實戰文章',
  description: '依主題集群整理的實戰文章庫：n8n 自動化（行銷／社群數據／AI 客服）與 AI 開發、Vibe Coding——每篇都真實踩過才寫。',
  keywords: ['n8n 自動化', '行銷自動化', 'AI 客服', 'Vibe Coding'],
  path: '/blog',
})

const PREFERRED_CATEGORY_ORDER = ['n8n 自動化', 'AI 開發與 Vibe Coding']

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI × n8n 知識庫',
    description: 'AI 與 n8n 自動化實戰知識庫。工作流架構、AI Agent 開發、電商行銷自動化——全都真實踩過才寫出來。',
    url: 'https://aiqkangber.com/blog',
    publisher: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
    },
    mainEntity: {
      '@type': 'Blog',
      name: 'Q kangber 知識庫',
      url: 'https://aiqkangber.com/blog',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://aiqkangber.com' },
      { '@type': 'ListItem', position: 2, name: 'AI × n8n 知識庫', item: 'https://aiqkangber.com/blog' },
    ],
  },
]

export default async function BlogPage() {
  const posts = await getAllPosts()

  const allCategories = posts.map((p) => p.category).filter((c): c is string => Boolean(c))
  const unique = [...new Set(allCategories)]
  const sortedCategories = [
    ...PREFERRED_CATEGORY_ORDER.filter((c) => unique.includes(c)),
    ...unique.filter((c) => !PREFERRED_CATEGORY_ORDER.includes(c)).sort(),
  ]

  // Category rail for the hero: 全部 + top categories with real counts
  const heroCategories = [
    { name: '全部', count: posts.length },
    ...sortedCategories.map((c) => ({ name: c, count: posts.filter((p) => p.category === c).length })),
  ].slice(0, 5)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHero categories={heroCategories} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-20">
        {posts.length === 0 ? (
          <p className="text-slate-500">還沒有文章，敬請期待。</p>
        ) : (
          <BlogFilter posts={posts} categories={sortedCategories} />
        )}
      </div>
    </>
  )
}
