import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { StatsBar } from '@/components/landing/StatsBar'
import { PopularCourses } from '@/components/landing/PopularCourses'
import { WhyLearnSection } from '@/components/landing/WhyLearnSection'
import { CertificationPathsSection } from '@/components/landing/CertificationPathsSection'
import { InternshipSection } from '@/components/landing/InternshipSection'
import { EducationalApproachSection } from '@/components/landing/EducationalApproachSection'
import { TrainingStylesSection } from '@/components/landing/TrainingStylesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { UpcomingEventsSection } from '@/components/landing/UpcomingEventsSection'
import { CTABannerSection } from '@/components/landing/CTABannerSection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <StatsBar />
      <PopularCourses />
      <WhyLearnSection />
      <CertificationPathsSection />
      <InternshipSection />
      <EducationalApproachSection />
      <TrainingStylesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <UpcomingEventsSection />
      <CTABannerSection />
      <Footer />
    </div>
  )
}
