import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Newsletter } from '@/components/landing/Newsletter'
import AboutHero from '@/components/about/AboutHero'
import AboutSplitSection from '@/components/about/AboutSplitSection'
import CoreObjectives from '@/components/about/CoreObjectives'
import MissionVisionSection from '@/components/about/MissionVisionSection'
import CTASection from '@/components/about/CTASection'

export default function AboutUsPage() {
  return (
    <div>
        <Navbar shadow={false} />
        <AboutHero />
        <AboutSplitSection />
        <CoreObjectives />
        <MissionVisionSection />
        <CTASection />
        <Newsletter />
        <Footer />
    </div>
  )
}