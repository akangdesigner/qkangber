import Link from 'next/link'
import Image from 'next/image'
import SubscribeForm from '@/components/shared/SubscribeForm'

const navLinks = [
  { href: '/services', label: '服務項目' },
  { href: '/blog', label: '文章' },
  { href: '/newsletter', label: '電子報' },
]

const socialLinks = [
  { href: 'https://twitter.com/yourhandle', label: 'Twitter / X' },
  { href: 'https://youtube.com/@yourhandle', label: 'YouTube' },
  { href: 'https://linkedin.com/in/yourhandle', label: 'LinkedIn' },
]

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 14px rgba(34,197,94,0.20)',
      }}
    >
      <Image src="/logo.png" alt="q kangber" width={size} height={size} className="w-full h-full object-cover" />
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-[#0a0b14]">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,92,255,0.5), transparent)' }}
      />

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <LogoMark size={26} />
            <span className="font-semibold text-white text-[1.02rem] tracking-[-0.01em]">q kangber</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            N8N 自動化服務。幫你把重複的流程接起來——電商、行銷、報表，直接幫你建好，不賣課程。
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">頁面</p>
          <ul className="space-y-2.5">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-slate-300 hover:text-white transition-colors duration-150">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">追蹤我</p>
          <ul className="space-y-2.5 mb-6">
            {socialLinks.map(({ href, label }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-slate-300 hover:text-white transition-colors duration-150">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <SubscribeForm small />
        </div>
      </div>

      <div className="border-t border-white/[0.04] py-5">
        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} q康寶. Built with intent.
        </p>
      </div>
    </footer>
  )
}
