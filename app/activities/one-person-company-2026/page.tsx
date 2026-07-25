import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import StatusTag from '@/components/activities/StatusTag'
import { buildMetadata } from '@/lib/metadata'
import { jsonLdScript } from '@/lib/jsonld'

export const metadata = buildMetadata({
  title: { absolute: 'AI 時代的一人公司 講座整理 — Q kangber 活動分享' },
  description:
    '2026-07-25 在 XLab 的 60 分鐘講座完整整理：AI 改變的成本結構、一個人經營品牌的四部門分工地圖、把 AI 當同事帶的三個動作（交接、給範本、驗收）、三個常見卡點與 AI 能接手的界線，以及低成本驗證的第一個月行動清單。',
  path: '/activities/one-person-company-2026',
  ogTitle: 'AI 時代的一人公司 講座整理',
  ogSubtitle: '60 分鐘講座內容，五個段落完整整理',
  ogBadge: '講座整理',
  type: 'article',
  publishedTime: '2026-07-25',
  authors: ['Q kangber'],
})

const BASE_PATH = '/activities/one-person-company-2026'
const MONO = 'var(--font-jetbrains), ui-monospace, monospace'
const SANS = 'inherit'

// 圖表用色（已跑 dataviz 驗證：暗底、CVD 分離、對比皆通過）
const AMBER = '#d97706' // 以前請團隊
const VIOLET = '#8b5cf6' // 現在訂閱工具
const INK = '#e2e8f0'
const INK_SOFT = '#94a3b8'
const INK_FAINT = '#64748b'
const LINE = 'rgba(255,255,255,0.1)'
const PANEL = 'rgba(255,255,255,0.02)'

// 版面小元件：段落 eyebrow ＋ 標題
function PartHeader({ no, en, title }: { no: string; en: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="m-0 mb-2 font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, fontSize: '0.78rem', color: '#a78bfa' }}>
        Part {no} · {en}
      </p>
      <h2 className="m-0 text-2xl sm:text-[2.1rem] font-semibold text-white tracking-[-0.015em] leading-snug">{title}</h2>
    </div>
  )
}

function Card({ title, tag, children }: { title: string; tag?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 sm:p-6 border border-white/[0.08]" style={{ background: PANEL }}>
      <div className="flex items-baseline gap-2.5 mb-2.5">
        <h3 className="m-0 text-[1.05rem] sm:text-lg font-semibold text-slate-100">{title}</h3>
        {tag && <span style={{ fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.08em', color: '#a78bfa' }}>{tag}</span>}
      </div>
      <p className="m-0 text-[0.95rem] sm:text-base leading-[1.85] text-slate-400">{children}</p>
    </div>
  )
}

// 圖解外框：窄螢幕可橫向捲動，圖不縮到看不見
function Figure({ minWidth, caption, label, children }: { minWidth: number; caption: string; label: string; children: React.ReactNode }) {
  return (
    <figure className="m-0 mb-6 rounded-2xl border border-white/[0.08] p-4 sm:p-6" style={{ background: PANEL }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth }} role="img" aria-label={label}>
          {children}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[0.8rem] tracking-[0.04em]" style={{ fontFamily: MONO, color: INK_FAINT }}>{caption}</figcaption>
    </figure>
  )
}

// Part 1 · 成本對比長條圖（比例真實：17.5 萬 vs 約 0.2 萬）
function CostBars() {
  return (
    <svg viewBox="0 0 960 170" style={{ display: 'block', width: '100%', height: 'auto' }} aria-hidden>
      <text x="20" y="28" fill={INK} fontSize="17" fontWeight="600" fontFamily={SANS}>以前請團隊</text>
      <text x="940" y="28" fill={INK} fontSize="17" fontWeight="700" fontFamily={MONO} textAnchor="end">17.5 萬／月起</text>
      <rect x="20" y="38" width="920" height="26" rx="4" fill={AMBER} />
      <text x="20" y="106" fill={INK} fontSize="17" fontWeight="600" fontFamily={SANS}>現在訂閱工具</text>
      <text x="940" y="106" fill={INK} fontSize="17" fontWeight="700" fontFamily={MONO} textAnchor="end">約 0.2 萬／月＋你的時間</text>
      <rect x="20" y="116" width="14" height="26" rx="4" fill={VIOLET} />
      <line x1="20" y1="152" x2="940" y2="152" stroke={LINE} strokeWidth="1" />
    </svg>
  )
}

// Part 2 · 一人公司組織圖
function OrgChart() {
  const depts = [
    { en: 'Content', name: '內容部', d1: '部落格文章、電子報', d2: '影片腳本', cx: 140 },
    { en: 'Marketing', name: '行銷部', d1: '貼文、廣告文案', d2: 'SEO 題目與初稿', cx: 373 },
    { en: 'Sales', name: '業務部', d1: '接案提案、報價範本', d2: '洽談機器人', cx: 606 },
    { en: 'Dev', name: '開發部', d1: '官網、內部工具', d2: '自動化流程', cx: 839 },
  ]
  return (
    <svg viewBox="0 0 960 330" style={{ display: 'block', width: '100%', height: 'auto' }} aria-hidden>
      <rect x="330" y="14" width="300" height="82" rx="14" fill="rgba(139,92,246,0.1)" stroke={VIOLET} strokeWidth="1.5" />
      <text x="480" y="50" fill="#fff" fontSize="24" fontWeight="700" fontFamily={SANS} textAnchor="middle">你</text>
      <text x="480" y="78" fill={INK_SOFT} fontSize="15" fontFamily={SANS} textAnchor="middle">定方向 · 把關品質</text>
      <line x1="480" y1="96" x2="480" y2="128" stroke={VIOLET} strokeWidth="1.5" />
      <line x1="140" y1="128" x2="839" y2="128" stroke={LINE} strokeWidth="1.5" />
      {depts.map((d) => (
        <g key={d.en}>
          <line x1={d.cx} y1="128" x2={d.cx} y2="152" stroke={LINE} strokeWidth="1.5" />
          <rect x={d.cx - 105} y="152" width="210" height="150" rx="12" fill={PANEL} stroke={LINE} strokeWidth="1.5" />
          <rect x={d.cx - 105} y="152" width="210" height="4" rx="2" fill={VIOLET} />
          <text x={d.cx} y="186" fill="#a78bfa" fontSize="13" fontFamily={MONO} textAnchor="middle" letterSpacing="0.1em">{d.en}</text>
          <text x={d.cx} y="218" fill="#fff" fontSize="21" fontWeight="700" fontFamily={SANS} textAnchor="middle">{d.name}</text>
          <text x={d.cx} y="250" fill={INK_SOFT} fontSize="14.5" fontFamily={SANS} textAnchor="middle">{d.d1}</text>
          <text x={d.cx} y="274" fill={INK_SOFT} fontSize="14.5" fontFamily={SANS} textAnchor="middle">{d.d2}</text>
        </g>
      ))}
    </svg>
  )
}

// Part 3 · 帶 AI 同事的三個動作
function FlowThree() {
  const steps = [
    { no: '動作一', name: '交接', d1: '把產品資料、常用說法、', d2: '過去作品整理成文件給它', x: 20 },
    { no: '動作二', name: '給範本', d1: '拿一份你滿意的成品當標準，', d2: '給例子比說「寫好一點」有用', x: 350 },
    { no: '動作三', name: '驗收', d1: '它交的是初稿，發出去之前', d2: '最後一關是你', x: 680 },
  ]
  return (
    <svg viewBox="0 0 960 170" style={{ display: 'block', width: '100%', height: 'auto' }} aria-hidden>
      <defs>
        <marker id="opc-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={VIOLET} />
        </marker>
      </defs>
      {steps.map((s) => (
        <g key={s.name}>
          <rect x={s.x} y="20" width="260" height="130" rx="14" fill={PANEL} stroke={LINE} strokeWidth="1.5" />
          <text x={s.x + 130} y="52" fill="#a78bfa" fontSize="13" fontFamily={MONO} textAnchor="middle" letterSpacing="0.12em">{s.no}</text>
          <text x={s.x + 130} y="84" fill="#fff" fontSize="23" fontWeight="700" fontFamily={SANS} textAnchor="middle">{s.name}</text>
          <text x={s.x + 130} y="112" fill={INK_SOFT} fontSize="13.5" fontFamily={SANS} textAnchor="middle">{s.d1}</text>
          <text x={s.x + 130} y="132" fill={INK_SOFT} fontSize="13.5" fontFamily={SANS} textAnchor="middle">{s.d2}</text>
        </g>
      ))}
      <line x1="285" y1="85" x2="340" y2="85" stroke={VIOLET} strokeWidth="2.5" markerEnd="url(#opc-arr)" />
      <line x1="615" y1="85" x2="670" y2="85" stroke={VIOLET} strokeWidth="2.5" markerEnd="url(#opc-arr)" />
    </svg>
  )
}

// Part 4 · AI 是放大器：放大的是你的專業
function Amplifier() {
  return (
    <svg viewBox="0 0 960 250" style={{ display: 'block', width: '100%', height: 'auto' }} aria-hidden>
      <defs>
        <marker id="opc-arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={INK_FAINT} />
        </marker>
      </defs>
      {/* 上排：有專業 */}
      <rect x="20" y="20" width="250" height="80" rx="12" fill={PANEL} stroke={VIOLET} strokeWidth="1.5" />
      <text x="145" y="55" fill="#fff" fontSize="19" fontWeight="700" fontFamily={SANS} textAnchor="middle">你的專業</text>
      <text x="145" y="82" fill="#a78bfa" fontSize="16" fontFamily={MONO} textAnchor="middle">那個「1」</text>
      <line x1="280" y1="60" x2="360" y2="60" stroke={INK_FAINT} strokeWidth="2.5" markerEnd="url(#opc-arr2)" />
      <rect x="370" y="20" width="220" height="80" rx="12" fill="rgba(139,92,246,0.1)" stroke={VIOLET} strokeWidth="1.5" />
      <text x="480" y="55" fill="#fff" fontSize="19" fontWeight="700" fontFamily={SANS} textAnchor="middle">AI 放大器</text>
      <text x="480" y="82" fill="#a78bfa" fontSize="16" fontFamily={MONO} textAnchor="middle">× 10</text>
      <line x1="600" y1="60" x2="680" y2="60" stroke={INK_FAINT} strokeWidth="2.5" markerEnd="url(#opc-arr2)" />
      <rect x="690" y="20" width="250" height="80" rx="12" fill="rgba(139,92,246,0.14)" stroke={VIOLET} strokeWidth="2" />
      <text x="815" y="55" fill="#fff" fontSize="19" fontWeight="700" fontFamily={SANS} textAnchor="middle">有差異的產出</text>
      <text x="815" y="82" fill="#a78bfa" fontSize="16" fontWeight="700" fontFamily={MONO} textAnchor="middle">= 10</text>
      {/* 下排：沒專業 */}
      <rect x="20" y="140" width="250" height="80" rx="12" fill={PANEL} stroke={LINE} strokeWidth="1.5" />
      <text x="145" y="175" fill={INK_SOFT} fontSize="19" fontWeight="700" fontFamily={SANS} textAnchor="middle">沒有累積的專業</text>
      <text x="145" y="202" fill={INK_FAINT} fontSize="16" fontFamily={MONO} textAnchor="middle">0</text>
      <line x1="280" y1="180" x2="360" y2="180" stroke={INK_FAINT} strokeWidth="2.5" markerEnd="url(#opc-arr2)" />
      <rect x="370" y="140" width="220" height="80" rx="12" fill={PANEL} stroke={LINE} strokeWidth="1.5" />
      <text x="480" y="175" fill={INK_SOFT} fontSize="19" fontWeight="700" fontFamily={SANS} textAnchor="middle">AI 放大器</text>
      <text x="480" y="202" fill={INK_FAINT} fontSize="16" fontFamily={MONO} textAnchor="middle">× 10</text>
      <line x1="600" y1="180" x2="680" y2="180" stroke={INK_FAINT} strokeWidth="2.5" markerEnd="url(#opc-arr2)" />
      <rect x="690" y="140" width="250" height="80" rx="12" fill={PANEL} stroke={AMBER} strokeWidth="1.5" strokeDasharray="7 5" />
      <text x="815" y="175" fill={INK_SOFT} fontSize="19" fontWeight="700" fontFamily={SANS} textAnchor="middle">放大後的平庸</text>
      <text x="815" y="202" fill={AMBER} fontSize="16" fontWeight="700" fontFamily={MONO} textAnchor="middle">還是 0</text>
    </svg>
  )
}

// Part 5 · 第一個月時間軸
function MonthTimeline() {
  const stops = [
    { cx: 150, week: '第 1 週', title: '填完一頁定位表', desc: '定位、客群、產品、收費' },
    { cx: 480, week: '第 2–3 週', title: '發出三篇內容', desc: 'AI 產草稿，改到有你的語氣' },
    { cx: 810, week: '第 4 週', title: '自動化一件事', desc: '每週重複的工作交給 AI 或 n8n' },
  ]
  return (
    <svg viewBox="0 0 960 190" style={{ display: 'block', width: '100%', height: 'auto' }} aria-hidden>
      <line x1="60" y1="50" x2="900" y2="50" stroke={LINE} strokeWidth="2" />
      {stops.map((s) => (
        <g key={s.week}>
          <circle cx={s.cx} cy="50" r="9" fill={VIOLET} />
          <circle cx={s.cx} cy="50" r="16" fill="none" stroke={VIOLET} strokeWidth="1.5" opacity="0.35" />
          <text x={s.cx} y="26" fill="#a78bfa" fontSize="15" fontWeight="700" fontFamily={MONO} textAnchor="middle">{s.week}</text>
          <text x={s.cx} y="102" fill="#fff" fontSize="19" fontWeight="700" fontFamily={SANS} textAnchor="middle">{s.title}</text>
          <text x={s.cx} y="130" fill={INK_SOFT} fontSize="14.5" fontFamily={SANS} textAnchor="middle">{s.desc}</text>
        </g>
      ))}
      <text x="480" y="172" fill={INK_FAINT} fontSize="14" fontFamily={MONO} textAnchor="middle">先花錢之前，先用一個月驗證</text>
    </svg>
  )
}

export default function OnePersonCompany2026Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'AI 時代的一人公司 講座整理',
    description:
      'XLab 講座完整整理：AI 改變的成本結構、一人公司的四部門分工地圖、把 AI 當同事帶的方法、卡點與界線、低成本驗證的第一步。',
    url: `https://aiqkangber.com${BASE_PATH}`,
    datePublished: '2026-07-25',
    dateModified: '2026-07-26',
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

      <div className="max-w-[860px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
        <Breadcrumbs crumbs={[
          { label: '首頁', href: '/' },
          { label: '活動分享', href: '/activities' },
          { label: 'AI 時代的一人公司' },
        ]} />

        {/* hero */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <StatusTag>XLab</StatusTag>
            <StatusTag>擔任講師</StatusTag>
            <StatusTag tone="muted">2026.07.25</StatusTag>
            <StatusTag tone="muted">60 分鐘</StatusTag>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.12] mb-5">
            AI 時代的一人公司<br className="hidden sm:block" /> 講座整理
          </h1>
          <p className="text-slate-400 leading-[1.9] max-w-[56ch] text-base sm:text-lg">
            在 XLab「獨立 AI 創業團隊專場」講了 60 分鐘：如何利用 AI 分工，打造你的創業團隊。這頁把五個段落的簡報內容整理成文字版，沒到現場的人也能照著看完一遍。
          </p>
        </header>

        {/* 主視覺 */}
        <div className="mb-12 sm:mb-16 overflow-hidden rounded-2xl border border-white/[0.08]" style={{ aspectRatio: '16/9', background: PANEL }}>
          <div className="relative w-full h-full">
            <Image
              src="/activities/xlab-one-person-company-v2.webp"
              alt="XLab 講座主視覺「一人公司 · AI 分工打造一個團隊」，標示 Marketing、Content、Customer Service、Development 等 AI 分工"
              fill
              sizes="(max-width: 860px) 100vw, 812px"
              priority
              style={{ objectFit: 'cover', objectPosition: 'left' }}
            />
          </div>
        </div>

        {/* Part 1 */}
        <section className="mb-14 sm:mb-20">
          <PartHeader no="01" en="Why Now" title="為什麼是現在" />
          <p className="m-0 mb-6 text-base sm:text-lg leading-[1.95] text-slate-300">
            幾年前想做同樣一門生意，要請行銷企劃（月薪 4 萬）、平面設計（4 萬）、網站工程師（6 萬）、客服（3.5 萬），每月人事支出 17.5 萬起。現在換成 Claude Pro（美金 20 元／月）、n8n（自架免費起）、Canva（免費版可用），金流與開課平台成交才抽成。差距沒有消失，只是從錢變成了你投入的時間。
          </p>
          <Figure minWidth={560} label="以前請團隊每月 17.5 萬起，現在訂閱工具每月約兩千元的長條圖對比" caption="每月固定支出對比 · 長度按真實比例 · 薪資以台灣行情粗估">
            <CostBars />
          </Figure>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card title="產出" tag="變化一">文案、圖片、程式，AI 都能做出第一版。你的工作從「做出來」變成「改到好」。</Card>
            <Card title="通路" tag="變化二">社群、電子報、SEO 都能自己經營，起步不需要廣告預算。</Card>
            <Card title="金流" tag="變化三">開課平台、電商、訂閱收款都是現成服務，接上就能收錢。</Card>
          </div>
          <p className="m-0 mb-6 text-base sm:text-lg leading-[1.95] text-slate-300">
            「一人公司」這個名字出自 Paul Jarvis 的同名書：把「要不要擴編」當成選擇，不是預設。收入可以成長，人數不用跟著成長，缺的人力用 AI、系統、外包補。跟接案的差別在於：接案賣時間，一人公司賣做一次能重複賣的東西。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card title="專業" tag="你已經有">做了幾年的本業、同事常來請教你的事，就是題目的來源。</Card>
            <Card title="時間" tag="你已經有">不用辭職，晚上和週末就能先跑最小版本。</Card>
            <Card title="成本" tag="你已經有">一個月幾千元工具費，就算失敗，損失也有限。</Card>
          </div>
        </section>

        {/* Part 2 */}
        <section className="mb-14 sm:mb-20">
          <PartHeader no="02" en="Daily Ops" title="真實日常：我一個人經營品牌的分工地圖" />
          <p className="m-0 mb-6 text-base sm:text-lg leading-[1.95] text-slate-300">
            我目前的品牌提供 n8n 自動化與 AI 應用開發服務，接案加開課。對外的官網、部落格、電子報、社群全部持續更新，對內有報價、排程、客戶溝通流程。人力是一個人，其餘交給 Claude 和自動化流程。組織圖長這樣：
          </p>
          <Figure minWidth={640} label="一人公司組織圖：你負責定方向與把關品質，下面是內容、行銷、業務、開發四個 AI 部門" caption="你負責定方向和把關品質，執行交給四個部門">
            <OrgChart />
          </Figure>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="內容部" tag="Content">兩條在跑的工作流：行銷文章丟一個主題，n8n 接 Claude 產出草稿和配圖，人只做最後審稿；新聞電子報每天自動抓新聞、篩選、改寫、寄出，全程零人工。</Card>
            <Card title="行銷部" tag="Marketing">把自己寫過的貼文餵給 Claude 建立自訂風格，之後產的文案就有你的語氣。同一篇長文改寫成 Threads、LinkedIn、電子報三種版本；SEO 由 AI 列題目清單，你挑題，AI 寫初稿。</Card>
            <Card title="業務部" tag="Sales">提案和報價都有固定範本，Claude 讀完案件需求套範本產出第一版，我只調數字和細節。接案機器人先自動整理需求重點、回覆初步訊息，我看過再送出。</Card>
            <Card title="開發部" tag="Dev">教師專案管理系統、AICommand 工具排行榜、台股自選股健檢，這三套系統都是用中文描述需求讓 Claude 寫出來的，官網 aiqkangber.com 也是同一套做法。</Card>
          </div>
        </section>

        {/* Part 3 */}
        <section className="mb-14 sm:mb-20">
          <PartHeader no="03" en="AI Teammates" title="AI 同事怎麼帶" />
          <p className="m-0 mb-6 text-base sm:text-lg leading-[1.95] text-slate-300">
            多數人把 AI 當搜尋框用：丟一句「幫我寫一篇文案」，拿到什麼算什麼，改兩次不滿意就放棄。把它當同事帶的做法是給背景、給範例、講清楚標準，產出來回修，越用越接近你要的樣子。抓住這個思維，回去用任何 AI 工具都適用。帶 AI 同事有三個動作：
          </p>
          <Figure minWidth={560} label="帶 AI 同事的三個動作流程圖：交接、給範本、驗收" caption="新同事報到的流程，對 AI 一樣適用">
            <FlowThree />
          </Figure>
        </section>

        {/* Part 4 */}
        <section className="mb-14 sm:mb-20">
          <PartHeader no="04" en="Stuck Points" title="卡點與界線" />
          <p className="m-0 mb-6 text-base sm:text-lg leading-[1.95] text-slate-300">
            一個人創業，多半卡在三件事：時間（下班只剩兩三個小時，雜事吃掉大半）、內容（部落格和社群更新到第三週就斷了）、技術（想要的網站和工具，外包報價下不了手）。三個卡點共用同一組解法：繁瑣的交給自動化，值錢的靠專業。重複的流程交給自動化跑，省下來的人力全部投到只有你能做的事：判斷、報價、面對客戶。
          </p>
          <Figure minWidth={560} label="AI 放大器示意圖：專業是 1 經過 AI 放大變 10，沒有專業是 0 放大後還是 0" caption="AI 人人都有，產出的差距來自你灌進去的專業">
            <Amplifier />
          </Figure>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card title="AI 能接手" tag="界線">重複、量大、有範本可循的事：草稿、改寫、整理資料、程式初版、提案初稿。</Card>
            <Card title="只能你來" tag="界線">定位、決策、報價、見客戶，還有每一個成品的最後一關。</Card>
          </div>
          <div className="rounded-2xl p-5 sm:p-7" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
            <p className="m-0 mb-3 font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, fontSize: '0.78rem', color: '#a78bfa' }}>三件要注意的事</p>
            <ul className="m-0 p-0 pl-5 text-[0.95rem] sm:text-base leading-[2] text-slate-300">
              <li>AI 會一本正經講錯話：對外的內容，發出去之前人要看過。</li>
              <li>平台會變：演算法和 API 價格都可能調整，客戶名單要存在自己手上，電子報名單比追蹤數可靠。</li>
              <li>你是唯一的單點：把流程寫成文件讓 AI 照著做，你才有辦法休假。</li>
            </ul>
          </div>
        </section>

        {/* Part 5 */}
        <section className="mb-14 sm:mb-20">
          <PartHeader no="05" en="First Step" title="第一步：低成本驗證" />
          <Figure minWidth={560} label="第一個月的時間軸：第一週填定位表、第二到三週發三篇內容、第四週自動化一件事" caption="第一個月做三件事">
            <MonthTimeline />
          </Figure>
          <div className="rounded-2xl p-5 sm:p-7 mb-6" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
            <p className="m-0 mb-3 font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, fontSize: '0.78rem', color: '#a78bfa' }}>一頁定位表 · 照這個格式填</p>
            <ul className="m-0 p-0 pl-5 text-[0.95rem] sm:text-base leading-[2] text-slate-300">
              <li>一句話定位：我幫（誰）用（什麼方法）解決（什麼問題）</li>
              <li>目標客群：具體到叫得出場景的一種人</li>
              <li>第一個產品：兩週內做得出來的最小版本</li>
              <li>收費方式：一次性、訂閱、抽成，先選一種</li>
            </ul>
          </div>
          <p className="m-0 text-base sm:text-lg leading-[1.95] text-slate-300">
            起步工具先把三個用熟再考慮加東西：Claude Pro 負責寫文案、寫程式、當顧問（美金 20 元／月）；n8n 跑自動化流程（自架免費起）；Canva 做圖片與簡報（免費版可用）。其他工具等有明確需求再訂閱。
          </p>
        </section>

        {/* 結尾 CTA */}
        <div className="mt-14 sm:mt-20 rounded-2xl p-6 sm:p-8 text-center" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
          <p className="m-0 mb-5 text-slate-300 leading-relaxed text-base sm:text-lg">
            想把講座裡的分工地圖搬到自己的品牌上，或想看更多 AI × 自動化的實作記錄，都在這裡。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Link href="/activities" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
              回活動分享
            </Link>
            <Link href="/services" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              看我的自動化服務
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
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
