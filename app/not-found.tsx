import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '找不到頁面',
}

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
      <p className="font-mono text-sm tracking-[0.3em] text-violet-400 mb-4">404</p>
      <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-4">
        這一頁不存在或已搬家
      </h1>
      <p className="text-slate-400 leading-relaxed mb-10">
        你要找的頁面可能已改網址或下架了。從下面的入口繼續逛，或直接回首頁。
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn--aurora">
          <span className="btn__label">回首頁</span>
          <span className="btn__arrow">→</span>
        </Link>
        <Link href="/blog" className="btn btn--aurora-ghost">
          <span className="btn__label">AI × n8n 知識庫</span>
        </Link>
        <Link href="/services" className="btn btn--aurora-ghost">
          <span className="btn__label">服務項目</span>
        </Link>
      </div>
    </div>
  )
}
