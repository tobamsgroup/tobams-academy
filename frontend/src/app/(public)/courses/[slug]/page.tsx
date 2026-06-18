import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { CourseDetailsBody } from '@/components/course-details/CourseDetailsBody'
import { fetchCourseBySlug, fetchRelatedCourses } from '@/lib/course-api'
import { formatCourseLevel } from '@/lib/dashboard-courses'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await fetchCourseBySlug(slug)
  if (!course) return { title: 'Course Not Found' }
  return {
    title: `${course.title} — Tobams Academy`,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = await fetchCourseBySlug(slug)
  if (!course) notFound()

  const relatedCourses = await fetchRelatedCourses(course)

  const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-primary text-white">
        <div className="mx-auto max-w-[1232px] px-6 py-12">
          <nav className="mb-4 flex items-center text-white">
            <Link href="/courses" className="text-[#DA55B5] transition-colors hover:text-white/80">
              Courses
            </Link>
            <span className="mx-2">
              <ChevronRight />
            </span>
            <span className="line-clamp-1 text-white">Course Details</span>
          </nav>

          <span className="mb-3 inline-block rounded bg-[#EF4353] px-2.5 py-0.5 text-xs font-semibold text-white">
            {course.category.name}
          </span>

          <h1 className="mb-3 text-2xl font-semibold md:text-3xl lg:text-[56px]">{course.title}</h1>

          <p className="mb-5 max-w-[768px] text-lg">{course.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-[#FFFFFF]">
            <span className="font-medium text-[#B83092]">{formatCourseLevel(course.level)}</span>
            <span className="font-medium text-[#99A1D4]">
              {course.modules.length} modules · {lessonCount} lessons
            </span>
            <span>Instructor: {course.instructor.name}</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#FFFAFA]">
        <CourseDetailsBody course={course} relatedCourses={relatedCourses} />
      </div>

      <Footer />
    </div>
  )
}
