'use client'

import { useState, useRef } from 'react'
import { Search } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { useCourses } from '@/hooks/useCourses'
import { CourseCard } from './CourseCard'
import { CategoryPill } from './CategoryPill'
import { CourseCardSkeleton } from './CourseCardSkeleton'
import { CoursesEmptyState } from './CoursesEmptyState'
import type { Category, Course } from '@/types/course'

interface Props {
  initialCourses: Course[]
  initialCategories: Category[]
}

export function CatalogueClient({ initialCourses, initialCategories }: Props) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { categories } = useCategories()
  const { courses, isLoading } = useCourses({ search: debouncedSearch, categoryId })

  const displayCategories = categories.length > 0 ? categories : initialCategories
  const displayCourses = isLoading ? [] : courses.length > 0 || debouncedSearch || categoryId ? courses : initialCourses

  const handleSearch = (value: string) => {
    setSearch(value)
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 400)
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#571244] focus:ring-2 focus:ring-[#571244]/10 md:max-w-sm"
        />
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <CategoryPill
          label="All"
          active={!categoryId}
          onClick={() => setCategoryId(undefined)}
        />
        {displayCategories.map((cat) => (
          <CategoryPill
            key={cat.id}
            label={cat.name}
            active={categoryId === cat.id}
            onClick={() => setCategoryId(cat.id === categoryId ? undefined : cat.id)}
          />
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
          : displayCourses.length > 0
            ? displayCourses.map((course) => <CourseCard key={course.id} course={course} />)
            : <CoursesEmptyState search={debouncedSearch} />
        }
      </div>
    </div>
  )
}
