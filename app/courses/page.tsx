import { getAllCourses } from '@/lib/mdx'
import CourseCard from '@/components/course/CourseCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'n8n 與 AI 工具課程 — Q康寶',
  description: 'n8n 自動化實戰、Claude AI 工具應用課程。職崖平台合作課程，企業培訓也接。',
}

export default async function CoursesPage() {
  const courses = await getAllCourses()

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-7 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
          <span className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold" style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Learn with me
          </span>
        </div>
        <h1 className="text-5xl font-semibold text-white mb-4 tracking-[-0.02em]">課程與資源</h1>
        <p className="text-slate-400 max-w-xl leading-relaxed">
          給想把 AI 與自動化真正接進工作流程的人。N8N、AI Agent、RAG、Claude Code，全都實戰過才寫出來。
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="text-slate-500">課程準備中，敬請期待。</p>
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
