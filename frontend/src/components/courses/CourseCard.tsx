import Link from 'next/link'
import type { LocalCourse } from '@/types/course'

interface Props {
  course: LocalCourse
}

export function CourseCard({ course }: Props) {
  const fullStars = Math.floor(course.rating)
  const emptyStars = 5 - fullStars

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#D3D2D3] bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <Link href={`/courses/${course.slug}`} tabIndex={-1}>
        <div className="w-full bg-white p-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 px-4">
              <span className="text-4xl">📚</span>
              <span className="line-clamp-2 text-center text-[20px] font-medium text-slate-500">
                {course.title}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        {/* Provider */}
        {/* <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
          Tobams Group Academy
        </p> */}

        {/* Stars */}
        {/* <div className="mb-2 flex items-center gap-1">
          <span className="text-amber-400 text-xs leading-none" aria-label={`${course.rating} stars`}>
            {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
          </span>
          <span className="text-xs text-slate-400">({course.ratingCount})</span>
        </div> */}

        {/* Title */}
        <Link href={`/courses/${course.slug}`}>
          <h3 className="mb-1.5 line-clamp-2 text-[20px] font-medium text-heading transition-colors hover:text-[#571244]">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mb-4 flex-1 line-clamp-2 text-lg text-[#3C3C3C]">
          {course.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-bold text-heading">{course.price}</span>
          {/* <Link
            href={`/courses/${course.slug}`}
            className="rounded-lg bg-[#571244] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#571244]/90 transition-colors"
          >
            Add to Cart
          </Link> */}
        </div>
      </div>
    </div>
  )
}
