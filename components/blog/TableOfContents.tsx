import type { TocItem } from '@/lib/html-toc'

// 文章目錄：從內文 h2/h3 自動產生（文章 HTML 不再手寫目錄區塊）。
// h2 少於 2 個的短文不顯示，避免目錄比內文還搶戲。
export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  if (toc.filter((t) => t.level === 2).length < 2) return null
  return (
    <nav className="mb-10 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">
      <details open>
        <summary className="cursor-pointer list-none text-[10px] tracking-[0.24em] uppercase font-semibold text-violet-400 select-none">
          文章目錄
        </summary>
        <ul className="mt-3 flex flex-col gap-1.5">
          {toc.map((item) => (
            <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
              <a
                href={`#${item.id}`}
                className={
                  item.level === 2
                    ? 'text-sm font-medium text-slate-200 hover:text-orange-300 transition-colors'
                    : 'text-[13px] text-slate-400 hover:text-orange-300 transition-colors'
                }
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  )
}
