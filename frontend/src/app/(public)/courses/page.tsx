import { CatalogueClient } from '@/components/courses/CatalogueClient'
import type { Course, Category } from '@/types/course'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

async function fetchInitialData(): Promise<{ courses: Course[]; categories: Category[]; total: number }> {
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
      // coursesJson.data is the paginated payload { data: Course[], meta: {...} }
      // The ResponseInterceptor wraps it as { data: { data: [...], meta: {...} } }
      courses: (coursesJson.data?.data as Course[] | undefined) ?? [],
      total: (coursesJson.data?.meta?.total as number | undefined) ?? 0,
      categories: categoriesJson.data ?? [],
    }
  } catch {
    return { courses: [], categories: [], total: 0 }
  }
}

export const metadata = {
  title: 'Courses — Tobams Academy',
  description: 'Browse our catalogue of expert-designed courses',
}

export default async function CoursesPage() {
  const { courses, categories, total } = await fetchInitialData()

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Explore Courses</h1>
        <p className="mt-1 text-sm text-slate-500">
          {total > 0 ? `${total} courses available` : 'Discover your next skill'}
        </p>
      </div>
      <CatalogueClient initialCourses={courses} initialCategories={categories} />
    </main>
  )
}
