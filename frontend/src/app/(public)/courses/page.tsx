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
