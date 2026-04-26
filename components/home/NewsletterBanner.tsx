import SubscribeForm from '@/components/shared/SubscribeForm'

export default function NewsletterBanner() {
  return (
    <section
      className="relative overflow-hidden border-y border-[#e7e5e4]"
      style={{ backgroundColor: '#fff7ed' }}
    >
      {/* Giant ghost "500+" — decorative editorial element */}
      <span
        aria-hidden="true"
        className="absolute right-4 top-1/2 -translate-y-1/2 font-serif font-bold text-[#ea580c] leading-none select-none pointer-events-none"
        style={{ fontSize: 'clamp(72px, 16vw, 196px)', opacity: 0.065 }}
      >
        500+
      </span>

      <div className="relative max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-center gap-10">

        {/* Text column */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-6 bg-[#ea580c] flex-shrink-0" />
            <span className="text-[0.65rem] tracking-[0.25em] uppercase text-[#ea580c] font-semibold">
              每週電子報
            </span>
          </div>

          <h2 className="font-serif text-[1.85rem] font-semibold text-[#1c1917] leading-[1.2] mb-4">
            不讓 AI 替你思考，
            <br />
            <em style={{ fontStyle: 'italic' }}>但讓它幫你省時間</em>
          </h2>

          <p className="text-sm text-[#44403c] leading-relaxed">
            每週精選：AI 動態 · N8N 實戰案例 · 一個值得思考的觀點。
          </p>
          <p className="text-sm text-[#78716c] mt-1">目前 500+ 讀者，持續更新中。</p>
        </div>

        {/* Form column */}
        <div className="w-full md:w-[360px] flex-shrink-0">
          <SubscribeForm />
          <p className="text-[11px] text-[#78716c] mt-3 tracking-wide">
            免費 · 不賣資料 · 隨時退訂
          </p>
        </div>

      </div>
    </section>
  )
}
