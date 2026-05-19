import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import { readingTime } from './reading-time'
import { getBlogPostsFromSheets } from './sheets'
import type { Post, PostWithContent, Service, ServiceWithContent } from '@/types/content'

const contentDir = path.join(process.cwd(), 'content')

function sanitizeForMdx(content: string): string {
  return content
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')
    .replace(/<br\s*\/?>/gi, '<br />')
    .replace(/<hr\s*\/?>/gi, '<hr />')
    .replace(/<img([^>]*)(?<!\/)>/gi, '<img$1 />')
}

function getFileSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.(mdx|md)$/, ''))
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const dir = path.join(contentDir, 'blog')
  const slugs = getFileSlugs(dir)

  const mdxPosts: Post[] = slugs.map((slug) => {
    const ext = fs.existsSync(path.join(dir, `${slug}.mdx`)) ? 'mdx' : 'md'
    const raw = fs.readFileSync(path.join(dir, `${slug}.${ext}`), 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug,
      title: data.title ?? '',
      date: data.date ?? '',
      tags: data.tags ?? [],
      excerpt: data.excerpt ?? '',
      coverImage: data.coverImage,
      category: data.category,
      featured: data.featured ?? false,
      readingTime: readingTime(content),
    } satisfies Post
  })

  const sheetPosts = await getBlogPostsFromSheets()
  const sheetPostsMapped: Post[] = sheetPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
    excerpt: p.excerpt,
    featured: p.featured,
    readingTime: readingTime(p.content),
    coverImage: p.coverImage || undefined,
    category: p.category || undefined,
  }))

  // Sheets takes priority over MDX for same slug
  const bySlug = new Map<string, Post>()
  for (const p of mdxPosts) bySlug.set(p.slug, p)
  for (const p of sheetPostsMapped) bySlug.set(p.slug, p)

  return Array.from(bySlug.values()).sort((a, b) => (a.date > b.date ? -1 : 1))
})

export const getPostBySlug = cache(async (slug: string): Promise<PostWithContent | null> => {
  // Sheets takes priority
  const sheetPosts = await getBlogPostsFromSheets()
  const sheetPost = sheetPosts.find((p) => p.slug === slug)
  if (sheetPost) {
    return {
      slug: sheetPost.slug,
      title: sheetPost.title,
      date: sheetPost.date,
      tags: sheetPost.tags,
      excerpt: sheetPost.excerpt,
      featured: sheetPost.featured,
      readingTime: readingTime(sheetPost.content),
      content: sheetPost.content,
      coverImage: sheetPost.coverImage || undefined,
      category: sheetPost.category || undefined,
    }
  }

  // Fallback to MDX filesystem
  const dir = path.join(contentDir, 'blog')
  const ext = fs.existsSync(path.join(dir, `${slug}.mdx`)) ? 'mdx' : 'md'
  const filePath = path.join(dir, `${slug}.${ext}`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? '',
    coverImage: data.coverImage,
    category: data.category,
    featured: data.featured ?? false,
    readingTime: readingTime(content),
    content: sanitizeForMdx(content),
  }
})


export const getAllServices = cache(async (): Promise<Service[]> => {
  const dir = path.join(contentDir, 'services')
  const slugs = getFileSlugs(dir)

  return slugs
    .map((slug) => {
      const ext = fs.existsSync(path.join(dir, `${slug}.mdx`)) ? 'mdx' : 'md'
      const raw = fs.readFileSync(path.join(dir, `${slug}.${ext}`), 'utf-8')
      const { data } = matter(raw)

      return {
        slug,
        title: data.title ?? '',
        description: data.description ?? '',
        price: data.price ?? 0,
        priceNote: data.priceNote,
        category: data.category ?? '',
        tags: data.tags ?? [],
        icon: data.icon ?? '⚙️',
        featured: data.featured ?? false,
        published: data.published ?? true,
        serviceType: data.serviceType,
      } satisfies Service
    })
    .filter((s) => s.published)
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
})

export const getServiceBySlug = cache(async (slug: string): Promise<ServiceWithContent | null> => {
  const dir = path.join(contentDir, 'services')
  const ext = fs.existsSync(path.join(dir, `${slug}.mdx`)) ? 'mdx' : 'md'
  const filePath = path.join(dir, `${slug}.${ext}`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    price: data.price ?? 0,
    priceNote: data.priceNote,
    category: data.category ?? '',
    tags: data.tags ?? [],
    icon: data.icon ?? '⚙️',
    featured: data.featured ?? false,
    published: data.published ?? true,
    serviceType: data.serviceType,
    faq: data.faq,
    content,
  }
})
