import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '關於 q康寶 — n8n 自動化工程師',
  description: '我是 q康寶，專注電商與行銷流程自動化。用 n8n 幫客戶解決訂單、行銷漏斗、社群管理等重複性工作。不賣課程，直接幫你做好。',
}

const socialLinks = [
  { href: 'https://www.threads.com/@cutekangber', label: 'Threads' },
  { href: 'https://www.instagram.com/cutekangber', label: 'Instagram' },
]

const siteLinks = [
  { href: '/services', label: '服務項目', desc: '電商與行銷自動化，每個服務獨立頁面說明' },
  { href: '/portfolio', label: '作品集', desc: '實際交付的 n8n 工作流案例與成效' },
  { href: '/blog', label: '文章', desc: '自動化實戰心得與踩坑記錄' },
]

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
      <span
        className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
        style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {children}
      </span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <main className="relative max-w-2xl mx-auto px-6 py-20">
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(124,92,255,0.12), transparent 60%)' }}
      />

      <div className="mb-6">
        <EyebrowLabel>About</EyebrowLabel>
      </div>

      <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight mb-8 tracking-[-0.02em]">
        你好，我是<br />
        <span style={{ background: 'linear-gradient(90deg, #c4b5fd, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          q康寶
        </span>
      </h1>

      <div className="space-y-5 text-[1.05rem] text-slate-300 leading-[1.85] mb-14">
        <p>
          專注電商與行銷流程自動化幾年了。用 n8n 幫客戶解決的問題，從訂單處理到行銷漏斗都有。
        </p>
        <p>
          我不賣課程，也不寫教科書。我的工作是直接幫你把重複性流程自動化——你告訴我你每天在重複做什麼，我告訴你哪些可以讓 n8n 代勞。
        </p>
        <p>
          踩過很多坑，所以知道哪些方案真的能用、哪些只是理論上漂亮。
        </p>
      </div>

      <div className="border-t border-white/[0.06] pt-10 mb-10">
        <h2 className="text-lg font-semibold text-white mb-5 tracking-[-0.01em]">這裡有什麼</h2>
        <ul className="space-y-3">
          {siteLinks.map(({ href, label, desc }) => (
            <li key={href} className="flex items-start gap-3 text-slate-400">
              <span className="mt-1 flex-shrink-0" style={{ color: '#a78bfa' }}>→</span>
              <span>
                <Link href={href} className="font-medium text-white hover:text-violet-300 transition-colors duration-150">
                  {label}
                </Link>
                {' '}— {desc}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/[0.06] pt-10">
        <h2 className="text-lg font-semibold text-white mb-5 tracking-[-0.01em]">聯絡我</h2>
        <ul className="flex flex-wrap gap-3">
          {socialLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-300 hover:text-white transition-colors duration-150 rounded-full px-4 py-1.5"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
