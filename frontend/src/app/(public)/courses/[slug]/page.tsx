
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllCourses, getCourseBySlug } from '@/lib/courseData'
import { CourseDetailTabs } from '@/components/courses/CourseDetailTabs'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) return { title: 'Course Not Found' }
  return {
    title: `${course.title} — Tobams Academy`,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) notFound()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#1a1a5e] text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-4 text-xs text-white/50">
            <Link href="/courses" className="hover:text-white/80 transition-colors">
              Courses
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80 line-clamp-1">{course.title}</span>
          </nav>

          {/* Category badge */}
          <span className="mb-3 inline-block rounded bg-[#EF4353] px-2.5 py-0.5 text-xs font-semibold text-white">
            {course.category}
          </span>

          <h1 className="mb-3 text-2xl font-bold leading-snug md:text-3xl">
            {course.title}
          </h1>

          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-white/75">
            {course.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="text-amber-400 font-medium">★ {course.rating}</span>
            <span>({course.ratingCount} ratings)</span>
            <span>·</span>
            <span>{course.studentsEnrolled} students</span>
            <span>·</span>
            <span>Duration: {course.duration}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left — tabs */}
          <div className="lg:col-span-2">
            <CourseDetailTabs course={course} />
          </div>

          {/* Right — sticky enrol card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-[#1a1a5e]/5">
              <div className="flex items-start justify-between">
                <span className="text-2xl font-bold text-slate-900">
                  {course.price}
                </span>
                <button
                  aria-label="Save to wishlist"
                  className="text-xl text-slate-300 hover:text-[#EF4353] transition-colors"
                >
                  ♡
                </button>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">📅</span>
                  <span>
                    <span className="font-medium">Course Duration:</span>{' '}
                    {course.duration}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">📋</span>
                  <span>
                    <span className="font-medium">Curriculum:</span>{' '}
                    {course.curriculum.length} weeks
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">📹</span>
                  <span>
                    <span className="font-medium">Videos:</span> Included
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">👥</span>
                  <span>
                    <span className="font-medium">Students Enrolled:</span>{' '}
                    {course.studentsEnrolled}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">🏆</span>
                  <span>
                    <span className="font-medium">Certificate:</span> Awarded on
                    completion
                  </span>
                </li>
              </ul>

              <Link
                href="/register"
                className="mt-6 block w-full rounded-xl bg-[#1a1a5e] py-3 text-center text-sm font-bold text-white hover:bg-[#1a1a5e]/90 transition-colors"
              >
                Enrol Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
