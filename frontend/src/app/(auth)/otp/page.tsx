import { Suspense } from 'react'
import OtpVerificationContent from './OtpVerificationContent'

export default function OtpPage() {
  return (
    <Suspense fallback={<main className="min-h-[calc(100vh-101px)] bg-[#fffbfb]" />}>
      <OtpVerificationContent />
    </Suspense>
  )
}
