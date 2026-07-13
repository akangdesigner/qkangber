// 活動分享的膠囊標籤：accent = 紫色主標（講師身分／活動主類型）、muted = 灰色次標（時長、細節）
export default function StatusTag({ children, tone = 'accent' }: { children: React.ReactNode; tone?: 'accent' | 'muted' }) {
  const accent = tone === 'accent'
  return (
    <span
      className="inline-flex items-center rounded-full text-[0.58rem] font-semibold tracking-[0.16em] uppercase"
      style={{
        padding: '2px 8px',
        color: accent ? '#c4b5fd' : '#94a3b8',
        background: accent ? 'rgba(124,92,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: accent ? '1px solid rgba(124,92,255,0.28)' : '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {children}
    </span>
  )
}
