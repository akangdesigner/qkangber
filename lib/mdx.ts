import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import { readingTime } from './reading-time'
import type { Post, PostWithContent, Course } from '@/types/content'

const contentDir = path.join(process.cwd(), 'content')

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

  const posts = slugs.map((slug) => {
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
      featured: data.featured ?? false,
      readingTime: readingTime(content),
    } satisfies Post
  })

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
})

export const getPostBySlug = cache(async (slug: string): Promise<PostWithContent | null> => {
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
    featured: data.featured ?? false,
    readingTime: readingTime(content),
    content,
  }
})

export const getAllCourses = cache(async (): Promise<Course[]> => {
  const dir = path.join(contentDir, 'courses')
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
        platform: data.platform ?? '',
        link: data.link ?? '#',
        price: data.price ?? '免費',
        coverImage: data.coverImage,
        published: data.published ?? true,
      } satisfies Course
    })
    .filter((c) => c.published)
})
