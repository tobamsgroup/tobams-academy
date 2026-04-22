import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Newsletter } from '@/components/landing/Newsletter'
import CartHero from '@/components/cart/CartHero'
import CartSection from '@/components/cart/CartSection'

export const metadata = {
  title: 'Courses — Tobams Academy',
  description: 'Browse our catalogue of expert-designed courses',
}

export default function CoursesPage() {

  return (
    <div className="min-h-screen bg-white">
      <Navbar shadow={false} />
      <CartHero />
      <CartSection />
      <Newsletter />
      <Footer />
    </div>
  )
}
