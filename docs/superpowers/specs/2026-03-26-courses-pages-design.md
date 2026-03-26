# Courses Pages — Design Spec
**Date:** 2026-03-26
**Status:** Approved

## Overview

Replace the API-backed courses catalogue and detail pages with a local-data implementation driven by `frontend/courseContent.json`. The visual design matches `frontend/public/coursecatalog.png` (catalogue) and `frontend/public/coursedetails.png` (detail). All courses are free. Placeholder values (level, rating, enrolled count) are injected in the data layer.

No new routes. No API calls. No auth changes. No Redux changes.

---

## Architecture

### Data layer — `src/lib/courseData.ts`
Single source of truth. Imports `courseContent.json`, enriches each entry with placeholder fields, and exports typed helpers.

**Enrichment rules:**
- `price`: `"Free"` for all courses
- `level`: derived from `duration` string — ≤4 weeks → `"Beginner"`, 5–8 weeks → `"Intermediate"`, 9+ weeks → `"Advanced"`
- `rating`: `4.5` (fixed)
- `ratingCount`: `5` (fixed)
- `studentsEnrolled`: `286` (fixed)
- `slug`: same as `id`

**Exports:**
- `getAllCourses(): LocalCourse[]`
- `getCourseBySlug(slug: string): LocalCourse | undefined`
- `getCategories(): string[]` — unique sorted category strings

### Type — `LocalCourse` (added to `src/types/course.ts`)
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
  // enriched
  price: string             // "Free"
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number            // 4.5
  ratingCount: number       // 5
  studentsEnrolled: number  // 286
}
```

### File changes summary
| File | Action |
|------|--------|
| `src/lib/courseData.ts` | **Create** |
| `src/types/course.ts` | **Modify** — add `LocalCourse`, `CurriculumWeek` |
| `src/app/(public)/courses/page.tsx` | **Rewrite** — use `getAllCourses()`, no API |
| `src/components/courses/CatalogueClient.tsx` | **Rewrite** — sidebar + grid, local data |
| `src/components/courses/CourseCard.tsx` | **Rewrite** — match new card design |
| `src/app/(public)/courses/[slug]/page.tsx` | **Rewrite** — use `getCourseBySlug()`, new layout |
| `src/components/courses/CourseDetailTabs.tsx` | **Create** — `'use client'` tab switcher |
| `src/hooks/useCourses.ts` | **Delete** (or leave, no longer imported) |
| `src/hooks/useCategories.ts` | **Delete** (or leave, no longer imported) |

`CourseOutline.tsx`, `CourseCardSkeleton.tsx`, `CoursesEmptyState.tsx`, `CategoryPill.tsx` — **keep unchanged**.

---

## Component Specs

### `src/lib/courseData.ts`

```ts
import courses from '../../courseContent.json'

function deriveLevel(duration: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  const weeks = parseInt(duration)
  if (weeks <= 4) return 'Beginner'
  if (weeks <= 8) return 'Intermediate'
  return 'Advanced'
}

export function getAllCourses(): LocalCourse[] { ... }
export function getCourseBySlug(slug: string): LocalCourse | undefined { ... }
export function getCategories(): string[] { ... }
```

---

### Catalogue page — `src/app/(public)/courses/page.tsx`

Server Component. Calls `getAllCourses()` and `getCategories()`. Passes as props to `CatalogueClient`. No `async` fetch, no `revalidate`.

```tsx
export const metadata = { title: 'Courses — Tobams Academy', ... }

export default function CoursesPage() {
  const courses = getAllCourses()
  const categories = getCategories()
  return <CatalogueClient courses={courses} categories={categories} />
}
```

---

### `src/components/courses/CatalogueClient.tsx`

`'use client'`. Props: `courses: LocalCourse[]`, `categories: string[]`.

**State:**
- `search: string`
- `selectedCategories: string[]`
- `selectedLevels: string[]`
- `selectedRatings: number[]`
- `maxPrice: number` (slider, 0–500; all courses are Free so always pass through)
- `selectedDurations: string[]`

**Filtering logic** (all client-side on the `courses` prop array):
- search: case-insensitive match on `title` + `description`
- categories: if none selected → show all; else match `course.category`
- levels: if none selected → show all; else match `course.level`
- ratings: if none selected → show all; else `course.rating >= selectedMin`
- durations: if none selected → show all; else match `course.duration`

**Layout:**
```
<div className="flex gap-8">
  <aside className="w-60 shrink-0">   {/* Sidebar */}
    <FilterSection title="Category">  {/* checkboxes */}
    <FilterSection title="Level">
    <FilterSection title="Rating">    {/* star icons + checkbox */}
    <FilterSection title="Price">     {/* range slider */}
    <FilterSection title="Duration">  {/* checkboxes */}
  </aside>
  <div className="flex-1">
    {/* Top bar */}
    <div className="flex gap-3 mb-6">
      <input placeholder="Search" ... />
      <select>Trending</select>
    </div>
    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map(course => <CourseCard key={course.id} course={course} />)}
    </div>
  </div>
</div>
```

Sidebar is hidden on mobile (`hidden md:block`). Mobile gets a "Filter" toggle button that shows a slide-in drawer or collapses the sidebar.

---

### `src/components/courses/CourseCard.tsx`

Props: `course: LocalCourse`

Layout (matches `coursecatalog.png`):

Note: no outer `<Link>` wrapper — avoids nested interactive elements. Title and button are both `<Link>` elements pointing to `/courses/${course.slug}`.

```
<div className="rounded-xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition-shadow">
  {/* Image placeholder — grey box, aspect-video */}
  <Link href={`/courses/${course.slug}`}>
    <div className="relative aspect-video bg-slate-200 flex items-center justify-center">
      <span className="text-xs text-slate-400">[Image Placeholder]</span>
    </div>
  </Link>
  <div className="p-4">
    {/* Category label */}
    <p className="text-xs font-semibold text-[#EF4353] mb-1">{course.category}</p>
    {/* Stars */}
    <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
      {'★'.repeat(Math.floor(course.rating))} {course.rating} ({course.ratingCount})
    </div>
    {/* Title */}
    <Link href={`/courses/${course.slug}`}>
      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1">{course.title}</h3>
    </Link>
    {/* Description */}
    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{course.description}</p>
    {/* Footer row */}
    <div className="flex items-center justify-between">
      <span className="font-bold text-slate-900 text-sm">{course.price}</span>
      <Link href={`/courses/${course.slug}`}
        className="rounded-lg bg-[#571244] px-3 py-1.5 text-xs font-semibold text-white">
        Add to Cart
      </Link>
    </div>
  </div>
</div>
```

---

### Course detail page — `src/app/(public)/courses/[slug]/page.tsx`

Server Component.

```tsx
export async function generateStaticParams() {
  return getAllCourses().map(c => ({ slug: c.slug }))
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug)
  if (!course) notFound()
  return (...)
}
```

**Layout (matches `coursedetails.png`):**

```
<Navbar />

{/* Hero — full-width dark navy */}
<div className="bg-[#1a1a5e] text-white py-12 px-6">
  <div className="max-w-5xl mx-auto">
    {/* Breadcrumb */}
    <nav>Course / {course.title}</nav>
    {/* Title */}
    <h1>{course.title}</h1>
    {/* Category badge */}
    <span className="bg-[#EF4353] text-white text-xs px-2 py-0.5 rounded">{course.category}</span>
    {/* Description */}
    <p>{course.description}</p>
    {/* Rating row */}
    <div>★★★★½ 4.5 (5 ratings) · 286 students · Duration: {course.duration}</div>
  </div>
</div>

{/* Body — two column */}
<div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Left — tabs */}
  <div className="lg:col-span-2">
    <CourseDetailTabs course={course} />
  </div>

  {/* Right — sticky enrol card */}
  <div className="lg:col-span-1">
    <div className="sticky top-24 border rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-start">
        <span className="text-2xl font-bold">Free</span>
        <button aria-label="Wishlist">♡</button>
      </div>
      {/* Stats */}
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        <li>📅 Course Duration: {course.duration}</li>
        <li>📋 Lessons: {course.curriculum.length} Weeks</li>
        <li>📹 Videos: Included</li>
        <li>👥 Students Enrolled: 286</li>
        <li>🏆 Certificate: Awarded on completion</li>
      </ul>
      <Link href="/register" className="mt-4 block w-full bg-[#1a1a5e] text-white text-center py-3 rounded-xl font-bold">
        Enrol Now
      </Link>
    </div>
  </div>
</div>

<Footer />
```

---

### `src/components/courses/CourseDetailTabs.tsx`

`'use client'`. Props: `course: LocalCourse`.

Tab bar: `About Course` | `Curriculum` | `Reviews`

**About Course tab:**
- **"Who this course is for?"** — bulleted list from `course.targetAudience`
- **"Course Objectives:"** — paragraph from `course.objective`
- **"Key Learning Outcomes:"** — 2-col grid, each outcome with a green ✓ icon, from `course.keyLearningOutcomes`

**Curriculum tab:**
- List of `course.curriculum` weeks
- Each row: week number, title, topic count — expands on click to show `topics[]`
- Accordion behaviour (one at a time or multi-open, both acceptable)

**Reviews tab:**
- Placeholder: `"No reviews yet. Be the first to review this course."`

Active tab indicated by `border-b-2 border-[#571244]` underline + primary color text.

---

## Constraints & Non-Goals

- No API calls anywhere on these pages
- Images are placeholders — user will replace manually
- "Add to Cart" button is a styled link (no cart state)
- Price slider is UI-only (all courses are Free, slider has no filtering effect)
- Trending dropdown is decorative (no sort logic needed)
- `generateStaticParams` pre-renders all 12 course slugs at build time
- Existing `CourseOutline`, `CourseCardSkeleton`, `CoursesEmptyState`, `CategoryPill` components are unchanged
