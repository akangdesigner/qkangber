import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import AuthorCard from '@/components/shared/AuthorCard'
import PostNavigation from '@/components/blog/PostNavigation'
import BlogSidebar from '@/components/blog/BlogSidebar'
import Tag from '@/components/shared/Tag'
import type { Metadata } from 'next'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const ogImage = post.coverImage ? post.coverImage : '/opengraph-image'
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: 'Q kangber' }],
    alternates: { canonical: `https://aiqkangber.com/blog/${slug}` },
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      authors: ['Q kangber'],
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = await getAllPosts()
  const idx = allPosts.findIndex((p) => p.slug === slug)
  // allPosts is sorted newest-first, so idx+1 = older (上一篇), idx-1 = newer (下一篇)
  const prevPost = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const nextPost = idx > 0 ? allPosts[idx - 1] : null

  const latestPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 1)
  const latestSlug = latestPosts[0]?.slug
  // 熱門看 featured、最新看日期——兩者標準不同，需排除當前文章與「最新」那篇，避免同一篇重複出現
  const popularPosts = allPosts
    .filter((p) => p.featured && p.slug !== slug && p.slug !== latestSlug)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://aiqkangber.com/blog/${slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
      sameAs: [
        'https://www.threads.com/@q_kangber',
        'https://www.instagram.com/q_kangber',
      ],
    },
    publisher: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com',
    },
    ...(post.coverImage && { image: post.coverImage }),
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-16 items-start">
        <article>
          <Breadcrumbs crumbs={[
            { label: '首頁', href: '/' },
            { label: 'AI × N8N 知識庫', href: '/blog' },
            { label: post.title },
          ]} />
          <header className="mb-10">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>

            <h1 className="text-3xl sm:text-[2.5rem] font-semibold text-white leading-[1.15] mb-5 tracking-[-0.02em]">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
          </header>

          <div className="prose max-w-none">
            {post.content.trimStart().startsWith('<') ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      [rehypePrettyCode, { theme: 'github-dark' }],
                    ],
                  },
                }}
              />
            )}
          </div>

          <PostNavigation prev={prevPost} next={nextPost} />
          <AuthorCard />
        </article>

        <div className="hidden lg:block sticky top-24">
          <BlogSidebar latest={latestPosts} popular={popularPosts} />
        </div>
      </div>
    </div>
  )
}
