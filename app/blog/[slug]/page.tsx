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
    openGraph: {
      type: 'article',
      publishedTime: post.date,
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

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <header className="mb-10">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--color-text-primary)] leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <div className="prose prose-stone max-w-none prose-headings:font-serif prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-[var(--color-accent)]">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode, { theme: 'github-light' }],
              ],
            },
          }}
        />
      </div>
    </article>
  )
}
