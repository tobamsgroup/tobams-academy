import { getAllCourses, getCategories } from '@/lib/courseData'
import { CatalogueClient } from '@/components/courses/CatalogueClient'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import CoursesHero from '@/components/courses/Hero'
import { Newsletter } from '@/components/landing/Newsletter'

export const metadata = {
  title: 'Courses — Tobams Academy',
  description: 'Browse our catalogue of expert-designed courses',
}

export default function CoursesPage() {
  const courses = getAllCourses()
  const categories = getCategories()

  return (
    <div className="min-h-screen bg-white">
      <Navbar shadow={false} />
      <CoursesHero />
      <CatalogueClient courses={courses} categories={categories} />
      <Newsletter />
      <Footer />
    </div>
  )
}
