import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { StatsBar } from '@/components/landing/StatsBar'
import { CoursesSection } from '@/components/landing/CoursesSection'
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
import { LearningJourney } from '@/components/landing/LearningJourney'
import { EmpoweringSection } from '@/components/landing/EmpoweringSection'
import { LevelUpSection } from '@/components/landing/LevelupSection'
import { CorporateTraining } from '@/components/landing/CorporateTraining'
import { StartJourneySection } from '@/components/landing/StartJourneySection'
import { FAQSection } from '@/components/landing/FaqSection'
import { Newsletter } from '@/components/landing/Newsletter'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <CoursesSection />
      <LearningJourney />
      <EmpoweringSection />
      <LevelUpSection/>
      <CorporateTraining/>
      <StartJourneySection/>
      <FAQSection/>
      {/* <StatsBar /> */}
      {/* <PopularCourses /> */}
      {/* <WhyLearnSection /> */}
      {/* <CertificationPathsSection />
      <InternshipSection />
      <EducationalApproachSection />
      <TrainingStylesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <UpcomingEventsSection /> */}
      <Newsletter />
      <Footer />
    </div>
  )
}
