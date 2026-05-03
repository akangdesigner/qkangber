import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import { getNewsletterIssues as getSheetsIssues } from './sheets'

export type NewsletterIssue = {
  slug: string
  date: string
  subject: string
  summary: string
  htmlBody: string
  published: boolean
}

const newsletterDir = path.join(process.cwd(), 'content', 'newsletter')

function readMdxIssues(): NewsletterIssue[] {
  if (!fs.existsSync(newsletterDir)) return []
  return fs
    .readdirSync(newsletterDir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '')
      const raw = fs.readFileSync(path.join(newsletterDir, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug,
        date: data.date ?? '',
        subject: data.subject ?? '',
        summary: data.summary ?? '',
        htmlBody: content,
        published: data.published !== false,
      }
    })
    .filter((i) => i.slug)
}

// Public: MDX + Sheets merged (MDX takes priority for same slug)
export const getAllNewsletterIssues = cache(async (): Promise<NewsletterIssue[]> => {
  const [mdx, sheets] = await Promise.all([
    Promise.resolve(readMdxIssues()),
    getSheetsIssues(),
  ])
  const bySlug = new Map<string, NewsletterIssue>()
  for (const i of sheets) bySlug.set(i.slug, i)
  for (const i of mdx) bySlug.set(i.slug, i)
  return Array.from(bySlug.values())
    .filter((i) => i.published && i.slug)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
})

export const getNewsletterIssue = cache(async (slug: string): Promise<NewsletterIssue | null> => {
  const all = await getAllNewsletterIssues()
  return all.find((i) => i.slug === slug) ?? null
})

// Admin: MDX-only (no cache, force-dynamic pages)
export function getMdxNewsletterIssues(): NewsletterIssue[] {
  return readMdxIssues()
    .filter((i) => i.slug)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getMdxNewsletterIssue(slug: string): NewsletterIssue | null {
  return readMdxIssues().find((i) => i.slug === slug) ?? null
}
