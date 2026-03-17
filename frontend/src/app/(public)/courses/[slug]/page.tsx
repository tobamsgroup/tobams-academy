import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CourseOutline } from '@/components/courses/CourseOutline'
import type { CourseDetail } from '@/types/course'
import type { Metadata } from 'next'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

async function fetchCourse(slug: string): Promise<CourseDetail | null> {
  try {
    const res = await fetch(`${API}/courses/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.data
  } catch {
    return null
  }
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await fetchCourse(params.slug)
  if (!course) return { title: 'Course Not Found' }
  return {
    title: `${course.title} — Tobams Academy`,
    description: course.description,
  }
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

export default async function CourseDetailPage({ params }: Props) {
  const course = await fetchCourse(params.slug)
  if (!course) notFound()

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const totalMinutes = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((la, l) => la + (l.duration ?? 0), 0),
    0,
  )

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-slate-400">
        <Link href="/courses" className="hover:text-[#571244]">Courses</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-600">{course.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left — main content */}
        <div className="lg:col-span-2">
          <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#571244] to-[#EF4353] p-8 text-white">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
              {course.category.name}
            </p>
            <h1 className="text-2xl font-bold leading-snug md:text-3xl">{course.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{course.description}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/70">
              <span>🎓 {LEVEL_LABELS[course.level]}</span>
              <span>📦 {course.modules.length} modules</span>
              <span>📹 {totalLessons} lessons</span>
              {totalMinutes > 0 && <span>⏱ {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>}
            </div>
          </div>

          <h2 className="mb-3 text-lg font-bold text-slate-900">Course Outline</h2>
          <CourseOutline modules={course.modules} />
        </div>

        {/* Right — enroll card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-[#571244]/5">
            <p className="text-2xl font-bold text-slate-900">
              {course.price ? `$${course.price}` : 'Free'}
            </p>
            <Link
              href="/register"
              className="mt-4 block w-full rounded-xl bg-[#571244] py-3 text-center text-sm font-bold text-white transition-all hover:bg-[#571244]/90"
            >
              Enrol Now
            </Link>
            <p className="mt-3 text-center text-xs text-slate-400">
              Full lifetime access · Certificate on completion
            </p>
            <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <p className="font-semibold">Instructor</p>
              <p className="mt-1 text-slate-500">{course.instructor.name}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
