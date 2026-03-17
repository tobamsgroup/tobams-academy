interface Props {
  search?: string
}

export function CoursesEmptyState({ search }: Props) {
  return (
    <div className="col-span-full flex flex-col items-center py-16 text-center">
      <p className="text-4xl">📚</p>
      <p className="mt-3 text-base font-semibold text-slate-700">No courses found</p>
      {search ? (
        <p className="mt-1 text-sm text-slate-400">No results for &quot;{search}&quot;. Try a different search.</p>
      ) : (
        <p className="mt-1 text-sm text-slate-400">Check back soon — more courses are on the way.</p>
      )}
    </div>
  )
}
