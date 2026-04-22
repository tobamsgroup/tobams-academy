import type { LucideIcon } from 'lucide-react'

export type MetricCardProps = {
  icon: LucideIcon
  title: string
  value: string
  hint: string
}

export function MetricCard({ icon: Icon, title, value, hint }: MetricCardProps) {
  return (
    <div className="rounded-xl px-4 py-8">
       <p className="text-xs font-medium uppercase tracking-wide text-[#696969]">{title}</p>

       <div className="flex items-center gap-2 mt-4">
      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#EEF0F6] text-primary">
        <Icon className="h-4 w-4" />
      </div> 
      <p className=" text-lg font-bold text-heading">{value}</p>
      </div>
      <p className="mt-4 text-sm text-[#696969]">{hint}</p>
    </div>
  )
}
