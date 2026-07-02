import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '隱私權政策',
  description:
    'Q kangber 網站的隱私權政策：說明電子報訂閱、聯絡表單與流量分析所蒐集的資料範圍、使用方式、第三方服務，以及你隨時可退訂與要求刪除資料的權利。',
  path: '/privacy',
})

const UPDATED = '2026-07-02'

const sections = [
  {
    title: '我們蒐集哪些資料',
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-white">電子報訂閱</strong>：你的 Email 地址。採雙重確認（double opt-in）機制——送出後會先收到確認信，點擊確認才會正式加入名單。
        </li>
        <li>
          <strong className="text-white">聯絡表單</strong>：你主動填寫的稱呼、品牌或公司名稱、Email、網址與需求描述，僅用於回覆你的諮詢。
        </li>
        <li>
          <strong className="text-white">流量分析</strong>：本站使用 Google Analytics 蒐集匿名的瀏覽行為資料（如造訪頁面、停留時間、裝置類型），用於改善網站內容，無法識別個人身分。
        </li>
      </ul>
    ),
  },
  {
    title: '資料如何使用',
    body: (
      <p>
        電子報 Email 只用於寄送每週電子報與訂閱相關通知（如確認信、歡迎信）；聯絡表單資料只用於回覆你的需求與後續服務溝通。我們不會將你的資料出售、出租或提供給第三方作行銷用途。
      </p>
    ),
  },
  {
    title: '第三方服務',
    body: (
      <p>
        本站由 Zeabur 提供主機服務，訂閱與表單資料儲存於 Google 提供的雲端服務，流量分析使用 Google
        Analytics。這些服務商僅在提供其服務的必要範圍內處理資料，各自受其隱私權政策規範。
      </p>
    ),
  },
  {
    title: 'Cookie',
    body: (
      <p>
        本站使用 Cookie 於 Google Analytics 流量統計。你可以透過瀏覽器設定停用 Cookie，不影響閱讀本站內容。
      </p>
    ),
  },
  {
    title: '退訂與資料刪除',
    body: (
      <p>
        每封電子報底部都有退訂連結，點擊即可立即停止寄送。若你希望刪除訂閱紀錄或聯絡表單資料，來信{' '}
        <a href="mailto:asdtodd42@gmail.com" className="text-violet-300 underline underline-offset-2 hover:text-violet-200">
          asdtodd42@gmail.com
        </a>{' '}
        告知，我們會在合理時間內處理完成。
      </p>
    ),
  },
  {
    title: '政策更新',
    body: (
      <p>
        本政策若有修訂會直接更新於本頁，重大變更會在電子報中另行說明。繼續使用本站即表示你同意最新版本的政策內容。
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-3">
        隱私權政策
      </h1>
      <p className="text-sm text-slate-500 mb-10">最後更新：{UPDATED}</p>

      <p className="text-slate-300 leading-relaxed mb-10">
        Q kangber（aiqkangber.com）重視你的隱私。這份政策說明本站在你訂閱電子報、填寫聯絡表單或瀏覽內容時，會蒐集哪些資料、如何使用，以及你擁有的權利。
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
        <Link href="/terms" className="text-violet-300 underline underline-offset-2 hover:text-violet-200 ml-1">
          服務條款
        </Link>
        <span className="mx-1">·</span>
        <Link href="/contact" className="text-violet-300 underline underline-offset-2 hover:text-violet-200">
          聯絡我
        </Link>
      </p>
    </div>
  )
}
