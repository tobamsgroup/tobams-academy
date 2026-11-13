import { Suspense } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess'

export const metadata = {
  title: 'Payment — Tobams Academy',
  description: 'Payment confirmation',
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar shadow={false} />
      <Suspense fallback={<p className="px-6 py-16 text-center text-[#474348]">Confirming your payment…</p>}>
        <CheckoutSuccess />
      </Suspense>
      <Footer />
    </div>
  )
}
