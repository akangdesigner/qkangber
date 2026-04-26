import SubscribeForm from '@/components/shared/SubscribeForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '訂閱電子報',
  description: '每週一封，精選 AI 趨勢和 N8N 自動化技巧，加上我自己的觀點。不灌水，不廢話。',
}

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <p className="text-sm font-medium text-[var(--color-accent)] mb-4 uppercase tracking-wide">
        每週電子報
      </p>
      <h1 className="font-serif text-4xl font-semibold text-[var(--color-text-primary)] mb-5">
        不讓 AI 替你思考，但讓它幫你省時間
      </h1>
      <p className="text-[var(--color-text-body)] leading-relaxed mb-2">
        每週精選：本週最值得關注的 AI 新工具、N8N 自動化實際案例，以及一個值得思考的觀點。
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mb-10">
        目前 500+ 位讀者訂閱 · 隨時可取消 · 不會賣你資料
      </p>

      <SubscribeForm className="max-w-md mx-auto" />
    </div>
  )
}
