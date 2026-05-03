import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '關於 Q康寶 — n8n 自動化工程師',
  description: '我是 Q康寶，整合 AI 工具與 n8n 自動化流程，讓工作達到高效產出。在意的不是用了多少 AI，而是 AI 有沒有精準表達你的想法。',
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
          Q康寶
        </span>
      </h1>

      <div className="space-y-5 text-[1.05rem] text-slate-300 leading-[1.85] mb-14">
        <p>
          我做的事是整合 AI 工具——不只是自動化、不只是省時間，而是讓整套工作流程達到真正高效的產出。從資料怎麼流、系統怎麼串，到最後產出什麼，每個環節都要設計過。
        </p>
        <p>
          AI 不是用來取代你的判斷，而是用來精準表達你的想法。產品提案、創意發想、寫文案——這些工作的核心還是你，AI 的角色是讓你的想法更快落地、更清楚呈現。一味依賴只會讓輸出變得平庸，找到人與 AI 的分工點，才是真正有效的使用方式。
        </p>
        <p>
          我追求的是 AI 與人之間的平衡——不是口號，是每個案子都在實際拿捏的事。
        </p>
      </div>

      <div className="border-t border-white/[0.06] pt-10 mb-10">
        <h2 className="text-lg font-semibold text-white mb-6 tracking-[-0.01em]">學歷 &amp; 經歷</h2>
        <div className="space-y-6">
          <div>
            <p className="text-[0.7rem] tracking-[0.22em] uppercase font-semibold text-violet-400 mb-3">學歷</p>
            <div className="flex items-start gap-3 text-slate-300">
              <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
              <div>
                <p className="font-medium text-white">商業自動化與管理學系　碩士</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[0.7rem] tracking-[0.22em] uppercase font-semibold text-violet-400 mb-3">經歷</p>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                <div>
                  <p className="font-medium text-white">電商公司　電商出貨自動化專員</p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">負責第三方物流出貨溝通協調，主導出貨流程自動化建置。</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                <div>
                  <p className="font-medium text-white">行銷公司　AI 流程開發工程師 <span className="text-xs text-violet-300 font-normal ml-1">現職</span></p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">設計與開發 AI 驅動的行銷自動化流程，整合 n8n 與各類 API。</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                <div>
                  <p className="font-medium text-white">企業合作講師 <span className="text-xs text-violet-300 font-normal ml-1">現職</span></p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">每週赴合作企業進行 AI 與自動化工具培訓。</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex-shrink-0 text-violet-400">▪</span>
                <div>
                  <p className="font-medium text-white">職涯平台　課程講師 <span className="text-xs text-violet-300 font-normal ml-1">現職</span></p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">開設 n8n 自動化與 AI 工具應用課程，包含 Claude 系列實戰內容。</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
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
                className="text-sm text-slate-300 hover:text-white transition-all duration-150 rounded-full px-4 py-1.5 border border-white/10 hover:border-violet-400/50"
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
