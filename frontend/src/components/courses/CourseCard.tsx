import Image from 'next/image'
import Link from 'next/link'
import type { Course } from '@/types/course'
import { getCoursePricing } from '@/lib/catalogue-courses'
import { getCourseThumbnail } from '@/lib/dashboard-courses'

interface Props {
  course: Course
  index?: number
  /** Already purchased: greyed out, links to the course player instead of the sales page. */
  enrolled?: boolean
}

export function CourseCard({ course, index = 0, enrolled = false }: Props) {
  const thumbnail = getCourseThumbnail(course, index)
  const pricing = getCoursePricing(course)
  const href = enrolled ? `/dashboard/courses/${course.slug}` : `/courses/${course.slug}`
  const muted = enrolled ? 'opacity-60 grayscale' : ''

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[#D3D2D3] transition-all ${
        enrolled ? 'bg-[#F7F7F8]' : 'bg-white hover:-translate-y-1 hover:shadow-lg'
      }`}
    >
      <Link href={href} tabIndex={-1}>
        <div className="relative w-full p-3">
          {enrolled ? (
            <span className="absolute left-5 top-5 z-10 rounded-md bg-heading px-2.5 py-1 text-xs font-semibold text-white">
              Purchased
            </span>
          ) : null}
          <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 ${muted}`}>
            <Image
              src={thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>
      </Link>

      <div className={`flex flex-1 flex-col px-4 pb-4 pt-2 ${muted}`}>
        <span className="mb-2 w-fit rounded-sm bg-[#EEF0F6] px-2.5 py-1 text-xs font-medium text-slate-600">
          {course.category.name}
        </span>

        <Link href={href}>
          <h3 className="mb-1.5 line-clamp-2 text-lg font-medium text-heading transition-colors hover:text-[#571244] md:text-[20px]">
            {course.title}
          </h3>
        </Link>

        <p className="mb-4 flex-1 line-clamp-2 text-[#3C3C3C] md:text-lg">
          {course.description}
        </p>

        {enrolled ? null : (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-heading md:text-[20px]">
              {pricing.current}
              {pricing.original ? (
                <span className="ml-2 text-sm font-normal text-[#696969] line-through">{pricing.original}</span>
              ) : null}
            </span>
          </div>
        )}
      </div>

      {enrolled ? (
        <div className="px-4 pb-4">
          <Link
            href={href}
            className="flex h-10 w-full items-center justify-center rounded-md border border-primary text-sm font-medium text-primary transition-colors hover:bg-[#EEF0F6]"
          >
            Continue learning
          </Link>
        </div>
      ) : null}
    </div>
  )
}
