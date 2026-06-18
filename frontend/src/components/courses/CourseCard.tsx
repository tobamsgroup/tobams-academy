import Image from 'next/image'
import Link from 'next/link'
import type { Course } from '@/types/course'
import { formatCoursePrice } from '@/lib/catalogue-courses'
import { getCourseThumbnail } from '@/lib/dashboard-courses'

interface Props {
  course: Course
  index?: number
}

export function CourseCard({ course, index = 0 }: Props) {
  const thumbnail = getCourseThumbnail(course, index)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#D3D2D3] bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/courses/${course.slug}`} tabIndex={-1}>
        <div className="w-full bg-white p-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
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

      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <span className="mb-2 w-fit rounded-sm bg-[#EEF0F6] px-2.5 py-1 text-xs font-medium text-slate-600">
          {course.category.name}
        </span>

        <Link href={`/courses/${course.slug}`}>
          <h3 className="mb-1.5 line-clamp-2 text-lg font-medium text-heading transition-colors hover:text-[#571244] md:text-[20px]">
            {course.title}
          </h3>
        </Link>

        <p className="mb-4 flex-1 line-clamp-2 text-[#3C3C3C] md:text-lg">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-heading md:text-[20px]">
            {formatCoursePrice(course.price)}
          </span>
        </div>
      </div>
    </div>
  )
}
