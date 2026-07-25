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

// 版面小元件：段落 eyebrow ＋ 標題
function PartHeader({ no, en, title }: { no: string; en: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="m-0 mb-2 font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: MONO, fontSize: '0.72rem', color: '#a78bfa' }}>
        Part {no} · {en}
      </p>
      <h2 className="m-0 text-xl sm:text-3xl font-semibold text-white tracking-[-0.015em] leading-snug">{title}</h2>
    </div>
  )
}

function Card({ title, tag, children }: { title: string; tag?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-baseline gap-2.5 mb-2">
        <h3 className="m-0 text-base font-semibold text-slate-100">{title}</h3>
        {tag && <span style={{ fontFamily: MONO, fontSize: '0.68rem', letterSpacing: '0.08em', color: '#7c5cff' }}>{tag}</span>}
      </div>
      <p className="m-0 text-sm leading-[1.85] text-slate-400">{children}</p>
    </div>
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
          <p className="text-slate-400 leading-relaxed max-w-[58ch] text-base sm:text-[1.0625rem]">
            在 XLab「獨立 AI 創業團隊專場」講了 60 分鐘：如何利用 AI 分工，打造你的創業團隊。這頁把五個段落的簡報內容整理成文字版，沒到現場的人也能照著看完一遍。
          </p>
        </header>

        {/* 主視覺 */}
        <div className="mb-12 sm:mb-16 overflow-hidden rounded-2xl border border-white/[0.08]" style={{ aspectRatio: '16/9', background: 'rgba(255,255,255,0.02)' }}>
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
        <section className="mb-12 sm:mb-16">
          <PartHeader no="01" en="Why Now" title="為什麼是現在" />
          <p className="m-0 mb-6 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">
            幾年前想做同樣一門生意，要請行銷企劃（月薪 4 萬）、平面設計（4 萬）、網站工程師（6 萬）、客服（3.5 萬），每月人事支出 17.5 萬起。現在換成 Claude Pro（美金 20 元／月）、n8n（自架免費起）、Canva（免費版可用），金流與開課平台成交才抽成，每月固定支出一兩千元加上你的時間。差距沒有消失，只是從錢變成了你投入的時間。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card title="產出" tag="變化一">文案、圖片、程式，AI 都能做出第一版。你的工作從「做出來」變成「改到好」。</Card>
            <Card title="通路" tag="變化二">社群、電子報、SEO 都能自己經營，起步不需要廣告預算。</Card>
            <Card title="金流" tag="變化三">開課平台、電商、訂閱收款都是現成服務，接上就能收錢。</Card>
          </div>
          <p className="m-0 mb-6 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">
            「一人公司」這個名字出自 Paul Jarvis 的同名書：把「要不要擴編」當成選擇，不是預設。收入可以成長，人數不用跟著成長，缺的人力用 AI、系統、外包補。跟接案的差別在於：接案賣時間，一人公司賣做一次能重複賣的東西。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card title="專業" tag="你已經有">做了幾年的本業、同事常來請教你的事，就是題目的來源。</Card>
            <Card title="時間" tag="你已經有">不用辭職，晚上和週末就能先跑最小版本。</Card>
            <Card title="成本" tag="你已經有">一個月幾千元工具費，就算失敗，損失也有限。</Card>
          </div>
        </section>

        {/* Part 2 */}
        <section className="mb-12 sm:mb-16">
          <PartHeader no="02" en="Daily Ops" title="真實日常：我一個人經營品牌的分工地圖" />
          <p className="m-0 mb-6 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">
            我目前的品牌提供 n8n 自動化與 AI 應用開發服務，接案加開課。對外的官網、部落格、電子報、社群全部持續更新，對內有報價、排程、客戶溝通流程。人力是一個人，其餘交給 Claude 和自動化流程。組織圖長這樣：你負責定方向和把關品質，執行交給四個部門。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="內容部" tag="Content">兩條在跑的工作流：行銷文章丟一個主題，n8n 接 Claude 產出草稿和配圖，人只做最後審稿；新聞電子報每天自動抓新聞、篩選、改寫、寄出，全程零人工。</Card>
            <Card title="行銷部" tag="Marketing">把自己寫過的貼文餵給 Claude 建立自訂風格，之後產的文案就有你的語氣。同一篇長文改寫成 Threads、LinkedIn、電子報三種版本；SEO 由 AI 列題目清單，你挑題，AI 寫初稿。</Card>
            <Card title="業務部" tag="Sales">提案和報價都有固定範本，Claude 讀完案件需求套範本產出第一版，我只調數字和細節。接案機器人先自動整理需求重點、回覆初步訊息，我看過再送出。談過的需求存成文件，下一次提案 AI 直接參考，越接越快。</Card>
            <Card title="開發部" tag="Dev">教師專案管理系統、AICommand 工具排行榜、台股自選股健檢，這三套系統都是用中文描述需求讓 Claude 寫出來的，官網 aiqkangber.com 也是同一套做法。從自己要用的小工具開始練，再做對外的產品。</Card>
          </div>
        </section>

        {/* Part 3 */}
        <section className="mb-12 sm:mb-16">
          <PartHeader no="03" en="AI Teammates" title="AI 同事怎麼帶" />
          <p className="m-0 mb-6 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">
            多數人把 AI 當搜尋框用：丟一句「幫我寫一篇文案」，拿到什麼算什麼，改兩次不滿意就放棄。把它當同事帶的做法是給背景、給範例、講清楚標準，產出來回修，越用越接近你要的樣子。抓住這個思維，回去用任何 AI 工具都適用。帶 AI 同事有三個動作：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card title="交接" tag="動作一">把產品資料、常用說法、過去作品整理成文件給它。新同事報到要交接，AI 也一樣。</Card>
            <Card title="給範本" tag="動作二">拿一份你滿意的成品當標準。給例子，比說「寫好一點」有用。</Card>
            <Card title="驗收" tag="動作三">它交的是初稿。發出去之前，最後一關是你。</Card>
          </div>
        </section>

        {/* Part 4 */}
        <section className="mb-12 sm:mb-16">
          <PartHeader no="04" en="Stuck Points" title="卡點與界線" />
          <p className="m-0 mb-6 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">
            一個人創業，多半卡在三件事：時間（下班只剩兩三個小時，雜事吃掉大半）、內容（部落格和社群更新到第三週就斷了）、技術（想要的網站和工具，外包報價下不了手）。三個卡點共用同一組解法：繁瑣的交給自動化，值錢的靠專業。重複的流程交給自動化跑，省下來的人力全部投到只有你能做的事：判斷、報價、面對客戶。AI 人人都有，產出的差距來自你灌進去的專業；它負責放大十倍，你的專業是被放大的那個一。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card title="AI 能接手" tag="界線">重複、量大、有範本可循的事：草稿、改寫、整理資料、程式初版、提案初稿。</Card>
            <Card title="只能你來" tag="界線">定位、決策、報價、見客戶，還有每一個成品的最後一關。</Card>
          </div>
          <div className="rounded-2xl p-5 sm:p-6" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
            <p className="m-0 mb-3 font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, fontSize: '0.72rem', color: '#a78bfa' }}>三件要注意的事</p>
            <ul className="m-0 p-0 pl-5 text-sm leading-[2] text-slate-300">
              <li>AI 會一本正經講錯話：對外的內容，發出去之前人要看過。</li>
              <li>平台會變：演算法和 API 價格都可能調整，客戶名單要存在自己手上，電子報名單比追蹤數可靠。</li>
              <li>你是唯一的單點：把流程寫成文件讓 AI 照著做，你才有辦法休假。</li>
            </ul>
          </div>
        </section>

        {/* Part 5 */}
        <section className="mb-12 sm:mb-16">
          <PartHeader no="05" en="First Step" title="第一步：低成本驗證" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card title="填完一頁定位表" tag="第 1 週">一句話定位、客群、第一個產品、收費方式，四格填完再花錢。</Card>
            <Card title="發出三篇內容" tag="第 2–3 週">用 AI 產草稿、自己改到有你的語氣，發出去看反應。</Card>
            <Card title="自動化一件事" tag="第 4 週">挑一件每週重複的工作，交給 AI 或 n8n 自動化。</Card>
          </div>
          <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
            <p className="m-0 mb-3 font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: MONO, fontSize: '0.72rem', color: '#a78bfa' }}>一頁定位表 · 照這個格式填</p>
            <ul className="m-0 p-0 pl-5 text-sm leading-[2] text-slate-300">
              <li>一句話定位：我幫（誰）用（什麼方法）解決（什麼問題）</li>
              <li>目標客群：具體到叫得出場景的一種人</li>
              <li>第一個產品：兩週內做得出來的最小版本</li>
              <li>收費方式：一次性、訂閱、抽成，先選一種</li>
            </ul>
          </div>
          <p className="m-0 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">
            起步工具先把三個用熟再考慮加東西：Claude Pro 負責寫文案、寫程式、當顧問（美金 20 元／月）；n8n 跑自動化流程（自架免費起）；Canva 做圖片與簡報（免費版可用）。其他工具等有明確需求再訂閱。
          </p>
        </section>

        {/* 結尾 CTA */}
        <div className="mt-14 sm:mt-20 rounded-2xl p-6 sm:p-8 text-center" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
          <p className="m-0 mb-5 text-slate-300 leading-relaxed text-[0.95rem] sm:text-base">
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
