import ContactForm from '@/components/contact/ContactForm'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '聯絡 Q kangber — n8n 自動化與 AI 開發需求諮詢',
  description: '有 n8n 工作流、AI Agent 開發或自動化需求？填表告訴我，初次諮詢免費，評估後再報價。',
  alternates: { canonical: 'https://aiqkangber.com/contact' },
}

export default function ContactPage() {
  return (
    <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.15), transparent 60%)' }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
        <Link href="/" className="hover:text-slate-300 transition-colors">首頁</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-slate-300 transition-colors">服務</Link>
        <span>/</span>
        <span className="text-slate-400">聯絡我</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
          <span
            className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
            style={{
              background: 'linear-gradient(90deg,#a78bfa,#60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Contact
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight mb-4 tracking-[-0.02em]">
          說說你的需求
        </h1>
        <p className="text-slate-400 leading-relaxed">
          不管是明確的專案，還是只有模糊的想法，都可以填表。<br />
          我會先評估可行性，再告訴你怎麼做最合適。
        </p>
      </div>

      {/* Form card */}
      <div
        className="rounded-2xl p-7 sm:p-9"
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <ContactForm />
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          比較急？直接寄信到{' '}
          <a href="mailto:asdtodd42@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors">
            asdtodd42@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
