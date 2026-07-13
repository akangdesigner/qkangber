import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'

export type ActivitySpeaker = { name: string; title: string }
export type ActivitySession = {
  /** 檔名去掉副檔名，如 '01-ai-taiwan-keynote'；錨點用 order 組 sNN */
  slug: string
  order: number
  title: string
  track: string
  speakers: ActivitySpeaker[]
  summary: string
  /** 已做 MDX 跳脫的正文（不含 frontmatter/標題/講者，由頁面結構化渲染） */
  body: string
}

// 與 lib/mdx.ts 的 sanitizeForMdx 同款：跳脫花括號、修自閉合標籤，避免筆記內容炸 MDX 編譯
function sanitizeForMdx(content: string): string {
  return content
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')
    .replace(/<br\s*\/?>/gi, '<br />')
    .replace(/<hr\s*\/?>/gi, '<hr />')
    .replace(/<img([^>]*)(?<!\/)>/gi, '<img$1 />')
}

/** 讀取一場活動的所有場次筆記（content/activities/<eventSlug>/*.md），依 order 排序 */
export const getActivitySessions = cache((eventSlug: string): ActivitySession[] => {
  const dir = path.join(process.cwd(), 'content', 'activities', eventSlug)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug: f.replace(/\.md$/, ''),
        order: data.order ?? 0,
        title: data.title ?? '',
        track: data.track ?? '',
        speakers: (data.speakers ?? []) as ActivitySpeaker[],
        summary: data.summary ?? '',
        body: sanitizeForMdx(content.trim()),
      }
    })
    .sort((a, b) => a.order - b.order)
})
