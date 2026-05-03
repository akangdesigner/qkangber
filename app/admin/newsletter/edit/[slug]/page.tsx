import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getMdxNewsletterIssue } from '@/lib/newsletter'
import NewsletterEditor from '@/app/admin/NewsletterEditor'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export default async function EditNewsletterPage({ params }: Props) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session || session !== process.env.PASSWORD) redirect('/admin/login')

  const { slug } = await params
  const issue = getMdxNewsletterIssue(slug)
  if (!issue) notFound()

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <NewsletterEditor issue={issue} />
    </main>
  )
}
