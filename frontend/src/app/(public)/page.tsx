import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { CoursesSection } from '@/components/landing/CoursesSection'
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
      <Newsletter />
      <Footer />
    </div>
  )
}
