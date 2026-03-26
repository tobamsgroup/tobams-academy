import Link from 'next/link'
import type { LocalCourse } from '@/types/course'

interface Props {
  course: LocalCourse
}

export function CourseCard({ course }: Props) {
  const fullStars = Math.floor(course.rating)
  const emptyStars = 5 - fullStars

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition-shadow">
      {/* Image */}
      <Link href={`/courses/${course.slug}`} tabIndex={-1}>
        <div className="relative aspect-video bg-slate-200 flex items-center justify-center">
          <span className="text-xs text-slate-400">[Image Placeholder]</span>
        </div>
      </Link>

      <div className="p-4">
        {/* Provider */}
        <p className="text-[10px] font-medium text-slate-400 mb-0.5 uppercase tracking-wide">
          Tobams Group Academy
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-amber-400 text-xs leading-none" aria-label={`${course.rating} stars`}>
            {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
          </span>
          <span className="text-xs text-slate-400">({course.ratingCount})</span>
        </div>

        {/* Title */}
        <Link href={`/courses/${course.slug}`}>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1 hover:text-[#571244] transition-colors">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{course.description}</p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 text-sm">{course.price}</span>
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-lg bg-[#571244] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#571244]/90 transition-colors"
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}
