import { getAllPosts } from '@/lib/mdx'
import PostList from './PostList'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const posts = await getAllPosts()
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 mb-10">
        <span
          className="text-sm px-4 py-1.5 rounded-lg text-white"
          style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          文章
        </span>
        <a
          href="/admin/newsletter"
          className="text-sm px-4 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          電子報
        </a>
      </div>
      <PostList posts={posts} />
    </main>
  )
}
