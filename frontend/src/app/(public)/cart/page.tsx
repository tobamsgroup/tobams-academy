import { Suspense } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Newsletter } from '@/components/landing/Newsletter'
import CartHero from '@/components/cart/CartHero'
import CartSection from '@/components/cart/CartSection'

export const metadata = {
  title: 'Cart — Tobams Academy',
  description: 'Browse our catalogue of expert-designed courses',
}

export default function CoursesPage() {

  return (
    <div className="min-h-screen bg-white">
      <Navbar shadow={false} />
      <CartHero />
      <Suspense fallback={<p className="px-6 py-10 text-[#474348]">Loading cart…</p>}>
        <CartSection />
      </Suspense>
      <Newsletter />
      <Footer />
    </div>
  )
}
