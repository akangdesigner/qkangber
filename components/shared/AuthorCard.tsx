import Image from 'next/image'
import Link from 'next/link'

export default function AuthorCard() {
  return (
    <aside
      className="mt-14 rounded-2xl px-6 py-6 flex gap-5 items-start"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden"
        style={{
          width: 56,
          height: 56,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 14px rgba(34,197,94,0.18)',
        }}
      >
        <Image
          src="/logo.png"
          alt="Q kangber"
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-1">作者</p>
        <p className="text-white font-semibold text-sm mb-2">Q kangber</p>
        <p className="text-slate-400 text-sm leading-relaxed mb-3">
          n8n 自動化工程師，專注電商與行銷流程自動化及 AI 應用開發。
          不賣課程，直接幫企業把重複的事情做掉。
        </p>
        <div className="flex gap-4 text-xs">
          <a
            href="https://www.threads.com/@cutekangber"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-violet-400 transition-colors"
          >
            Threads ↗
          </a>
          <a
            href="https://www.instagram.com/cutekangber"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-violet-400 transition-colors"
          >
            Instagram ↗
          </a>
          <Link
            href="/about"
            className="text-slate-500 hover:text-violet-400 transition-colors"
          >
            關於我 →
          </Link>
        </div>
      </div>
    </aside>
  )
}
