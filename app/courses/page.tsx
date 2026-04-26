import { getAllCourses } from '@/lib/mdx'
import CourseCard from '@/components/course/CourseCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '課程與資源',
  description: 'N8N 自動化、AI 工具實戰課程，以及精選學習資源。',
}

export default async function CoursesPage() {
  const courses = await getAllCourses()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-semibold text-[var(--color-text-primary)] mb-3">
          課程與資源
        </h1>
        <p className="text-[var(--color-text-muted)] max-w-xl">
          精選課程和工具，幫助你更有效率地使用 AI 和自動化，同時保留自己的判斷力。
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">課程準備中，敬請期待。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
