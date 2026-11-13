'use client'

import { Clock, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'
import { MetricCard } from '../cards/MetricCard'
import { useDashboardOverview } from '@/hooks/useDashboardOverview'
import { formatDuration } from '@/lib/format-duration'
import type { DashboardInsights } from '@/types/dashboard'

function timeHint(i: DashboardInsights): string {
  if (i.thisWeekSeconds === 0) {
    return i.lastWeekSeconds > 0
      ? `You studied ${formatDuration(i.lastWeekSeconds)} last week. Open a lesson to keep it going.`
      : 'Open a lesson to start tracking your learning time.'
  }
  if (i.lastWeekSeconds === 0) return 'Great start this week. Keep the streak going.'
  const diff = i.thisWeekSeconds - i.lastWeekSeconds
  if (diff >= 0) return `${formatDuration(diff)} more than last week. Keep it up.`
  return `${formatDuration(-diff)} less than last week so far.`
}

function progressHint(i: DashboardInsights): string {
  if (i.coursesEnrolled === 0) return 'Enrol in a course to start learning.'
  if (i.coursesInProgress === 0) return 'Everything is complete. Explore new topics anytime.'
  return 'Pick up where you left off from Continue Learning above.'
}

export function InsightsSection() {
  const { overview, isLoading } = useDashboardOverview()
  const i = overview?.insights

  const value = (text: string) => (isLoading || !i ? '—' : text)

  return (
    <section className="mb-10 px-6 border-t border-[#D3D2D366] md:border-none md:px-8 py-8 bg-[#FCFCFC]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold text-heading">Your Insights</h2>
          <p className="mt-1 text-[#474348] md:text-base">
            Track how you are progressing across your enrolled courses.
          </p>
        </div>
        <Link
          href="/dashboard/learning-progress"
          className="inline-flex w-full shrink-0 items-center justify-center rounded-[6px] bg-[#EEF0F6] px-5 py-2.5 font-medium text-primary transition-colors hover:bg-[#232A59] hover:text-white sm:w-auto"
        >
          Learning Progress
        </Link>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <MetricCard
          icon={Clock}
          title="Time spent learning"
          value={value(`${formatDuration(i?.thisWeekSeconds ?? 0)} this week`)}
          hint={i ? timeHint(i) : ''}
        />
        <hr className="hidden h-[53px] w-[53px] rotate-90 border-[#E5E7EB] md:block" />
        <MetricCard
          icon={BookOpen}
          title="Active course progress"
          value={value(`${i?.coursesInProgress ?? 0} of ${i?.coursesEnrolled ?? 0} in progress`)}
          hint={i ? progressHint(i) : ''}
        />
        <hr className="hidden h-[53px] w-[53px] rotate-90 border-[#E5E7EB] md:block" />
        <MetricCard
          icon={Award}
          title="Completed courses"
          value={value(`${i?.coursesCompleted ?? 0} ${i?.coursesCompleted === 1 ? 'course' : 'courses'}`)}
          hint={
            i && i.coursesCompleted > 0
              ? 'Great work. Explore new topics anytime.'
              : 'Complete every lesson in a course to finish it.'
          }
        />
      </div>
    </section>
  )
}
