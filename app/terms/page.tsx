import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '服務條款',
  description:
    'Q kangber 網站服務條款：說明 n8n 自動化開發服務的合作方式、網站內容著作權、免費資源的使用範圍與免責聲明。',
  path: '/terms',
})

const UPDATED = '2026-07-02'

const sections = [
  {
    title: '服務性質',
    body: (
      <p>
        本站提供的 n8n 自動化與 AI 應用開發為客製化服務。服務頁所列價格與效益數字為方案起始參考，實際範圍、時程與報價以雙方透過
        <a href="mailto:asdtodd42@gmail.com" className="text-violet-300 underline underline-offset-2 hover:text-violet-200 mx-1">
          Email
        </a>
        或聯絡表單確認的內容為準；合作於雙方確認報價與範圍後成立。
      </p>
    ),
  },
  {
    title: '網站內容與著作權',
    body: (
      <p>
        本站的文章、圖表、截圖與示意圖除另有標示外，著作權皆屬 Q kangber
        所有。歡迎在註明出處並附上原文連結的前提下部分引用；未經同意請勿全文轉載或用於商業用途。
      </p>
    ),
  },
  {
    title: '免費資源',
    body: (
      <p>
        本站提供的免費 n8n 工作流範本與教學內容依「現狀」提供，你可以自由下載、修改並用於自己的專案。由於每個環境的設定、憑證與資料結構不同，實際導入前請先在測試環境驗證；因使用範本或教學內容造成的直接或間接損失，本站不負賠償責任。
      </p>
    ),
  },
  {
    title: '外部連結',
    body: (
      <p>
        本站文章可能包含指向第三方網站或服務的連結，這些網站的內容與隱私做法由其自行負責，不代表本站立場或擔保。
      </p>
    ),
  },
  {
    title: '條款修改與準據法',
    body: (
      <p>
        本站保留隨時修改本條款的權利，修訂後會直接更新於本頁。本條款以中華民國法律為準據法；若有爭議，雙方同意先以誠信協商解決。
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-3">
        服務條款
      </h1>
      <p className="text-sm text-slate-500 mb-10">最後更新：{UPDATED}</p>

      <p className="text-slate-300 leading-relaxed mb-10">
        歡迎使用 Q kangber（aiqkangber.com）。瀏覽本站內容、下載免費資源或洽詢自動化服務，即表示你同意以下條款。
      </p>

      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">{s.title}</h2>
            <div className="text-slate-400 text-[15px] leading-relaxed">{s.body}</div>
          </section>
        ))}
      </div>

      <p className="text-slate-500 text-sm mt-12">
        相關頁面：
        <Link href="/privacy" className="text-violet-300 underline underline-offset-2 hover:text-violet-200 ml-1">
          隱私權政策
        </Link>
        <span className="mx-1">·</span>
        <Link href="/services" className="text-violet-300 underline underline-offset-2 hover:text-violet-200">
          服務項目
        </Link>
      </p>
    </div>
  )
}
