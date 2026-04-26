import Link from 'next/link'
import SubscribeForm from '@/components/shared/SubscribeForm'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle dot grid — gives depth without shouting */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #78716c 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.045,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">

        {/* Category label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px w-8 bg-[#ea580c] flex-shrink-0" />
          <span className="text-[0.68rem] tracking-[0.22em] uppercase text-[#ea580c] font-semibold">
            AI 趨勢 × N8N 自動化
          </span>
        </div>

        {/* Headline — flex with left orange accent bar */}
        <div className="flex items-stretch gap-5 mb-8 max-w-2xl">
          <div className="w-[3px] rounded-full bg-[#ea580c] flex-shrink-0" />
          <h1 className="font-serif text-5xl sm:text-[3.5rem] font-semibold text-[#1c1917] leading-[1.1] tracking-[-0.02em]">
            在人與 AI 之間，
            <br />
            <em style={{ fontStyle: 'italic' }}>找到那個平衡點</em>
          </h1>
        </div>

        {/* Body text */}
        <div className="pl-8 max-w-lg mb-10 space-y-3">
          <p className="text-[1.05rem] text-[#44403c] leading-[1.85]">
            我叫<strong className="text-[#1c1917] font-semibold">你的名字</strong>，研究 AI 工具和自動化幾年了。
            最危險的不是 AI 太強大——而是人開始不願意思考。
          </p>
          <p className="text-[1.05rem] text-[#44403c] leading-[1.85]">
            這裡分享的，是如何讓科技為你服務，而不是讓它替你思考。
          </p>
        </div>

        {/* Subscribe box — flush left with a subtle left rule */}
        <div className="pl-8 border-l border-[#e7e5e4] max-w-sm mb-6">
          <p className="text-xs text-[#78716c] mb-3 tracking-wide">
            每週一封 · 不灌水 · 隨時可退訂
          </p>
          <SubscribeForm />
        </div>

        <div className="pl-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[#78716c] hover:text-[#ea580c] transition-colors duration-150 group"
          >
            <span>先看看文章</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

      </div>
    </section>
  )
}
