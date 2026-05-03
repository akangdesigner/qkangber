import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import Tag from '@/components/shared/Tag'
import type { Metadata } from 'next'
import rehypePrettyCode from 'rehype-pretty-code'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Q kangber' },
    ...(post.coverImage && { image: post.coverImage }),
  }

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      </div>
    </article>
  )
}
