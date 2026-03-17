export function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm animate-pulse">
      <div className="h-36 bg-slate-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
      </div>
    </div>
  )
}
