import { Suspense } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Newsletter } from '@/components/landing/Newsletter'
import CheckoutHero from '@/components/checkout/CheckoutHero'
import CheckoutSection from '@/components/checkout/CheckoutSection'

export const metadata = {
  title: 'Checkout — Tobams Academy',
  description: 'Browse our catalogue of expert-designed courses',
}

export default function CoursesPage() {

  return (
    <div className="min-h-screen bg-white">
      <Navbar shadow={false} />
      <CheckoutHero />
      <Suspense fallback={<p className="px-6 py-10 text-[#474348]">Loading checkout…</p>}>
        <CheckoutSection />
      </Suspense>
      <Newsletter />
      <Footer />
    </div>
  )
}
