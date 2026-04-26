import Link from 'next/link'
import SubscribeForm from '@/components/shared/SubscribeForm'

const navLinks = [
  { href: '/blog', label: '文章' },
  { href: '/courses', label: '課程' },
  { href: '/newsletter', label: '電子報' },
]

const socialLinks = [
  { href: 'https://twitter.com/yourhandle', label: 'Twitter / X' },
  { href: 'https://youtube.com/@yourhandle', label: 'YouTube' },
  { href: 'https://linkedin.com/in/yourhandle', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1">
          <p className="font-serif text-lg font-semibold text-[var(--color-text-primary)] mb-2">你的名字</p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            在人與 AI 之間找到平衡。不讓科技取代思考，而是讓思考更有力量。
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">頁面</p>
          <ul className="space-y-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-[var(--color-text-body)] hover:text-[var(--color-accent)] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">追蹤我</p>
          <ul className="space-y-2 mb-6">
            {socialLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-text-body)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <SubscribeForm />
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] py-4">
        <p className="text-center text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} 你的名字. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
