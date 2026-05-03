import { getAllServices } from '@/lib/mdx'
import ServiceCard from '@/components/services/ServiceCard'
import ServiceFlow from '@/components/services/ServiceFlow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'n8n 自動化服務項目 — Q康寶',
  description: '電商訂單、行銷漏斗、社群排程、數據報表——n8n 自動化服務，幫你把重複性流程一次清掉。',
}

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
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

export default async function ServicesPage() {
  const services = await getAllServices()
  const categories = [...new Set(services.map((s) => s.category))]

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,92,255,0.15), transparent 70%)' }}
      />

      <div className="mb-14">
        <div className="mb-5">
          <EyebrowLabel>Services</EyebrowLabel>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight mb-5 tracking-[-0.02em]">
          讓 N8N 處理<br />
          <span
            style={{
              background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            你不該浪費時間的事
          </span>
        </h1>
        <p className="text-[1.05rem] text-slate-400 max-w-xl leading-relaxed">
          專注在電商與行銷流程自動化。每個服務都是從實際踩坑中設計出來的，不賣課程，直接幫你做好。
        </p>
      </div>

      {/* interactive node graph */}
      <div
        className="rounded-2xl border border-white/[0.08] p-4 sm:p-6 mb-14 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            workflow.json · live
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
        </div>
        <ServiceFlow services={services} />
      </div>

      {categories.map((cat) => {
        const catServices = services.filter((s) => s.category === cat)
        return (
          <div key={cat} className="mb-14">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
              <span>{cat}</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {catServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
        )
      })}

      <div
        className="relative rounded-2xl border border-white/[0.08] p-8 text-center mt-4 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(124,92,255,0.10), transparent 60%), #0a0b14',
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,92,255,0.4), transparent)' }}
        />
        <p className="text-slate-400 mb-2 text-sm">有客製化需求？</p>
        <p className="text-xl font-semibold text-white mb-5 tracking-[-0.01em]">
          說說你的流程，我來評估能否自動化
        </p>
        <a
          href="mailto:asdtodd42@gmail.com"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-100"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
            boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          }}
        >
          免費諮詢 →
        </a>
      </div>
    </div>
  )
}
