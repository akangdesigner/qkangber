'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/blog', label: '文章' },
  { href: '/courses', label: '課程' },
  { href: '/newsletter', label: '訂閱' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf9]/95 backdrop-blur-sm border-b border-[#e7e5e4]">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-12">
        <Link
          href="/"
          className="font-serif text-[1.05rem] font-semibold text-[#1c1917] tracking-tight select-none"
        >
          你的名字
        </Link>

        <nav className="flex items-center gap-7">
          {links.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="relative text-sm group py-3"
              >
                <span
                  className={`transition-colors duration-150 ${
                    isActive
                      ? 'text-[#ea580c]'
                      : 'text-[#78716c] group-hover:text-[#1c1917]'
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#ea580c] transition-all duration-300 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
