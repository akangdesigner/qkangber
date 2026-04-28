import type { Course } from '@/types/content'

const platformAccent: Record<string, { from: string; to: string }> = {
  Teachable: { from: '#22d3ee', to: '#3b82f6' },
  Gumroad:   { from: '#f472b6', to: '#a855f7' },
  YouTube:   { from: '#f87171', to: '#ec4899' },
  Notion:    { from: '#94a3b8', to: '#cbd5e1' },
}

export default function CourseCard({ course }: { course: Course }) {
  const accent = platformAccent[course.platform] ?? { from: '#a78bfa', to: '#60a5fa' }

  return (
    <div className="group relative">
      <div
        className="absolute -inset-px rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`, filter: 'blur(0.5px)' }}
      />
      <div className="relative bg-[#0a0b14] rounded-2xl p-7 flex flex-col h-full">
        <div className="flex items-start justify-between gap-4 mb-5">
          <span
            className="text-[11px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${accent.from}22, ${accent.to}22)`,
              color: accent.from,
              border: `1px solid ${accent.from}33`,
            }}
          >
            {course.platform}
          </span>
          <span className="text-base font-semibold text-white">{course.price}</span>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 leading-snug tracking-[-0.01em]">
          {course.title}
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-7">
          {course.description}
        </p>

        <a
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
            boxShadow: `0 0 24px ${accent.from}44`,
          }}
        >
          了解更多 →
        </a>
      </div>
    </div>
  )
}
