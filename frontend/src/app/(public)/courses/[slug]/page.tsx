
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllCourses, getCourseBySlug } from '@/lib/courseData'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { CourseDetailsBody } from '@/components/course-details/CourseDetailsBody'

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
  const relatedCourses = getAllCourses()
    .filter((c) => c.slug !== course.slug)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}  
      <div className="bg-primary text-white">
        <div className="mx-auto max-w-[1232px] px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-4 text-white flex items-center">
            <Link href="/courses" className="hover:text-white/80  text-[#DA55B5] transition-colors">
              Courses
            </Link>
            <span className="mx-2"><ChevronRight/></span>
            <span className="text-white line-clamp-1">Course Details</span>
          </nav>

          {/* Category badge */}
          {/* <span className="mb-3 inline-block rounded bg-[#EF4353] px-2.5 py-0.5 text-xs font-semibold text-white">
            {course.category}
          </span> */}

          <h1 className="mb-3 text-2xl font-semibold  md:text-3xl lg:text-[56px]">
            {course.title}
          </h1>

          <p className="mb-5 max-w-[768px] text-lg ">
            {course.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-[#FFFFFF]">
            <span className="text-[#B83092] font-medium"> {course.rating}</span>
            <span className='text-[#99A1D4] font-medium'>({course.ratingCount} ratings)</span>
            <span>{course.studentsEnrolled} students</span>
            {/* <span>·</span>
            <span>Duration: {course.duration}</span> */}
          </div>
        </div>
      </div>

      <div className="bg-[#FFFAFA] w-full">
        <CourseDetailsBody course={course} relatedCourses={relatedCourses} />
      </div>

      <Footer />
    </div>
  )
}
