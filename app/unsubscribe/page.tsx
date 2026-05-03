'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleUnsubscribe() {
    setStatus('loading')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('done')
      } else {
        const json = await res.json()
        setErrorMsg(json.error ?? '操作失敗，請稍後再試')
        setStatus('error')
      }
    } catch {
      setErrorMsg('網路錯誤，請稍後再試')
      setStatus('error')
    }
  }

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-slate-400 mb-6">連結無效，請確認信件中的取消訂閱連結是否完整。</p>
        <Link href="/" className="text-violet-400 hover:text-violet-300 transition-colors text-sm">
          回首頁
        </Link>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}
        >
          <span className="text-green-400 text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">已成功取消訂閱</h2>
        <p className="text-slate-400 text-sm mb-8">
          <span className="text-slate-300">{email}</span> 已從電子報名單中移除。
        </p>
        <Link href="/" className="text-violet-400 hover:text-violet-300 transition-colors text-sm">
          回首頁
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-white mb-3">確認取消訂閱</h2>
      <p className="text-slate-400 text-sm mb-2">以下 Email 將從電子報名單中移除：</p>
      <p className="text-white font-medium mb-8">{email}</p>

      {status === 'error' && (
        <p className="text-red-400 text-sm mb-6">{errorMsg}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleUnsubscribe}
          disabled={status === 'loading'}
          className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all disabled:opacity-50"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
        >
          {status === 'loading' ? '處理中…' : '確認取消訂閱'}
        </button>
        <Link
          href="/newsletter"
          className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          不了，我要繼續訂閱
        </Link>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div
        className="w-full max-w-md rounded-2xl px-8 py-10"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="mb-8 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-slate-500 mb-2">Newsletter</p>
          <p className="text-slate-500 text-sm">Q kangber 電子報</p>
        </div>
        <Suspense fallback={<p className="text-center text-slate-500 text-sm">載入中…</p>}>
          <UnsubscribeContent />
        </Suspense>
      </div>
    </div>
  )
}
