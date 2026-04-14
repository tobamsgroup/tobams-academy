'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { CoursesEmptyState } from './CoursesEmptyState'
import type { LocalCourse } from '@/types/course'
import { Button } from '../ui/Button'

interface Props {
  courses: LocalCourse[]
  categories: string[]
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const
const RATING_OPTIONS = [4, 3, 2] as const
const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'latest', label: 'Latest' },
  { id: 'highest_price', label: 'Highest Price' },
  { id: 'lowest_price', label: 'Lowest Price' },
] as const

export function CatalogueClient({ courses, categories }: Props) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('trending')
  const [sortOpen, setSortOpen] = useState(false)
  const [selCategories, setSelCategories] = useState<string[]>([])
  const [selLevels, setSelLevels] = useState<string[]>([])
  const [selRatings, setSelRatings] = useState<number[]>([])
  const [selDurations, setSelDurations] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [selPriceTypes, setSelPriceTypes] = useState<string[]>([])
  const controlsRef = useRef<HTMLDivElement>(null)

  const allDurations = useMemo(
    () =>
      [...new Set(courses.map((c) => c.duration))].sort((a, b) => {
        const an = parseInt(a, 10)
        const bn = parseInt(b, 10)
        return an - bn
      }),
    [courses],
  )

  const priceCounts = useMemo(() => {
    let paid = 0
    let free = 0
    courses.forEach((c) => {
      const n = Number.parseFloat(String(c.price).replace(/[^\d.]/g, ''))
      if (Number.isFinite(n) && n > 0) paid += 1
      else free += 1
    })
    return { paid, free }
  }, [courses])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (controlsRef.current?.contains(event.target as Node)) return
      setSortOpen(false)
      setFilterOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const minValue = Number.parseFloat(priceMin)
    const maxValue = Number.parseFloat(priceMax)

    return courses.filter((c) => {
      const priceValue = Number.parseFloat(String(c.price).replace(/[^\d.]/g, '')) || 0
      const isPaid = priceValue > 0
      if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q))
        return false
      if (selCategories.length > 0 && !selCategories.includes(c.category)) return false
      if (selLevels.length > 0 && !selLevels.includes(c.level)) return false
      if (selRatings.length > 0 && !selRatings.some((r) => c.rating >= r)) return false
      if (selDurations.length > 0 && !selDurations.includes(c.duration)) return false
      if (Number.isFinite(minValue) && priceValue < minValue) return false
      if (Number.isFinite(maxValue) && priceValue > maxValue) return false
      if (selPriceTypes.length > 0) {
        const type = isPaid ? 'paid' : 'free'
        if (!selPriceTypes.includes(type)) return false
      }
      return true
    })
  }, [courses, search, selCategories, selLevels, selRatings, selDurations, priceMin, priceMax, selPriceTypes])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sortBy === 'trending') {
      return list.sort((a, b) => b.rating - a.rating)
    }
    if (sortBy === 'latest') return list.reverse()
    if (sortBy === 'highest_price') {
      return list.sort(
        (a, b) =>
          (Number.parseFloat(String(b.price).replace(/[^\d.]/g, '')) || 0) -
          (Number.parseFloat(String(a.price).replace(/[^\d.]/g, '')) || 0),
      )
    }
    if (sortBy === 'lowest_price') {
      return list.sort(
        (a, b) =>
          (Number.parseFloat(String(a.price).replace(/[^\d.]/g, '')) || 0) -
          (Number.parseFloat(String(b.price).replace(/[^\d.]/g, '')) || 0),
      )
    }
    return list
  }, [filtered, sortBy])

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="relative bg-white px-6 py-4" ref={controlsRef}>
        <div className="mx-auto flex max-w-[1312px] items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
            onClick={() => setFilterOpen((o) => !o)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>

          {/* Search */}
          <div className="flex w-full items-center justify-end gap-3">
            <div className="relative w-full md:max-w-[520px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white py-2 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#571244] focus:ring-2 focus:ring-[#571244]/10"
              />
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <p className="text-sm text-heading">Sort by:</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setSortOpen((v) => !v)
                    setFilterOpen(false)
                  }}
                  className="flex h-11 min-w-[160px] items-center justify-between rounded-lg border-[2px] border-[#E5E7EB] bg-white pl-4 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#571244] focus:ring-2 focus:ring-[#571244]/10"
                >
                  <span>{SORT_OPTIONS.find((option) => option.id === sortBy)?.label ?? 'Trending'}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {sortOpen ? (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[200px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xl">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSortBy(option.id)
                          setSortOpen(false)
                        }}
                        className="w-full px-7 py-4 text-left text-[18px] text-[#221D23] transition-colors hover:bg-[#F5F5F7]"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => {
                  setFilterOpen((o) => !o)
                  setSortOpen(false)
                }}
                className="inline-flex items-center gap-2 px-2 py-2  font-medium text-[#252A64] transition-colors hover:text-slate-900"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>

        </div>

        {filterOpen ? (
          <div className="absolute left-0 right-0 top-full z-40 px-6">
            <div className="mx-auto mt-3 w-full max-w-[1312px]">
              <div className="ml-auto w-full max-w-[371px] rounded-2xl border border-[#D3D2D3] bg-[#FFFAFA] p-7">
              <div className="rounded-lg border border-[#DEDEDE] bg-white">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-5 text-left text-[20px] font-medium text-[#221D23]"
                >
                  Category
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="space-y-4 border-t border-[#D3D2D3] p-5">
                  {categories.map((cat) => (
                    <label key={cat} className="flex cursor-pointer items-center gap-3 text-sm text-[#252A64]">
                      <input
                        type="checkbox"
                        checked={selCategories.includes(cat)}
                        onChange={() => setSelCategories(toggle(selCategories, cat))}
                        className="h-[18px] w-[18px] rounded border-[#151515] accent-primary"
                      />
                      <span className="flex-1">{cat}</span>
                      <span className="text-[#696969]">{courses.filter((c) => c.category === cat).length}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-[#DEDEDE] bg-white">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-5 text-left text-[20px] font-medium text-[#221D23]"
                >
                  Price
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="space-y-5 border-t border-[#DEDEDE] p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="£ min:"
                      className="h-[48px] rounded-lg border border-[#DEDEDE] bg-transparent px-4  text-[#3C3C3C] outline-none"
                    />
                    <input
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="£ max:"
                      className="h-[48px] rounded-lg border border-[#DEDEDE] bg-transparent px-4 text-[#3C3C3C] outline-none"
                    />
                  </div>
                  {[
                    { id: 'paid', label: 'Paid', count: priceCounts.paid },
                    { id: 'free', label: 'Free', count: priceCounts.free },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-center gap-3 text-sm text-[#221D23]"
                    >
                      <input
                        type="checkbox"
                        checked={selPriceTypes.includes(item.id)}
                        onChange={() => setSelPriceTypes(toggle(selPriceTypes, item.id))}
                        className="h-[18px] w-[18px] rounded border-[#151515] accent-primary"
                      />
                      <span className="flex-1">{item.label}</span>
                      <span className="text-[#696969]">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
              type="button"
              className="bg-primary text-white mt-4 font-medium text-base  border-[2px] border-primary px-6 py-3 hover:bg-[#162060] hover:from-[#162060] hover:to-[#162060] hover:translate-y-0 w-full"
            >
              Reset
            </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Layout */}
      <div className="mx-auto max-w-7xl flex gap-0">
        {/* Sidebar */}
        {/* <aside
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
        </aside> */}

        {/* Course grid */}
        <main className="py-8">
          {sorted.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((course) => (
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
