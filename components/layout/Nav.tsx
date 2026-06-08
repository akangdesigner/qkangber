'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

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
        alt="Q kangber"
        width={size}
        height={size}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

const links = [
  { href: '/services', label: '服務' },
  { href: '/portfolio', label: '作品集' },
  { href: '/blog', label: 'AI × N8N 知識庫' },
  { href: '/newsletter', label: '電子報' },
  { href: '/about', label: '關於我' },
  { href: '/contact', label: '聯絡我們' },
  { href: '/faq', label: 'AI X 自動化指南' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#05060a]/80 border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 select-none" onClick={() => setMobileOpen(false)}>
          <LogoMark size={26} />
          <span className="font-semibold text-white text-[1.02rem] tracking-[-0.01em]">
            Q kangber
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
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
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? '關閉選單' : '開啟選單'}
        >
          <span className={`block w-5 h-px bg-white transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-white/[0.06] bg-[#05060a]/95 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col">
            {links.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`relative text-sm px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}
