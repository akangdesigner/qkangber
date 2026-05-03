import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import NewsletterEditor from '@/app/admin/NewsletterEditor'

export const dynamic = 'force-dynamic'

export default async function NewNewsletterPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session || session !== process.env.PASSWORD) redirect('/admin/login')

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <NewsletterEditor />
    </main>
  )
}
