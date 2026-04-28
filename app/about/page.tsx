import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '關於',
  description: '關於這個網站和創作者的介紹',
}

const socialLinks = [
  { href: 'https://twitter.com/yourhandle', label: 'Twitter / X' },
  { href: 'https://youtube.com/@yourhandle', label: 'YouTube' },
  { href: 'https://linkedin.com/in/yourhandle', label: 'LinkedIn' },
]

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20">

      <div className="flex items-center gap-3 mb-10">
        <div className="h-px w-8 bg-[#ea580c] flex-shrink-0" />
        <span className="text-[0.68rem] tracking-[0.22em] uppercase text-[#ea580c] font-semibold">
          關於
        </span>
      </div>

      <h1 className="font-serif text-4xl font-semibold text-[#1c1917] leading-tight mb-8">
        你好，我是<br />
        <em>q康寶</em>
      </h1>

      <div className="space-y-5 text-[1.05rem] text-[#44403c] leading-[1.85] mb-12">
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

      <div className="border-t border-[#e7e5e4] pt-10 mb-10">
        <h2 className="font-serif text-xl font-semibold text-[#1c1917] mb-4">這裡有什麼</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-[#44403c]">
            <span className="text-[#ea580c] mt-1 flex-shrink-0">→</span>
            <span><Link href="/services" className="font-medium text-[#1c1917] hover:text-[#ea580c] transition-colors">服務項目</Link> — 電商與行銷自動化，每個服務獨立頁面說明</span>
          </li>
          <li className="flex items-start gap-3 text-[#44403c]">
            <span className="text-[#ea580c] mt-1 flex-shrink-0">→</span>
            <span><Link href="/portfolio" className="font-medium text-[#1c1917] hover:text-[#ea580c] transition-colors">作品集</Link> — 實際交付的 n8n 工作流案例與成效</span>
          </li>
          <li className="flex items-start gap-3 text-[#44403c]">
            <span className="text-[#ea580c] mt-1 flex-shrink-0">→</span>
            <span><Link href="/blog" className="font-medium text-[#1c1917] hover:text-[#ea580c] transition-colors">文章</Link> — 自動化實戰心得與踩坑記錄</span>
          </li>
        </ul>
      </div>

      <div className="border-t border-[#e7e5e4] pt-10">
        <h2 className="font-serif text-xl font-semibold text-[#1c1917] mb-4">聯絡我</h2>
        <ul className="flex flex-wrap gap-4">
          {socialLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#78716c] hover:text-[#ea580c] transition-colors border border-[#e7e5e4] rounded-full px-4 py-1.5 hover:border-[#ea580c]"
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
