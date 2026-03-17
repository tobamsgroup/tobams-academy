import Link from 'next/link'
import type { Course } from '@/types/course'

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'bg-emerald-100 text-emerald-700',
  INTERMEDIATE: 'bg-amber-100 text-amber-700',
  ADVANCED: 'bg-red-100 text-red-700',
}

interface Props {
  course: Course
}

export function CourseCard({ course }: Props) {
  const moduleCount = course._count?.modules ?? 0

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#571244]/10"
    >
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#571244] to-[#EF4353]">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        )}
        <span className={`absolute bottom-2 left-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${LEVEL_COLORS[course.level]}`}>
          {course.level.toLowerCase()}
        </span>
      </div>
      <div className="p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#571244]">
          {course.category.name}
        </p>
        <h3 className="mb-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-[#571244] transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{moduleCount} module{moduleCount !== 1 ? 's' : ''}</span>
          <span>{course.price ? `$${course.price}` : 'Free'}</span>
        </div>
      </div>
    </Link>
  )
}
