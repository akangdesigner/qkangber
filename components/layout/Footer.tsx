import Link from 'next/link'
import Image from 'next/image'
import SubscribeForm from '@/components/shared/SubscribeForm'

const mainLinks = [
  { href: '/services', label: '服務' },
  { href: '/portfolio', label: '作品集' },
  { href: '/blog', label: 'AI × n8n 知識庫' },
  { href: '/tools', label: '工具站' },
]

const moreLinks = [
  { href: '/contact', label: '聯絡我' },
  { href: '/newsletter', label: '訂閱電子報' },
  { href: '/about', label: '關於我' },
  { href: '/activities', label: '活動足跡' },
  { href: '/faq', label: 'AI × 自動化指南' },
]

const socialLinks = [
  { href: 'https://www.threads.com/@q_kangber', label: 'Threads' },
  { href: 'https://www.instagram.com/q_kangber', label: 'Instagram' },
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
      <Image src="/logo.png" alt="Q kangber" width={size} height={size} className="w-full h-full object-cover" />
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <LogoMark size={26} />
            <span className="font-semibold text-white text-[1.02rem] tracking-[-0.01em]">Q kangber</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            商業自動化碩士 · AI 流程開發工程師 · 職涯平台業師 · 企業 AI 轉型顧問。用 n8n 把重複的事自動化，讓真正重要的事留給你。
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">主要頁面</p>
          <ul className="space-y-2.5">
            {mainLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-slate-300 hover:text-white transition-colors duration-150">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">電子報 &amp; 關於</p>
          <ul className="space-y-2.5">
            {moreLinks.map(({ href, label }) => (
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
                  {label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href="mailto:asdtodd42@gmail.com"
                 className="text-sm text-slate-300 hover:text-white transition-colors duration-150">
                asdtodd42@gmail.com
              </a>
            </li>
          </ul>
          <SubscribeForm small stacked />
        </div>
      </div>

      <div className="border-t border-white/[0.04] py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 px-4 sm:px-6">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Q kangber. Built with intent.
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            隱私權政策
          </Link>
          <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            服務條款
          </Link>
        </div>
      </div>
    </footer>
  )
}
