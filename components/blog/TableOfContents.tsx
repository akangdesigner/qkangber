import type { TocItem } from '@/lib/html-toc'

// 文章目錄：從內文 h2/h3 自動產生（文章 HTML 不再手寫目錄區塊）。
// 層級：H2 大字＋琥珀編號，H3 縮排小字掛在左側引導線下；h2 少於 2 個的短文不顯示。
type TocGroup = { h2: TocItem; children: TocItem[] }

function groupToc(toc: TocItem[]): TocGroup[] {
  const groups: TocGroup[] = []
  for (const item of toc) {
    if (item.level === 2) groups.push({ h2: item, children: [] })
    else if (groups.length > 0) groups[groups.length - 1].children.push(item)
  }
  return groups
}

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  const groups = groupToc(toc)
  if (groups.length < 2) return null
  return (
    <nav className="mb-12 rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden backdrop-blur-sm">
      <details open className="group">
        <summary className="flex items-center justify-between gap-3 cursor-pointer select-none list-none px-6 py-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2.5 text-base font-semibold text-white">
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M5 3.5h9M5 8h9M5 12.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="2" cy="3.5" r="1.1" fill="currentColor" />
              <circle cx="2" cy="8" r="1.1" fill="currentColor" />
              <circle cx="2" cy="12.5" r="1.1" fill="currentColor" />
            </svg>
            文章目錄
          </span>
          <svg
            className="w-4 h-4 text-slate-500 transition-transform duration-200 group-open:rotate-180"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>

        <ol className="px-6 py-5 flex flex-col gap-5">
          {groups.map((g, i) => (
            <li key={g.h2.id}>
              <a
                href={`#${g.h2.id}`}
                className="group/h2 flex items-baseline gap-3 text-[15px] sm:text-base font-semibold text-slate-100 hover:text-amber-300 transition-colors leading-snug"
              >
                <span className="text-[11px] font-bold text-amber-400 tabular-nums tracking-wider flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{g.h2.text}</span>
              </a>
              {g.children.length > 0 && (
                <ul className="mt-3 ml-[5px] pl-6 border-l border-white/[0.1] flex flex-col gap-2">
                  {g.children.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        className="block text-[13px] sm:text-sm text-slate-400 hover:text-amber-300 transition-colors leading-snug"
                      >
                        {c.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </details>
    </nav>
  )
}
