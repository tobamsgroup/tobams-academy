import { Suspense } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import TestPayment from '@/components/checkout/TestPayment'

export const metadata = {
  title: 'Test Payment — Tobams Academy',
  description: 'Simulated payment for testing checkout',
  robots: { index: false },
}

export default function TestPaymentPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar shadow={false} />
      <Suspense fallback={<p className="px-6 py-16 text-center text-[#474348]">Loading…</p>}>
        <TestPayment />
      </Suspense>
      <Footer />
    </div>
  )
}
