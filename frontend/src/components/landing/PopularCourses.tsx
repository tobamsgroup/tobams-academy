import Link from 'next/link'
import type { Course } from '@/types/course'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

const CATEGORY_PILLS = [
  'IT Service',
  'Entrepreneurship',
  'Sustainability',
  'Career',
  'Leadership',
]

async function fetchFeaturedCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API}/courses/featured`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = (await res.json()) as { data?: Course[] }
    return json.data ?? []
  } catch {
    return []
  }
}

function FeaturedCourseCard({ course }: { course: Course }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 bg-slate-200">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-slate-400">[Image Placeholder]</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs font-semibold text-[#571244]">Tobams Group Academy</p>
        <div className="mb-2 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="text-xs text-yellow-400">★</span>
          ))}
        </div>
        <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900">{course.title}</h3>
        <p className="mb-3 line-clamp-2 text-xs text-slate-500">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">
            {course.price ? `£${course.price}` : 'Free'}
          </span>
          <button
            type="button"
            className="rounded-lg bg-[#1a1a5e] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export async function PopularCourses() {
  const courses = await fetchFeaturedCourses()

  return (
    <section className="bg-slate-50 px-5 py-12 md:px-12 md:py-16">
      {/* Category pills */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {CATEGORY_PILLS.map((pill) => (
          <button
            key={pill}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors hover:border-[#571244] hover:text-[#571244]"
          >
            {pill}
          </button>
        ))}
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#EF4353] hover:underline"
        >
          Explore all categories →
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-extrabold uppercase tracking-widest text-[#EF4353]">
          FEATURED
        </p>
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Popular Courses</h2>
      </div>

      {/* Course grid */}
      {courses.length === 0 ? (
        <p className="text-sm text-slate-400">Courses coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <FeaturedCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination arrows */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-colors hover:border-[#571244] hover:text-[#571244]"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-colors hover:border-[#571244] hover:text-[#571244]"
        >
          ›
        </button>
      </div>

      {/* Explore CTA */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/courses"
          className="rounded-xl bg-[#1a1a5e] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#571244]"
        >
          Explore All Courses →
        </Link>
      </div>
    </section>
  )
}
