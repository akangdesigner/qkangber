'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 14px rgba(34,197,94,0.20)',
      }}
    >
      <Image
        src="/logo.png"
        alt="q kangber"
        width={size}
        height={size}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

const links = [
  { href: '/services', label: '服務' },
  { href: '/blog', label: '文章' },
  { href: '/tools', label: '工具站' },
  { href: '/newsletter/archive', label: '歷期電子報' },
  { href: '/newsletter', label: '開始訂閱', exact: true },
  { href: '/about', label: '關於我' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#05060a]/80 border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <LogoMark size={26} />
          <span className="font-semibold text-white text-[1.02rem] tracking-[-0.01em]">
            q kangber
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, exact }) => {
            const isActive = exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'))
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/[0.06]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute inset-x-4 -bottom-px h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)' }}
                  />
                )}
              </Link>
            )
          })}
          <div className="ml-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-100"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
                boxShadow: '0 0 24px rgba(99,102,241,0.35)',
              }}
            >
              回首頁
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
