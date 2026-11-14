'use client'

import Link from 'next/link'
import { CourseProgressCard } from '../cards/CourseProgressCard'
import { useDashboardOverview } from '@/hooks/useDashboardOverview'
import { formatDuration } from '@/lib/format-duration'

const ACCENTS = ['bg-[#303869]', 'bg-[#800099]', 'bg-[#009999]', 'bg-[#4D9900]']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

export function ContinueLearningSection() {
  const { overview, isLoading, error } = useDashboardOverview()
  const courses = overview?.continueLearning ?? []

  return (
    <section className="mb-10 py-8 px-4 md:px-8 md:py-8">
      <h2 className="font-semibold text-heading">Continue Learning</h2>
      <p className="mt-1 text-[#474348] md:text-base">
        Pick up right where you stopped — one click away.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-secondary">Unable to load your courses right now.</p>
      ) : isLoading ? (
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[180px] w-full animate-pulse rounded-[10px] bg-[#EEF0F6] md:w-[300px]" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="mt-6 rounded-[10px] border border-[#D3D2D366] bg-white p-6 text-sm text-[#474348]">
          {overview?.insights.coursesCompleted
            ? 'You have completed all your courses. '
            : "You haven't started a course yet. "}
          <Link href="/dashboard/courses/explore" className="font-medium text-primary hover:underline">
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-3 md:overflow-x-auto md:pb-2">
          {courses.map((c, i) => (
            <CourseProgressCard
              key={c.courseId}
              accentClass={ACCENTS[i % ACCENTS.length]}
              dateLabel={formatDate(c.lastAccessedAt)}
              durationLabel={formatDuration(c.timeSpentSeconds)}
              title={c.title}
              moduleLabel={
                c.nextLesson ? `Week ${c.nextLesson.moduleNumber} · ${c.progress}% done` : `${c.progress}% done`
              }
              resumeHref={
                c.nextLesson
                  ? `/dashboard/courses/${c.slug}?lesson=${encodeURIComponent(c.nextLesson.id)}`
                  : `/dashboard/courses/${c.slug}`
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
