import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getMdxNewsletterIssues } from '@/lib/newsletter'
import NewsletterList from '@/app/admin/NewsletterList'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletterPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session || session !== process.env.PASSWORD) redirect('/admin/login')

  const issues = getMdxNewsletterIssues()

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 mb-10">
        <a
          href="/admin"
          className="text-sm px-4 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          文章
        </a>
        <span
          className="text-sm px-4 py-1.5 rounded-lg text-white"
          style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          電子報
        </span>
      </div>
      <NewsletterList issues={issues} />
    </main>
  )
}
