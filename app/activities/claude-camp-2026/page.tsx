import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import StatusTag from '@/components/activities/StatusTag'
import { buildMetadata } from '@/lib/metadata'
import { jsonLdScript } from '@/lib/jsonld'

export const metadata = buildMetadata({
  title: { absolute: 'Claude 實戰訓練營 12 週上課紀錄 — Q kangber 活動分享' },
  description:
    '2026 年 7 月開課的 Claude 實戰訓練營逐週紀錄：12 週用 VIBE Coding 把一個解決自己真實困擾的網頁工具從想法做到上線。每週更新當週講了什麼、現場照片與課堂重點。',
  path: '/activities/claude-camp-2026',
  ogTitle: 'Claude 實戰訓練營 12 週上課紀錄',
  ogSubtitle: '實體＋線上混成班，每週更新上課內容',
  ogBadge: '上課紀錄',
  type: 'article',
  publishedTime: '2026-07-18',
  authors: ['Q kangber'],
})

const BASE_PATH = '/activities/claude-camp-2026'
const MONO = 'var(--font-jetbrains), ui-monospace, monospace'

// 12 週課程表（濃縮自課綱）
const SYLLABUS: { week: string; tool: string; title: string }[] = [
  { week: 'W1', tool: 'Chat', title: 'Chat 基礎與專案啟動' },
  { week: 'W2', tool: 'Chat', title: '用 AI 產出產品規劃（PRD）' },
  { week: 'W3', tool: 'Cowork＋Design', title: '建專屬知識庫與產品視覺框架' },
  { week: 'W4', tool: 'Artifacts', title: '做出前端畫面（一）' },
  { week: 'W5', tool: 'Artifacts', title: '做出前端畫面（二）' },
  { week: 'W6', tool: 'Artifacts', title: '前端細節美化與 RWD' },
  { week: 'W7', tool: 'Claude Code', title: '進階邏輯與資料運算' },
  { week: 'W8', tool: 'n8n', title: '工具串接：第一條工作流' },
  { week: 'W9', tool: 'n8n＋Supabase', title: '接資料庫，產品記得住資料' },
  { week: 'W10', tool: 'Code＋MCP', title: '全棧整合與第三方 API' },
  { week: 'W11', tool: 'Code＋Zeabur', title: '整合測試與部署上線' },
  { week: 'W12', tool: 'Demo Day', title: '成果發表' },
]

type WeekPhoto = { src: string; alt: string; caption: string; pos?: string }
type WeekLog = {
  week: string
  date: string
  title: string
  intro: string
  firstHalf: { title: string; points: string[] }
  secondHalf: { title: string; points: string[] }
  photos?: WeekPhoto[]
}

// 逐週紀錄：新的一週加在陣列最前面
const LOGS: WeekLog[] = [
  {
    week: 'W2',
    date: '2026-07-25',
    title: '讓 Claude 成為你的產品經理',
    intro:
      '第二週，實體教室與線上直播同步進行。上半場從「猜字機為什麼會聽話」講後訓練原理，接著讓 AI 掛上毒舌產品經理的人格，把 W1 的一頁構想書拷問成六格 PRD；下半場把 PRD 拆成 User Story 卡片，寫出頁面清單與文字線框，湊齊一整包可以開工的設計需求。',
    firstHalf: {
      title: '上半場 · 後訓練 × 痛點拷問 × 六格 PRD',
      points: [
        '後訓練三階段：SFT 看師傅示範、獎勵模型學會分好壞、RLHF 自己練到出師，從後空翻機器人一路講到 Claude 的憲法（Constitutional AI）',
        '把模型變專才的三條路：微調、角色設定、餵資料（RAG），重點放在後兩條現在就做得到的',
        'AI 的諂媚是訓練出來的反射：直接問「你覺得如何」只會被誇，指定毒舌產品經理人格、要求挑戰假設，它才會戳中構想書沒寫的地方',
        '實作：學 Amazon 動工前先寫新聞稿的精神，用痛點拷問把一頁構想書升級成六格 PRD',
      ],
    },
    secondHalf: {
      title: '下半場 · User Story × 頁面清單 × 文字線框',
      points: [
        'User Story 三格句型：身為（具體的誰）、我想要（做一件具體的事）、這樣就能（得到一個好處），每一格都在防一種白做工',
        'MoSCoW 法把卡片分四疊：Must、Should、Could、Won’t，第一版只做第一疊',
        '學迪士尼 1933 年的分鏡牆：錯在紙上很便宜，錯在成品上很貴。動工前先用文字線框把每一頁「哪裡放什麼、寫什麼字、按了去哪」講清楚',
        '下課前每個人手上有一包設計需求：六格 PRD、卡片牆、頁面清單、文字線框，W4 直接拿去長出原型',
      ],
    },
    photos: [
      {
        src: '/activities/claude-camp-w2-live.webp',
        alt: 'Claude 實戰訓練營第 2 週實體課現場，學員各自用筆電跟著操作，投影幕正在講角色設定',
        caption: '實體教室：投影幕上是「差一句角色設定，回答天差地遠」的對照示範',
        pos: 'center 45%',
      },
      {
        src: '/activities/claude-camp-w2-online.webp',
        alt: 'Claude 實戰訓練營第 2 週線上同步畫面，Google Meet 分享上半場簡報，多位學員同時在線',
        caption: '線上同步：Google Meet 直播 W2 上半場簡報，線上學員即時跟課',
      },
    ],
  },
  {
    week: 'W1',
    date: '2026-07-18',
    title: 'Chat 基本應用與專案啟動',
    intro:
      '開課第一週。上半場認識課程與 Claude 產品家族，每個人用一段訪談提示詞定下自己 12 週的專案方向；下半場講大模型原理與提示詞方法，懂它怎麼運作、把話講清楚、知道它哪裡會出錯。',
    firstHalf: {
      title: '上半場 · 認識課程與 Claude',
      points: [
        '這門課的心法 VIBE Coding：意圖引導優於語法記憶，你負責想清楚、講明白、判斷好不好，程式讓 AI 寫',
        'Claude 產品家族一次認識：Chat 對話、Projects 知識庫、Design 設計、Artifacts 即時成品、Claude Code 開發代理、Cowork AI 代理，重點是同一條工作流的搭配',
        '專案啟動：從預約報名、記錄追蹤、客戶管理、個人品牌、知識整理、小生意六個方向挑一個，用專案方向卡提示詞跑出 12 週做得完的題目',
      ],
    },
    secondHalf: {
      title: '下半場 · 原理 × 提示詞 × 幻覺',
      points: [
        '大模型只做一件事：根據前文猜下一個字。讀了十幾兆字、幾千億個參數，讀完整座圖書館但從來沒出過門',
        '提示詞四件套：角色＋背景＋任務＋格式，加上三個進階招：給範例、要求追問、先想再答',
        '幻覺的三個成因與防幻覺四招：資料貼給它再問、只根據給的內容回答、明確允許說不知道、重要資訊交叉驗證',
        '回家作業：用訪談提示詞把專案方向跑成一頁企畫書，並在真實工作裡練三次四件套',
      ],
    },
  },
]

export default function ClaudeCamp2026Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Claude 實戰訓練營 12 週上課紀錄',
    description:
      'Claude 實戰訓練營逐週紀錄：12 週用 VIBE Coding 把一個解決自己真實困擾的網頁工具從想法做到上線，每週更新上課內容與現場照片。',
    url: `https://aiqkangber.com${BASE_PATH}`,
    datePublished: '2026-07-18',
    dateModified: '2026-07-25',
    author: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
      sameAs: [
        'https://www.threads.com/@q_kangber',
        'https://www.instagram.com/q_kangber',
      ],
    },
    publisher: { '@type': 'Person', name: 'Q kangber', url: 'https://aiqkangber.com' },
  }

  return (
    <main className="relative overflow-hidden pb-16 sm:pb-24">
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.16), transparent 60%)' }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.03 }} />

      <div className="max-w-[940px] mx-auto px-4 sm:px-6 pt-12 sm:pt-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
        <Breadcrumbs crumbs={[
          { label: '首頁', href: '/' },
          { label: '活動分享', href: '/activities' },
          { label: 'Claude 實戰訓練營' },
        ]} />

        {/* hero */}
        <header className="mb-12 sm:mb-16">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full" style={{ padding: '6px 15px', border: '1px solid rgba(124,92,255,0.3)', background: 'rgba(124,92,255,0.07)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#c4b5fd' }}>
              Claude Bootcamp
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.12] mb-5">
            Claude 實戰訓練營<br className="hidden sm:block" /> 12 週上課紀錄
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-[58ch] text-base sm:text-[1.0625rem]">
            課程一句話：不寫程式的人，用 12 週把一個解決自己真實困擾的網頁工具從想法做到上線，並在 Demo Day 發表。方法論是 VIBE Coding，用意圖引導 AI，不是背語法。這頁逐週記錄每次上課講了什麼，跟著課程一路更新到 W12。
          </p>
          <p className="mt-6" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em', color: '#475569', margin: '24px 0 0' }}>
            <span style={{ color: '#a78bfa' }}>2026.07.18 開課</span><span style={{ color: '#334155' }}>·</span>
            <span>XLab AI 實驗室</span><span style={{ color: '#334155' }}>·</span>
            <span>每週 3 小時</span><span style={{ color: '#334155' }}>·</span>
            <span>實體＋線上混成班</span><span style={{ color: '#334155' }}>·</span>
            <span><span style={{ color: '#c4b5fd' }}>{LOGS.length}</span> / 12 週已記錄</span>
          </p>
        </header>

        {/* 12 週課程表 */}
        <section className="mb-12 sm:mb-16">
          <h2 className="m-0 mb-5 text-xl sm:text-2xl font-semibold text-white tracking-[-0.015em]">12 週在做什麼</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYLLABUS.map((s) => {
              const logged = LOGS.some((l) => l.week === s.week)
              return (
                <div key={s.week} className="rounded-xl p-3.5 border" style={{ borderColor: logged ? 'rgba(124,92,255,0.35)' : 'rgba(255,255,255,0.08)', background: logged ? 'rgba(124,92,255,0.06)' : 'rgba(255,255,255,0.02)' }}>
                  <p className="m-0 mb-1 flex items-center gap-2">
                    <span style={{ fontFamily: MONO, fontSize: '0.72rem', fontWeight: 700, color: logged ? '#a78bfa' : '#64748b' }}>{s.week}</span>
                    <span style={{ fontFamily: MONO, fontSize: '0.62rem', letterSpacing: '0.05em', color: '#475569' }}>{s.tool}</span>
                  </p>
                  <p className="m-0 text-[0.82rem] leading-snug" style={{ color: logged ? '#e2e8f0' : '#94a3b8' }}>{s.title}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 逐週紀錄 */}
        <section>
          <h2 className="m-0 mb-8 text-xl sm:text-2xl font-semibold text-white tracking-[-0.015em]">逐週紀錄</h2>
          <div className="flex flex-col gap-12 sm:gap-16">
            {LOGS.map((log) => (
              <article key={log.week} className="rounded-2xl p-5 sm:p-8 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span style={{ fontFamily: MONO, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', color: '#7c5cff' }}>{log.week}</span>
                  <StatusTag tone="muted">{log.date.replaceAll('-', '.')}</StatusTag>
                </div>
                <h3 className="m-0 mb-3 text-lg sm:text-2xl font-semibold text-slate-100 tracking-[-0.015em] leading-snug">{log.title}</h3>
                <p className="m-0 mb-6 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">{log.intro}</p>

                {log.photos && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {log.photos.map((p) => (
                      <figure key={p.src} className="m-0">
                        <div className="overflow-hidden rounded-xl border border-white/[0.08]" style={{ aspectRatio: '16/10', background: 'rgba(255,255,255,0.02)' }}>
                          <div className="relative w-full h-full">
                            <Image src={p.src} alt={p.alt} fill sizes="(max-width: 640px) 100vw, 430px" style={{ objectFit: 'cover', objectPosition: p.pos || 'center' }} />
                          </div>
                        </div>
                        <figcaption className="mt-2 text-[0.78rem] leading-relaxed text-slate-500">{p.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[log.firstHalf, log.secondHalf].map((half) => (
                    <div key={half.title} className="rounded-xl p-4 sm:p-5" style={{ border: '1px solid rgba(124,92,255,0.18)', background: 'rgba(124,92,255,0.04)' }}>
                      <p className="m-0 mb-3 text-sm font-semibold text-slate-100">{half.title}</p>
                      <ul className="m-0 p-0 pl-4 text-[0.85rem] leading-[1.8] text-slate-400">
                        {half.points.map((pt) => <li key={pt} className="mb-1.5 last:mb-0">{pt}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 結尾 CTA */}
        <div className="mt-14 sm:mt-20 rounded-2xl p-6 sm:p-8 text-center" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
          <p className="m-0 mb-5 text-slate-300 leading-relaxed text-[0.95rem] sm:text-base">
            課程還在進行中，每週上完課就會更新這頁。想了解報名資訊可以到 XLab 活動官網看下一梯的時間。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Link href="/activities" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
              回活動分享
            </Link>
            <a href="https://www.xlab.com.tw/events" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              XLab 活動官網
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
            <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              逛 AI × n8n 知識庫
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
