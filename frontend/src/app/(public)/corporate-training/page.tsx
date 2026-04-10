import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Newsletter } from '@/components/landing/Newsletter'
import { Footer } from '@/components/landing/Footer'
import UpskillHero from '@/components/corporate-training/Hero'
import FeauturesSection from '@/components/corporate-training/FeauturesSection'
import { WhyChooseTGA } from '@/components/corporate-training/WhyChooseTGA'
import { CoursesSection } from '@/components/corporate-training/CoursesSection'
import SmarterLearningBanner from '@/components/corporate-training/SmarterLearningBanner'
import { FAQSection } from '@/components/corporate-training/FAQSection'

const CorporateTrainingPage = () => {
  return (
    <div>
        <Navbar />
        <UpskillHero />
        <FeauturesSection />
        <WhyChooseTGA />
        <CoursesSection />
        <SmarterLearningBanner />
        <FAQSection/>
        <Newsletter/>   
        <Footer />
    </div>
  )
}

export default CorporateTrainingPage