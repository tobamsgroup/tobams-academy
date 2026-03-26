import Link from 'next/link'
import { getAllCourses } from '@/lib/courseData'
import type { LocalCourse } from '@/types/course'

const CATEGORY_PILLS = [
  'IT Service',
  'Entrepreneurship',
  'Sustainability',
  'Career',
  'Leadership',
]

function FeaturedCourseCard({ course }: { course: LocalCourse }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 bg-slate-200 flex items-center justify-center">
        <span className="text-xs text-slate-400">[Image Placeholder]</span>
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs font-semibold text-[#571244]">Tobams Group Academy</p>
        <div className="mb-2 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-xs text-yellow-400">★</span>
          ))}
        </div>
        <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900">{course.title}</h3>
        <p className="mb-3 line-clamp-2 text-xs text-slate-500">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">{course.price}</span>
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-lg bg-[#1a1a5e] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  )
}

export function PopularCourses() {
  const courses = getAllCourses().slice(0, 6)

  return (
    <section className="bg-[#D3D4E0] px-5 py-12 md:px-12 md:py-16 rounded-tr-[48px] rounded-tl-[48px]">
      <p className='text-[30px] font-semibold text-[#151515]'>Explore Our Featured Categories and Courses</p>
      <p className='leading-normal text-[#151515] mt-4 mb-6'>Discover a curated selection of top-notch courses spanning various categories. Dive into our featured content designed to elevate your learning experience and empower your professional journey.</p>
      {/* Category pills */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {CATEGORY_PILLS.map((pill) => (
          <span
            key={pill}
            className="rounded-full border border-slate-200  px-4 py-1.5 text-sm text-slate-600"
          >
            {pill}
          </span>
        ))}
        <Link
          href="/courses"
          className="text-sm font-semibold text-[#B82B91] hover:underline"
        >
          Explore all categories
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

      {/* Pagination arrows — decorative placeholders */}
      <div aria-hidden="true" className="mt-6 flex justify-end gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-400">
          ‹
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-400">
          ›
        </div>
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
