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

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: 'Q kangber' }],
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      authors: ['Q kangber'],
      images: post.coverImage ? [{ url: post.coverImage }] : [{ url: '/og-default.png' }],
    },
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

  const popularPosts = allPosts.filter((p) => p.featured).slice(0, 3)
  const latestPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 1)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
      sameAs: [
        'https://www.threads.com/@cutekangber',
        'https://www.instagram.com/cutekangber',
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
            { label: '部落格', href: '/blog' },
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
