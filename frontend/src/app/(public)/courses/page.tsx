import { CatalogueClient } from '@/components/courses/CatalogueClient'
import type { Course, Category } from '@/types/course'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

async function fetchInitialData(): Promise<{ courses: Course[]; categories: Category[] }> {
  try {
    const [coursesRes, categoriesRes] = await Promise.all([
      fetch(`${API}/courses`, { next: { revalidate: 60 } }),
      fetch(`${API}/categories`, { next: { revalidate: 3600 } }),
    ])
    const [coursesJson, categoriesJson] = await Promise.all([
      coursesRes.json(),
      categoriesRes.json(),
    ])
    return {
      courses: coursesJson.data?.data ?? [],
      categories: categoriesJson.data ?? [],
    }
  } catch {
    return { courses: [], categories: [] }
  }
}

export const metadata = {
  title: 'Courses — Tobams Academy',
  description: 'Browse our catalogue of expert-designed courses',
}

export default async function CoursesPage() {
  const { courses, categories } = await fetchInitialData()

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Explore Courses</h1>
        <p className="mt-1 text-sm text-slate-500">
          {courses.length > 0 ? `${courses.length}+ courses available` : 'Discover your next skill'}
        </p>
      </div>
      <CatalogueClient initialCourses={courses} initialCategories={categories} />
    </main>
  )
}
