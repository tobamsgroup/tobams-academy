import { ICONS } from '@/assets/icons'
import Link from 'next/link'

export type CourseProgressCardProps = {
  accentClass: string
  dateLabel: string
  durationLabel: string
  title: string
  moduleLabel: string
  resumeHref: string
}

export function CourseProgressCard({
  accentClass,
  dateLabel,
  durationLabel,
  title,
  moduleLabel,
  resumeHref,
}: CourseProgressCardProps) {
  return (
    <div className="flex w-full min-w-0 max-w-full shrink-0 flex-col overflow-hidden rounded-[10px] border border-[#D3D2D366] bg-white md:min-w-[280px] md:max-w-[340px]">
      <div className={`h-[7px] w-full ${accentClass}`} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between text-[10px] text-[#696969]">
          <div className="flex items-center gap-2">
            <ICONS.DashboardCalendar />
            <span>{dateLabel}</span>
          </div>
         
         <div className="flex items-center gap-2">
          <ICONS.DashboardClock />
          <span>{durationLabel}</span>
         </div>
        </div>
        <div className="mb-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#CCDBEB80] text-primary">
          <ICONS.DashboardBook />
        </div>
        <h3 className="mb-4 line-clamp-3 text-sm font-medium text-heading">{title}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-xs text-[#474348]">{moduleLabel}</span>
          <Link
            href={resumeHref}
            className="text-xs text-primary transition-colors hover:text-[#232A59]"
          >
            Resume →
          </Link>
        </div>
      </div>
    </div>
  )
}
