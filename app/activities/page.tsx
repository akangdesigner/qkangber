import Image from 'next/image'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: { absolute: '活動足跡 — Q kangber 參與的講座與活動記錄' },
  description: '按時間記錄我實際參與的技術活動與講座，含當下觀察到的 AI 與自動化趨勢，作為長期關注這個領域的第一手紀錄。',
  path: '/activities',
})

const MONO = 'var(--font-jetbrains), ui-monospace, monospace'

type Activity = {
  date: string // YYYY-MM-DD
  status?: string // 狀態標籤：即將參加 / 即將開始 · 12 週…（過去參加過的省略）
  title: string
  desc: string
  link?: { href: string; label: string }
  image?: { src: string; alt: string } // 有現場照片才給，會自動交替左右排版
}

// 依日期新→舊排序，新增時加在陣列最前面。
const activities: Activity[] = [
  {
    date: '2026-07-25',
    status: '即將參加',
    title: 'AI 一人創業訓練營',
    desc: '聚焦「一人公司」的實作型訓練營。以 AI 工具為核心，帶著把個人創業的定位、產品、內容到行銷跑完一整輪，重點在如何用最小人力把事情系統化地撐起來。',
    link: { href: 'https://www.xlab.com.tw/events', label: '活動官網' },
  },
  {
    date: '2026-07-18',
    status: '即將開始 · 12 週',
    title: '為期 12 週的訓練營',
    desc: '為期 12 週的長期訓練營，循序從零帶學員建立自己的 AI 工作流與實作專案。強調的是持續產出與逐週累積，而不是短期速成的一次性課程。',
    link: { href: 'https://www.xlab.com.tw/events', label: '活動官網' },
  },
  {
    date: '2026-07-09',
    title: 'Google Cloud Day',
    desc: 'Google Cloud 的年度技術大會，聚焦生成式 AI、資料與雲端架構的最新進展。涵蓋 Gemini、Vertex AI 等產品的實戰場次與企業導入案例，是一次掌握雲端 AI 全貌的現場。',
    link: { href: 'https://www.xlab.com.tw/events', label: '活動官網' },
  },
]

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${y}.${m}.${d}`
}

function StatusTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full text-[0.58rem] font-semibold tracking-[0.16em] uppercase"
      style={{ padding: '2px 8px', color: '#c4b5fd', background: 'rgba(124,92,255,0.12)', border: '1px solid rgba(124,92,255,0.28)' }}
    >
      {children}
    </span>
  )
}

function EntryLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-sm"
      style={{ color: '#93c5fd' }}
    >
      {label}
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </a>
  )
}

export default function ActivitiesPage() {
  // 依年份分組（新→舊），每組前面標一個年份 marker
  const years = Array.from(new Set(activities.map((a) => a.date.slice(0, 4))))

  return (
    <main className="relative overflow-hidden pb-16 sm:pb-24">
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.16), transparent 60%)' }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.03 }} />

      <div className="max-w-[940px] mx-auto px-4 sm:px-6 pt-12 sm:pt-24">
        {/* header */}
        <header className="mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <span className="block h-[1.5px] w-[26px] rounded-full" style={{ background: 'linear-gradient(90deg,#7c5cff,#60a5fa)' }} />
            <span className="text-[0.68rem] font-semibold tracking-[0.28em] uppercase" style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Activities
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.08] mb-5">活動足跡</h1>
          <p className="text-slate-400 leading-relaxed max-w-[56ch] text-base sm:text-[1.0625rem]">
            按時間順序記錄我實際參與的技術活動與講座——每則簡述這場活動在做什麼、聚焦哪些主題。想細看的觀察與延伸，會另外寫成
            <Link href="/blog" className="text-violet-300 hover:text-violet-200 underline underline-offset-4 mx-1">部落格文章</Link>。
          </p>
        </header>

        {/* timeline */}
        <div className="relative" style={{ paddingLeft: 'clamp(26px, 6vw, 40px)' }}>
          {/* vertical line */}
          <div
            aria-hidden
            className="absolute top-1.5 bottom-1.5 w-[1.5px]"
            style={{ left: 8.25, background: 'linear-gradient(180deg,rgba(124,92,255,0.55),rgba(96,165,250,0.28) 55%,rgba(255,255,255,0.06))' }}
          />

          {years.map((year) => (
            <div key={year}>
              <div className="relative -ml-1 mb-8">
                <span className="font-semibold tracking-[0.18em]" style={{ fontFamily: MONO, fontSize: '0.72rem', color: '#475569' }}>{year}</span>
              </div>

              {activities.filter((a) => a.date.startsWith(year)).map((a, i) => {
                const imageRight = i % 2 === 1
                return (
                  <article key={a.date + a.title} className="relative pb-11 sm:pb-16 last:pb-1.5">
                    {/* node dot */}
                    <span
                      aria-hidden
                      className="absolute top-[5px] w-[11px] h-[11px] rounded-full"
                      style={{ left: 'calc(3.5px - clamp(26px, 6vw, 40px))', background: 'radial-gradient(circle at 35% 30%,#a78bfa,#7c5cff)', boxShadow: '0 0 0 4px rgba(124,92,255,0.12), 0 0 14px rgba(124,92,255,0.5)' }}
                    />
                    <div
                      className="flex flex-wrap items-center gap-4 sm:gap-8"
                      style={{ flexDirection: a.image ? (imageRight ? 'row-reverse' : 'row') : 'row' }}
                    >
                      {a.image && (
                        <div className="min-w-0 overflow-hidden rounded-xl border border-white/[0.08]" style={{ flex: '1 1 260px', aspectRatio: '16/10', background: 'rgba(255,255,255,0.02)' }}>
                          <div className="relative w-full h-full">
                            <Image src={a.image.src} alt={a.image.alt} fill sizes="(max-width: 720px) 100vw, 420px" style={{ objectFit: 'cover' }} />
                          </div>
                        </div>
                      )}
                      <div className="min-w-0" style={{ flex: a.image ? '1 1 300px' : '1 1 100%' }}>
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <time dateTime={a.date} style={{ fontFamily: MONO, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#7c5cff' }}>
                            {formatDate(a.date)}
                          </time>
                          {a.status && <StatusTag>{a.status}</StatusTag>}
                        </div>
                        <h2 className="text-lg sm:text-2xl font-semibold text-slate-100 tracking-[-0.015em] leading-snug mb-2.5 mt-0">{a.title}</h2>
                        <p className="text-[0.95rem] sm:text-[1.0625rem] leading-[1.8] text-slate-300 m-0 mb-3">{a.desc}</p>
                        {a.link && <EntryLink href={a.link.href} label={a.link.label} />}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ))}

          {/* tail */}
          <div className="relative mt-1.5">
            <span aria-hidden className="absolute top-0.5 w-[5px] h-[5px] rounded-full" style={{ left: 'calc(6.5px - clamp(26px, 6vw, 40px))', background: 'rgba(255,255,255,0.18)' }} />
            <p className="m-0 text-sm tracking-[0.04em]" style={{ color: '#475569' }}>持續紀錄中 · 更多深度觀察在部落格</p>
          </div>
        </div>
      </div>
    </main>
  )
}
