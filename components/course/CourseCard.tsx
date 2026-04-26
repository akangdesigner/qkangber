import type { Course } from '@/types/content'

const platformColors: Record<string, string> = {
  Teachable: 'bg-green-50 text-green-700',
  Gumroad: 'bg-pink-50 text-pink-700',
  YouTube: 'bg-red-50 text-red-700',
  Notion: 'bg-gray-100 text-gray-700',
}

export default function CourseCard({ course }: { course: Course }) {
  const badgeClass = platformColors[course.platform] ?? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}>
          {course.platform}
        </span>
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {course.price}
        </span>
      </div>

      <h3 className="font-serif text-xl font-semibold text-[var(--color-text-primary)] mb-3 leading-snug">
        {course.title}
      </h3>

      <p className="text-sm text-[var(--color-text-body)] leading-relaxed flex-1 mb-6">
        {course.description}
      </p>

      <a
        href={course.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg transition-colors"
      >
        了解更多 →
      </a>
    </div>
  )
}
