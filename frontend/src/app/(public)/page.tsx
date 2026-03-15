import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { StatsBar } from '@/components/landing/StatsBar'
import { CoursesSection } from '@/components/landing/CoursesSection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <StatsBar />
      <CoursesSection />
      <Footer />
    </div>
  )
}
