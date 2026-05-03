import SubscribeForm from '@/components/shared/SubscribeForm'

function EyebrowLabel({ children, ruleWidth = 24 }: { children: React.ReactNode; ruleWidth?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-px flex-shrink-0"
        style={{ width: ruleWidth, background: 'linear-gradient(90deg, transparent, #7c5cff)' }}
      />
      <span
        className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
        style={{
          background: 'linear-gradient(90deg,#a78bfa,#60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>
    </div>
  )
}

export default function NewsletterBanner() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 py-24">
      <div
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-6 sm:p-10 lg:p-16"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 100% 0%, rgba(124,92,255,0.18), transparent 60%), radial-gradient(ellipse 60% 60% at 0% 100%, rgba(34,211,238,0.10), transparent 60%), #0a0b14',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute right-6 top-1/2 -translate-y-1/2 font-bold leading-none select-none pointer-events-none"
          style={{
            fontSize: 'clamp(80px, 18vw, 220px)',
            background: 'linear-gradient(180deg, rgba(167,139,250,0.16), rgba(167,139,250,0))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em',
          }}
        >
          N8N
        </span>

        <div className="relative max-w-md">
          <div className="mb-5">
            <EyebrowLabel ruleWidth={24}>Weekly Newsletter</EyebrowLabel>
          </div>
          <h2 className="text-[2rem] font-semibold leading-[1.15] text-white mb-4 tracking-[-0.015em]">
            一週一封，<br />
            <span
              style={{
                background: 'linear-gradient(90deg, #c4b5fd, #67e8f9)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              把 AI 這週發生的事說清楚。
            </span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            每週精選本週最值得關注的 AI 動態——新模型、新工具、產業消息——過濾雜訊，只留值得你花時間的。
          </p>
          <SubscribeForm />
          <p className="text-[11px] text-slate-500 mt-4 tracking-wide">免費 · 不賣資料 · 隨時退訂</p>
        </div>
      </div>
    </section>
  )
}
