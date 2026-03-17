import Link from 'next/link'
import { CourseCard } from '@/components/courses/CourseCard'
import type { Course } from '@/types/course'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

async function fetchFeaturedCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API}/courses/featured`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch {
    return []
  }
}

export async function CoursesSection() {
  const courses = await fetchFeaturedCourses()

  return (
    <section className="bg-slate-50 px-5 py-10 md:px-12 md:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Featured Courses</h2>
        <Link href="/courses" className="text-sm font-semibold text-[#EF4353] hover:underline">
          See all →
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-sm text-slate-400">Courses coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}
