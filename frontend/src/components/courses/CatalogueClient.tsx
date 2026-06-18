'use client'

import { useState, useMemo, useRef, useEffect, useDeferredValue } from 'react'
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { CoursesEmptyState } from './CoursesEmptyState'
import { Button } from '../ui/Button'
import { useCourses } from '@/hooks/useCourses'
import { useCategories } from '@/hooks/useCategories'
import {
  CATALOGUE_PAGE_SIZE,
  LEVEL_LABELS,
  LEVEL_OPTIONS,
  mapCatalogueSortToApi,
  parseCoursePrice,
  sortCatalogueCourses,
} from '@/lib/catalogue-courses'

const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'latest', label: 'Latest' },
  { id: 'highest_price', label: 'Highest Price' },
  { id: 'lowest_price', label: 'Lowest Price' },
] as const
type FilterSectionKey = 'category' | 'level' | 'price'

export function CatalogueClient() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('trending')
  const [sortOpen, setSortOpen] = useState(false)
  const [selCategoryIds, setSelCategoryIds] = useState<string[]>([])
  const [selLevels, setSelLevels] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [selPriceTypes, setSelPriceTypes] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filterSectionsOpen, setFilterSectionsOpen] = useState<Record<FilterSectionKey, boolean>>({
    category: true,
    level: true,
    price: true,
  })
  const controlsRef = useRef<HTMLDivElement>(null)

  const deferredSearch = useDeferredValue(search.trim())
  const { categories } = useCategories()
  const apiCategoryId = selCategoryIds.length === 1 ? selCategoryIds[0] : undefined

  const { courses, meta, error, isLoading } = useCourses({
    search: deferredSearch || undefined,
    categoryId: apiCategoryId,
    page: currentPage,
    limit: CATALOGUE_PAGE_SIZE,
    sort: mapCatalogueSortToApi(sortBy),
  })

  const priceCounts = useMemo(() => {
    let paid = 0
    let free = 0
    courses.forEach((course) => {
      if (parseCoursePrice(course.price) > 0) paid += 1
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

  useEffect(() => {
    setCurrentPage(1)
  }, [deferredSearch, selCategoryIds, selLevels, priceMin, priceMax, selPriceTypes, sortBy])

  const filtered = useMemo(() => {
    const minValue = Number.parseFloat(priceMin)
    const maxValue = Number.parseFloat(priceMax)

    return courses.filter((course) => {
      const priceValue = parseCoursePrice(course.price)
      const isPaid = priceValue > 0

      if (selCategoryIds.length > 1 && !selCategoryIds.includes(course.category.id)) return false
      if (selLevels.length > 0 && !selLevels.includes(LEVEL_LABELS[course.level])) return false
      if (Number.isFinite(minValue) && priceValue < minValue) return false
      if (Number.isFinite(maxValue) && priceValue > maxValue) return false
      if (selPriceTypes.length > 0) {
        const type = isPaid ? 'paid' : 'free'
        if (!selPriceTypes.includes(type)) return false
      }
      return true
    })
  }, [courses, selCategoryIds, selLevels, priceMin, priceMax, selPriceTypes])

  const sorted = useMemo(
    () => sortCatalogueCourses(filtered, sortBy),
    [filtered, sortBy],
  )

  const totalPages = meta?.totalPages ?? 1

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
  }

  function resetFilters() {
    setSearch('')
    setSortBy('trending')
    setSelCategoryIds([])
    setSelLevels([])
    setPriceMin('')
    setPriceMax('')
    setSelPriceTypes([])
    setCurrentPage(1)
  }

  function toggleFilterSection(section: FilterSectionKey) {
    setFilterSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="min-h-screen">
      <div className="relative bg-white px-6 py-4" ref={controlsRef}>
        <div className="mx-auto flex max-w-[1312px] items-center gap-3">
          <button
            className={`order-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border text-slate-600 md:hidden ${
              filterOpen ? 'border-[#E5E7EB] bg-[#EEF0F6]' : 'border-slate-200 bg-white'
            }`}
            onClick={() => setFilterOpen((o) => !o)}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          <div className="order-1 flex w-full items-center justify-end gap-3 md:order-2">
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
                className={`inline-flex items-center gap-2 rounded-lg px-2 py-2 font-medium text-[#252A64] transition-colors hover:text-slate-900 ${
                  filterOpen ? 'bg-[#EEF0F6]' : ''
                }`}
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
                <div className="md:hidden">
                  <div className="pb-4 text-left font-medium text-[#221D23]">Sort by:</div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-[#DEDEDE] bg-white px-4 pr-10 text-sm text-[#221D23] outline-none"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#696969]" />
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-[#DEDEDE] bg-white">
                  <button
                    type="button"
                    onClick={() => toggleFilterSection('category')}
                    className="flex w-full items-center justify-between p-5 text-left font-medium text-[#221D23] md:text-[20px]"
                  >
                    Category
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${filterSectionsOpen.category ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {filterSectionsOpen.category ? (
                    <div className="space-y-4 border-t border-[#D3D2D3] p-5">
                      {categories.map((cat) => (
                        <label key={cat.id} className="flex cursor-pointer items-center gap-3 text-sm text-[#252A64]">
                          <input
                            type="checkbox"
                            checked={selCategoryIds.includes(cat.id)}
                            onChange={() => setSelCategoryIds(toggle(selCategoryIds, cat.id))}
                            className="h-[18px] w-[18px] rounded border-[#151515] accent-primary"
                          />
                          <span className="flex-1">{cat.name}</span>
                          <span className="text-[#696969]">
                            {courses.filter((c) => c.category.id === cat.id).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 rounded-lg border border-[#DEDEDE] bg-white">
                  <button
                    type="button"
                    onClick={() => toggleFilterSection('level')}
                    className="flex w-full items-center justify-between p-5 text-left font-medium text-[#221D23] md:text-[20px]"
                  >
                    Level
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${filterSectionsOpen.level ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {filterSectionsOpen.level ? (
                    <div className="space-y-4 border-t border-[#DEDEDE] p-5">
                      {LEVEL_OPTIONS.map((level) => (
                        <label key={level} className="flex cursor-pointer items-center gap-3 text-sm text-[#252A64]">
                          <input
                            type="checkbox"
                            checked={selLevels.includes(level)}
                            onChange={() => setSelLevels(toggle(selLevels, level))}
                            className="h-[18px] w-[18px] rounded border-[#151515] accent-primary"
                          />
                          <span className="flex-1">{level}</span>
                          <span className="text-[#696969]">
                            {courses.filter((c) => LEVEL_LABELS[c.level] === level).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 rounded-lg border border-[#DEDEDE] bg-white">
                  <button
                    type="button"
                    onClick={() => toggleFilterSection('price')}
                    className="flex w-full items-center justify-between p-5 text-left font-medium text-[#221D23] md:text-[20px]"
                  >
                    Price
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${filterSectionsOpen.price ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {filterSectionsOpen.price ? (
                    <div className="space-y-5 border-t border-[#DEDEDE] p-5">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          placeholder="£ min:"
                          className="h-[48px] rounded-lg border border-[#DEDEDE] bg-transparent px-4 text-[#3C3C3C] outline-none"
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
                  ) : null}
                </div>

                <Button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 w-full border-[2px] border-primary bg-primary px-6 py-3 text-base font-medium text-white hover:translate-y-0 hover:bg-[#162060] hover:from-[#162060] hover:to-[#162060]"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mx-auto flex max-w-7xl gap-0">
        <main className="px-6 py-8 md:px-0">
          {error ? (
            <div className="rounded-lg bg-secondary/10 p-4 text-sm text-secondary">
              Unable to load courses. Please try again.
            </div>
          ) : null}

          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-500">Loading courses…</div>
          ) : sorted.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="rounded-lg border border-[#D3D2D3] px-4 py-2 text-sm text-[#474348] disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[#474348]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className="rounded-lg border border-[#D3D2D3] px-4 py-2 text-sm text-[#474348] disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <CoursesEmptyState search={search} />
          )}
        </main>
      </div>
    </div>
  )
}
