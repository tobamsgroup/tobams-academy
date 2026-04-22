import { Clock, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'
import { MetricCard } from '../cards/MetricCard'

export function InsightsSection() {
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
          className="inline-flex w-full shrink-0 items-center justify-center rounded-[6px] bg-[#EEF0F6] px-5 py-2.5 font-medium text-primary transition-colors hover:bg-[#232A59] sm:w-auto"
        >
          Learning Progress
        </Link>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <MetricCard
          icon={Clock}
          title="Time spent learning"
          value="24hrs this week"
          hint="You are on track — keep the streak going."
        />
        <hr className="hidden h-[53px] w-[53px] rotate-90 border-[#E5E7EB] md:block" />
        <MetricCard
          icon={BookOpen}
          title="Active course progress"
          value="3 of 5 in progress"
          hint="Finish two more modules to unlock your next badge."
        />
        <hr className="hidden h-[53px] w-[53px] rotate-90 border-[#E5E7EB] md:block" />
        <MetricCard
          icon={Award}
          title="Completed courses"
          value="4 courses"
          hint="Great work — explore new topics anytime."
        />
      </div>
    </section>
  )
}
