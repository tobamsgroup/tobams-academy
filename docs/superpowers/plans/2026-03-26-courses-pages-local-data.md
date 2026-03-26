# Courses Pages — Local Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the API-backed courses catalogue and detail pages with a local-data implementation driven by `courseContent.json`, matching the `coursecatalog.png` and `coursedetails.png` reference designs.

**Architecture:** A `src/lib/courseData.ts` utility imports `courseContent.json` and enriches each entry with placeholder fields (price, level, rating). The catalogue page feeds data to a fully-local `CatalogueClient` with a sidebar filter panel. The detail page is a Server Component with a `CourseDetailTabs` client sub-component for tab switching.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, lucide-react. No API calls, no SWR hooks on these pages.

---

## File Map

| File | Action |
|------|--------|
| `src/types/course.ts` | Modify — add `CurriculumWeek`, `LocalCourse` interfaces |
| `src/lib/courseData.ts` | Create — JSON import + enrichment + helper exports |
| `src/app/(public)/courses/page.tsx` | Rewrite — local data, no fetch |
| `src/components/courses/CourseCard.tsx` | Rewrite — new card design for `LocalCourse` |
| `src/components/courses/CatalogueClient.tsx` | Rewrite — sidebar filters + course grid |
| `src/components/courses/CourseDetailTabs.tsx` | Create — `'use client'` tab switcher |
| `src/app/(public)/courses/[slug]/page.tsx` | Rewrite — local data, new layout with tabs |

Unchanged: `CourseCardSkeleton.tsx`, `CoursesEmptyState.tsx`, `CategoryPill.tsx`, `CourseOutline.tsx`.

---

## Task 1: Add `LocalCourse` and `CurriculumWeek` types

**Files:**
- Modify: `src/types/course.ts`

- [ ] **Step 1: Open `src/types/course.ts` and append the two new interfaces**

The file currently exports `Category`, `Lesson`, `CourseModule`, `CourseInstructor`, `CourseLevel`, `CourseStatus`, `Course`, `CourseDetail`, `PaginatedResponse`. Add the following at the **end** of the file without changing any existing exports:

```ts
export interface CurriculumWeek {
  week: number
  title: string
  topics: string[]
}

export interface LocalCourse {
  id: string
  slug: string
  title: string
  category: string
  description: string
  objective: string
  targetAudience: string[]
  keyLearningOutcomes: string[]
  duration: string          // e.g. "12 Weeks"
  curriculum: CurriculumWeek[]
  // enriched fields
  price: string             // always "Free"
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number            // 4.5
  ratingCount: number       // 5
  studentsEnrolled: number  // 286
}
```

- [ ] **Step 2: Verify types compile**

Run from `frontend/`:
```bash
npx tsc --noEmit
```
Expected: no errors (or only pre-existing errors unrelated to these types).

- [ ] **Step 3: Commit**

```bash
git add src/types/course.ts
git commit -m "feat(types): add LocalCourse and CurriculumWeek for local JSON data"
```

---

## Task 2: Create `src/lib/courseData.ts`

**Files:**
- Create: `src/lib/courseData.ts`

Note: `resolveJsonModule: true` is already set in `tsconfig.json`. The JSON file is at `frontend/courseContent.json`; relative path from `src/lib/courseData.ts` is `../../courseContent.json`.

- [ ] **Step 1: Create `src/lib/courseData.ts` with the full content below**

```ts
import rawCourses from '../../courseContent.json'
import type { LocalCourse, CurriculumWeek } from '@/types/course'

// Each raw entry from courseContent.json
type RawCourse = (typeof rawCourses)[number]

function deriveLevel(duration: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  const weeks = parseInt(duration, 10)
  if (Number.isNaN(weeks)) return 'Beginner'
  if (weeks <= 4) return 'Beginner'
  if (weeks <= 8) return 'Intermediate'
  return 'Advanced'
}

function enrich(raw: RawCourse): LocalCourse {
  return {
    id: raw.id,
    slug: raw.id,
    title: raw.title,
    category: raw.category,
    description: raw.description,
    objective: raw.objective,
    targetAudience: raw.targetAudience,
    keyLearningOutcomes: raw.keyLearningOutcomes,
    duration: raw.duration,
    curriculum: raw.curriculum as CurriculumWeek[],
    price: 'Free',
    level: deriveLevel(raw.duration),
    rating: 4.5,
    ratingCount: 5,
    studentsEnrolled: 286,
  }
}

const ALL_COURSES: LocalCourse[] = (rawCourses as RawCourse[]).map(enrich)

export function getAllCourses(): LocalCourse[] {
  return ALL_COURSES
}

export function getCourseBySlug(slug: string): LocalCourse | undefined {
  return ALL_COURSES.find((c) => c.slug === slug)
}

export function getCategories(): string[] {
  return [...new Set(ALL_COURSES.map((c) => c.category))].sort()
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/courseData.ts
git commit -m "feat(data): add courseData utility — local JSON enrichment helpers"
```

---

## Task 3: Rewrite catalogue page

**Files:**
- Rewrite: `src/app/(public)/courses/page.tsx`

- [ ] **Step 1: Replace the entire file with the following**

```tsx
import { getAllCourses, getCategories } from '@/lib/courseData'
import { CatalogueClient } from '@/components/courses/CatalogueClient'

export const metadata = {
  title: 'Courses — Tobams Academy',
  description: 'Browse our catalogue of expert-designed courses',
}

export default function CoursesPage() {
  const courses = getAllCourses()
  const categories = getCategories()

  return <CatalogueClient courses={courses} categories={categories} />
}
```

- [ ] **Step 2: Verify it compiles**

`CatalogueClient` signature will change in Task 5 — for now TypeScript will error on the props mismatch. That's fine. Run anyway to confirm no other errors:

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(public)/courses/page.tsx
git commit -m "feat(courses): rewrite catalogue page to use local courseData"
```

---

## Task 4: Rewrite `CourseCard` for `LocalCourse`

**Files:**
- Rewrite: `src/components/courses/CourseCard.tsx`

- [ ] **Step 1: Replace the entire file with the following**

```tsx
import Link from 'next/link'
import type { LocalCourse } from '@/types/course'

interface Props {
  course: LocalCourse
}

export function CourseCard({ course }: Props) {
  const fullStars = Math.floor(course.rating)
  const emptyStars = 5 - fullStars

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition-shadow">
      {/* Image */}
      <Link href={`/courses/${course.slug}`} tabIndex={-1}>
        <div className="relative aspect-video bg-slate-200 flex items-center justify-center">
          <span className="text-xs text-slate-400">[Image Placeholder]</span>
        </div>
      </Link>

      <div className="p-4">
        {/* Provider */}
        <p className="text-[10px] font-medium text-slate-400 mb-0.5 uppercase tracking-wide">
          Tobams Group Academy
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-amber-400 text-xs leading-none" aria-label={`${course.rating} stars`}>
            {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
          </span>
          <span className="text-xs text-slate-400">({course.ratingCount})</span>
        </div>

        {/* Title */}
        <Link href={`/courses/${course.slug}`}>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1 hover:text-[#571244] transition-colors">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{course.description}</p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 text-sm">{course.price}</span>
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-lg bg-[#571244] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#571244]/90 transition-colors"
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```
Expected: no errors on this file (CatalogueClient still has old signature — that error is expected, fixed in Task 5).

- [ ] **Step 3: Commit**

```bash
git add src/components/courses/CourseCard.tsx
git commit -m "feat(courses): rewrite CourseCard for LocalCourse — new card design"
```

---

## Task 5: Rewrite `CatalogueClient` with sidebar filters

**Files:**
- Rewrite: `src/components/courses/CatalogueClient.tsx`

This is the most complex component. It receives all courses as props, filters them client-side, and renders a sidebar + grid layout.

- [ ] **Step 1: Replace the entire file with the following**

```tsx
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
const RATING_OPTIONS = [5, 4, 3, 2] as const

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

          {/* Trending dropdown */}
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
            <option>Trending</option>
            <option>Newest</option>
            <option>Most Popular</option>
          </select>
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
```

- [ ] **Step 2: Verify it compiles with no errors**

```bash
npx tsc --noEmit
```
Expected: PASS — all type errors from previous tasks should now be resolved.

- [ ] **Step 3: Start the dev server and do a quick smoke test**

```bash
npm run dev
```
Open `http://localhost:3000/courses`. Expected:
- Sidebar visible on desktop with Category, Level, Rating, Price, Duration sections
- 12 course cards in 3-col grid (all showing "Free")
- Search input filters cards in real-time
- Category / Level / Duration checkboxes filter the grid

- [ ] **Step 4: Commit**

```bash
git add src/components/courses/CatalogueClient.tsx
git commit -m "feat(courses): rewrite CatalogueClient — sidebar filters, local data, no API"
```

---

## Task 6: Create `CourseDetailTabs` client component

**Files:**
- Create: `src/components/courses/CourseDetailTabs.tsx`

- [ ] **Step 1: Create the file with the following content**

```tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { LocalCourse } from '@/types/course'

interface Props {
  course: LocalCourse
}

type Tab = 'about' | 'curriculum' | 'reviews'

const TAB_LABELS: Record<Tab, string> = {
  about: 'About Course',
  curriculum: 'Curriculum',
  reviews: 'Reviews',
}

export function CourseDetailTabs({ course }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('about')
  const [openWeek, setOpenWeek] = useState<number | null>(
    course.curriculum[0]?.week ?? null,
  )

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 mb-8">
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap
              ${
                activeTab === tab
                  ? 'border-b-2 border-[#571244] text-[#571244]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* About Course */}
      {activeTab === 'about' && (
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Who this course is for?
            </h2>
            <ul className="space-y-2">
              {course.targetAudience.map((audience, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-0.5 shrink-0 text-[#EF4353]">•</span>
                  <span>{audience}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Course Objectives:
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{course.objective}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-5">
              Key Learning Outcomes:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.keyLearningOutcomes.map((outcome, i) => (
                <div key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold">
                    ✓
                  </span>
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Curriculum */}
      {activeTab === 'curriculum' && (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {course.curriculum.map((week) => (
            <div key={week.week}>
              <button
                onClick={() =>
                  setOpenWeek(openWeek === week.week ? null : week.week)
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                    Week {week.week}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{week.title}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-slate-400">
                    {week.topics.length} topic{week.topics.length !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      openWeek === week.week ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {openWeek === week.week && (
                <ul className="border-t border-slate-100 bg-slate-50 px-4 py-3 space-y-2">
                  {week.topics.map((topic, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-600"
                    >
                      <span className="mt-0.5 shrink-0 text-[#571244] font-bold">›</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {activeTab === 'reviews' && (
        <div className="py-16 text-center">
          <p className="text-slate-400 text-sm">
            No reviews yet. Be the first to review this course.
          </p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/courses/CourseDetailTabs.tsx
git commit -m "feat(courses): add CourseDetailTabs — About/Curriculum/Reviews tabs"
```

---

## Task 7: Rewrite course detail page

**Files:**
- Rewrite: `src/app/(public)/courses/[slug]/page.tsx`

Note: Navbar and Footer are composed directly in this page (the public layout is a minimal wrapper — it does not inject them).

- [ ] **Step 1: Replace the entire file with the following**

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllCourses, getCourseBySlug } from '@/lib/courseData'
import { CourseDetailTabs } from '@/components/courses/CourseDetailTabs'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const course = getCourseBySlug(params.slug)
  if (!course) return { title: 'Course Not Found' }
  return {
    title: `${course.title} — Tobams Academy`,
    description: course.description,
  }
}

export default function CourseDetailPage({ params }: Props) {
  const course = getCourseBySlug(params.slug)
  if (!course) notFound()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#1a1a5e] text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-4 text-xs text-white/50">
            <Link href="/courses" className="hover:text-white/80 transition-colors">
              Course
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80 line-clamp-1">{course.title}</span>
          </nav>

          {/* Category badge */}
          <span className="mb-3 inline-block rounded bg-[#EF4353] px-2.5 py-0.5 text-xs font-semibold text-white">
            {course.category}
          </span>

          <h1 className="mb-3 text-2xl font-bold leading-snug md:text-3xl">
            {course.title}
          </h1>

          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-white/75">
            {course.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="text-amber-400 font-medium">★ {course.rating}</span>
            <span>({course.ratingCount} ratings)</span>
            <span>·</span>
            <span>{course.studentsEnrolled} students</span>
            <span>·</span>
            <span>Duration: {course.duration}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left — tabs */}
          <div className="lg:col-span-2">
            <CourseDetailTabs course={course} />
          </div>

          {/* Right — sticky enrol card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-[#1a1a5e]/5">
              <div className="flex items-start justify-between">
                <span className="text-2xl font-bold text-slate-900">
                  {course.price}
                </span>
                <button
                  aria-label="Save to wishlist"
                  className="text-xl text-slate-300 hover:text-[#EF4353] transition-colors"
                >
                  ♡
                </button>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span>📅</span>
                  <span>
                    <span className="font-medium">Course Duration:</span>{' '}
                    {course.duration}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📋</span>
                  <span>
                    <span className="font-medium">Lessons:</span>{' '}
                    {course.curriculum.length} weeks
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📹</span>
                  <span>
                    <span className="font-medium">Videos:</span> Included
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>👥</span>
                  <span>
                    <span className="font-medium">Students Enrolled:</span>{' '}
                    {course.studentsEnrolled}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🏆</span>
                  <span>
                    <span className="font-medium">Certificate:</span> Awarded on
                    completion
                  </span>
                </li>
              </ul>

              <Link
                href="/register"
                className="mt-6 block w-full rounded-xl bg-[#1a1a5e] py-3 text-center text-sm font-bold text-white hover:bg-[#1a1a5e]/90 transition-colors"
              >
                Enrol Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Verify full type check passes**

```bash
npx tsc --noEmit
```
Expected: PASS — zero errors.

- [ ] **Step 3: Smoke test the detail page**

Start dev server if not running:
```bash
npm run dev
```
Open `http://localhost:3000/courses/introduction-to-career-development`.

Expected:
- Dark navy hero with course title, category badge, rating row
- Right sticky card showing "Free", course stats, "Enrol Now" button
- "About Course" tab active by default: shows target audience, objectives, learning outcomes grid
- Click "Curriculum" tab: shows accordion of weeks; clicking a week row expands topics
- Click "Reviews" tab: shows "No reviews yet" message
- Breadcrumb "Course / Introduction to Career Development" links back to `/courses`

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/courses/[slug]/page.tsx
git commit -m "feat(courses): rewrite detail page — local data, hero, tabs, enrol card"
```

---

## Final check

- [ ] **Run lint**

```bash
npm run lint
```
Fix any errors before proceeding.

- [ ] **Verify build**

```bash
npm run build
```
Expected: BUILD SUCCESS. 12 static params generated for `/courses/[slug]`.

- [ ] **Final commit if lint/build required fixes**

```bash
git add -A
git commit -m "fix: resolve lint errors after courses pages rewrite"
```
