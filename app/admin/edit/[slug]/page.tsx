import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPostBySlug } from '@/lib/mdx'
import PostEditor from '@/app/admin/PostEditor'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export default async function AdminEditPostPage({ params }: Props) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session || session !== process.env.PASSWORD) redirect('/admin/login')

  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <PostEditor post={post} />
    </main>
  )
}
