'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import PaymentSummaryView from '@/components/dashboard/payment/PaymentSummaryView'
import { paymentDetailToSummary } from '@/lib/payment-utils'
import { usePaymentDetail } from '@/hooks/usePayments'

export default function PaymentSummaryClient({ paymentId }: { paymentId: string }) {
  const router = useRouter()
  const { status } = useSession()
  const { detail, isLoading, error } = usePaymentDetail(paymentId)

  if (status === 'unauthenticated') {
    router.replace(`/login?callbackUrl=${encodeURIComponent(`/dashboard/payment/${paymentId}`)}`)
    return null
  }

  if (isLoading) {
    return <p className="px-6 text-[#474348]">Loading payment summary…</p>
  }

  if (error || !detail) {
    return (
      <div className="px-6">
        <p className="text-[#474348]">Payment not found.</p>
        <Link href="/dashboard/payment" className="mt-4 inline-block text-primary hover:underline">
          Back to payment history
        </Link>
      </div>
    )
  }

  return <PaymentSummaryView summary={paymentDetailToSummary(paymentId, detail)} />
}
