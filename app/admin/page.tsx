import { getAllPosts } from '@/lib/mdx'
import PostList from './PostList'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const posts = await getAllPosts()
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <PostList posts={posts} />
    </main>
  )
}
