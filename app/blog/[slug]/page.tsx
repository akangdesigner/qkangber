import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import AuthorCard from '@/components/shared/AuthorCard'
import PostNavigation from '@/components/blog/PostNavigation'
import RelatedPosts from '@/components/blog/RelatedPosts'
import BlogSidebar from '@/components/blog/BlogSidebar'
import Tag from '@/components/shared/Tag'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { lazifyContentImages } from '@/lib/html-images'
import { extractToc } from '@/lib/html-toc'
import TableOfContents from '@/components/blog/TableOfContents'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { jsonLdScript } from '@/lib/jsonld'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.coverImage || undefined,
    type: 'article',
    publishedTime: post.date,
    authors: ['Q kangber'],
  })
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

  const isHtmlPost = post.content.trimStart().startsWith('<')
  const { html: contentHtml, toc } = isHtmlPost
    ? extractToc(lazifyContentImages(post.content))
    : { html: '', toc: [] }
  // QA 大補帖那種「每題 H3 都是獨立搜尋單位」的文章，目錄才展開到 H3。
  // 一般長文也常有 FAQ（幾個 QN H3）和論述小節，所以不能看比例（會被 FAQ 誤觸）——
  // 靠標題，或「QN 問句達 12 個以上」（QA 大補帖固定 20 題，FAQ 區只有 5~6 題不會到）判斷。
  const qNumbered = toc.filter((t) => t.level === 3 && /^Q\s*\d+/i.test(t.text)).length
  const tocShowSubitems = /QA|Q&A|大補帖/i.test(post.title) || qNumbered >= 12

  const allPosts = await getAllPosts()
  const idx = allPosts.findIndex((p) => p.slug === slug)
  // allPosts is sorted newest-first, so idx+1 = older (上一篇), idx-1 = newer (下一篇)
  const prevPost = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const nextPost = idx > 0 ? allPosts[idx - 1] : null

  // 同集群互鏈：先抓同副分類（最相關的 spoke），不足 3 篇再用同主分類補滿，排除自己
  const others = allPosts.filter((p) => p.slug !== slug)
  const sameSub = post.subCategory
    ? others.filter((p) => p.subCategory === post.subCategory)
    : []
  const sameMain = post.category
    ? others.filter((p) => p.category === post.category && !sameSub.includes(p))
    : []
  const relatedPosts = [...sameSub, ...sameMain].slice(0, 3)
  const relatedLabel = post.subCategory || post.category

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_272px] gap-16 items-start">
        <article className="min-w-0">
          <Breadcrumbs crumbs={[
            { label: '首頁', href: '/' },
            { label: 'AI × n8n 知識庫', href: '/blog' },
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

          {isHtmlPost && <TableOfContents toc={toc} showSubitems={tocShowSubitems} />}
          <div className="prose max-w-none">
            {isHtmlPost ? (
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
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

          <RelatedPosts posts={relatedPosts} category={relatedLabel} />
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
