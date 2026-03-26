'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { CoursesEmptyState } from './CoursesEmptyState'
import type { LocalCourse } from '@/types/course'

interface Props {
  courses: LocalCourse[]
  categories: string[]
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const
const RATING_OPTIONS = [4, 3, 2] as const

export function CatalogueClient({ courses, categories }: Props) {
  const [search, setSearch] = useState('')
  const [selCategories, setSelCategories] = useState<string[]>([])
  const [selLevels, setSelLevels] = useState<string[]>([])
  const [selRatings, setSelRatings] = useState<number[]>([])
  const [selDurations, setSelDurations] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const allDurations = useMemo(
    () =>
      [...new Set(courses.map((c) => c.duration))].sort((a, b) => {
        const an = parseInt(a, 10)
        const bn = parseInt(b, 10)
        return an - bn
      }),
    [courses],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return courses.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q))
        return false
      if (selCategories.length > 0 && !selCategories.includes(c.category)) return false
      if (selLevels.length > 0 && !selLevels.includes(c.level)) return false
      if (selRatings.length > 0 && !selRatings.some((r) => c.rating >= r)) return false
      if (selDurations.length > 0 && !selDurations.includes(c.duration)) return false
      return true
    })
  }, [courses, search, selCategories, selLevels, selRatings, selDurations])

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#571244] focus:ring-2 focus:ring-[#571244]/10"
            />
          </div>

        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto max-w-7xl flex gap-0">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'block' : 'hidden'} md:block
            w-64 shrink-0 border-r border-slate-200 bg-white px-5 py-6
          `}
        >
          {categories.length > 1 && (
            <FilterSection title="Category">
              {categories.map((cat) => (
                <CheckboxRow
                  key={cat}
                  label={cat}
                  count={courses.filter((c) => c.category === cat).length}
                  checked={selCategories.includes(cat)}
                  onChange={() => setSelCategories(toggle(selCategories, cat))}
                />
              ))}
            </FilterSection>
          )}

          <FilterSection title="Level">
            {LEVELS.map((level) => (
              <CheckboxRow
                key={level}
                label={level}
                count={courses.filter((c) => c.level === level).length}
                checked={selLevels.includes(level)}
                onChange={() => setSelLevels(toggle(selLevels, level))}
              />
            ))}
          </FilterSection>

          <FilterSection title="Rating">
            {RATING_OPTIONS.map((r) => (
              <CheckboxRow
                key={r}
                label={`${'★'.repeat(r)}${'☆'.repeat(5 - r)}  ${r}+`}
                checked={selRatings.includes(r)}
                onChange={() => setSelRatings(toggle(selRatings, r))}
              />
            ))}
          </FilterSection>

          <FilterSection title="Price">
            <p className="text-xs text-slate-500">
              All courses are{' '}
              <span className="font-semibold text-[#571244]">Free</span>
            </p>
          </FilterSection>

          <FilterSection title="Duration">
            {allDurations.map((d) => (
              <CheckboxRow
                key={d}
                label={d}
                checked={selDurations.includes(d)}
                onChange={() => setSelDurations(toggle(selDurations, d))}
              />
            ))}
          </FilterSection>
        </aside>

        {/* Course grid */}
        <main className="flex-1 px-6 py-6">
          <p className="mb-5 text-sm text-slate-500">
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <CoursesEmptyState search={search} />
          )}
        </main>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-slate-800"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  )
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 accent-[#571244]"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-slate-400">({count})</span>
      )}
    </label>
  )
}
