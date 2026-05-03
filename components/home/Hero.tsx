import Link from 'next/link'
import ParticleGlobe from './ParticleGlobe'

function EyebrowLabel({ children, ruleWidth = 28 }: { children: React.ReactNode; ruleWidth?: number }) {
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

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* deep space spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 80% 40%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(168,85,247,0.10), transparent 60%)',
        }}
      />
      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        {/* left — copy */}
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7">
            <EyebrowLabel ruleWidth={32}>AI Workflow Engineering</EyebrowLabel>
          </div>

          <h1 className="text-[2.6rem] sm:text-[3.4rem] lg:text-[3.75rem] font-semibold leading-[1.05] tracking-[-0.025em] text-white mb-7">
            把 AI 接進你的<br />
            <span className="relative">
              工作流程
              <span
                className="absolute -bottom-2 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6 30%, #60a5fa 70%, transparent)' }}
              />
            </span>
            <span
              className="block mt-2"
              style={{
                background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              讓自動化真正發生。
            </span>
          </h1>

          <p className="text-[1.05rem] text-slate-400 leading-[1.85] max-w-lg mb-10">
            專注於 N8N 工作流、AI Agent、RAG 資料庫與提示詞架構。
            把 LLM 從 demo 帶進你日常營運的 production 流程裡。
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/newsletter"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-100"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
                boxShadow: '0 0 32px rgba(99,102,241,0.4)',
              }}
            >
              免費訂閱電子報
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-slate-200 text-sm font-medium border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/25 transition-all backdrop-blur-sm"
            >
              查看實戰案例
            </Link>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Live · 每週更新</span>
            </div>
            <span className="opacity-60">N8N · Claude · RAG · Vector DB</span>
          </div>
        </div>

        {/* right — particle globe */}
        <div className="relative h-[260px] sm:h-[380px] lg:h-[560px] lg:-mr-20">
          <ParticleGlobe />
        </div>
      </div>
    </section>
  )
}
