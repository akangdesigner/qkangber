import Link from 'next/link'
import SubscribeForm from '@/components/shared/SubscribeForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 自動化週報 — 免費訂閱 | q康寶',
  description: '每週精選 AI 與 n8n 自動化動態，過濾雜訊，只給值得花時間的資訊。免費訂閱，隨時退訂。',
}

export default function NewsletterPage() {
  return (
    <div className="relative max-w-2xl mx-auto px-6 py-24 text-center">
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(124,92,255,0.18), transparent 60%)' }}
      />
      <div className="mb-6 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
          <span className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold" style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Weekly Newsletter
          </span>
        </div>
      </div>
      <h1 className="text-5xl font-semibold text-white mb-6 tracking-[-0.02em] leading-[1.1]">
        本週 AI 發生了什麼，<br />
        <span style={{ background: 'linear-gradient(90deg, #c4b5fd, #67e8f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          我幫你看完了。
        </span>
      </h1>
      <p className="text-slate-300 leading-relaxed mb-2 max-w-md mx-auto">
        每週精選 AI 業界動態——新模型發布、工具更新、值得思考的觀點——過濾雜訊，只留最值得你花時間的那幾則。
      </p>
      <p className="text-sm text-slate-500 mb-10">免費 · 不賣資料 · 隨時退訂</p>
      <SubscribeForm className="max-w-md mx-auto" />
      <p className="mt-8 text-xs text-slate-600">
        想先看看內容？
        <Link href="/newsletter/archive" className="text-slate-500 hover:text-violet-400 ml-1 transition-colors">
          瀏覽歷期電子報 →
        </Link>
      </p>
    </div>
  )
}
