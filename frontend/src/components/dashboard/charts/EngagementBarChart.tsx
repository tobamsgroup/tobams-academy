'use client'

import { useDashboardOverview } from '@/hooks/useDashboardOverview'
import { formatDuration } from '@/lib/format-duration'

/** Simple bar chart (no extra deps) of tracked learning time per month. Peak month highlighted. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function EngagementBarChart() {
  const { overview, isLoading } = useDashboardOverview()
  const values = overview?.engagement.monthlySeconds ?? Array.from({ length: 12 }, () => 0)
  const max = Math.max(...values)
  const peakIndex = max > 0 ? values.indexOf(max) : -1
  const total = values.reduce((a, b) => a + b, 0)

  const summary = isLoading
    ? 'Loading your activity…'
    : peakIndex === -1
      ? 'No learning time recorded yet this year. Open a lesson to get started.'
      : `You've had the highest engagement in ${FULL_MONTHS[peakIndex]} (${formatDuration(max)}). ${formatDuration(total)} in total this year.`

  return (
    <div className="px-6 py-8 md:px-8 md:py-8">
      <div className="mb-[52px] flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold text-heading ">Course Engagement This Year</h2>
          <p className="mt-1 text-[#474348]">
            Monthly learning time across all your enrolled courses.
          </p>
        </div>
        <p className="max-w-[484px] rounded-[8px] bg-[#F1F1F4] p-[6px] text-xs text-[#474348]">{summary}</p>
      </div>

      <div className="flex h-auto md:h-[288px] items-end gap-1 sm:gap-2" role="img" aria-label={summary}>
        {MONTHS.map((m, i) => {
          const ratio = max > 0 ? values[i] / max : 0
          const isPeak = i === peakIndex
          return (
            <div key={m} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-[180px] w-full items-end justify-center">
                <div
                  className={`w-full max-w-[28px] rounded-t-md ${isPeak ? '' : 'bg-[#CCDBEB]'}`}
                  style={{
                    // Keep a sliver visible for months with any activity.
                    height: values[i] > 0 ? `${Math.max(ratio * 100, 3)}%` : '0%',
                    ...(isPeak ? { background: 'linear-gradient(90deg, #004D99 0%, #003B75 100%)' } : {}),
                  }}
                  title={`${FULL_MONTHS[i]}: ${formatDuration(values[i])}`}
                />
              </div>
              <span className="text-[10px] text-[#696969] sm:text-xs">{m}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between border-t border-[#E5E7EB] pt-2 text-xs text-[#696969]">
        <span>0</span>
        <span>{max > 0 ? formatDuration(max) : ''}</span>
      </div>
    </div>
  )
}
