'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import axios from 'axios'
import { FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import { formatGbp } from '@/lib/format-money'
import type { CheckoutSessionStatus } from '@/types/cart'

/**
 * Stand-in for Stripe's hosted payment page while PAYMENT_PROVIDER=simulated.
 * No card is charged: "Pay" confirms the order through the same fulfilment as Stripe.
 */
export default function TestPayment() {
  const router = useRouter()
  const sessionId = useSearchParams().get('session_id')
  const { data: session, status } = useSession()
  const token = session?.accessToken
  const [busy, setBusy] = useState<'paid' | 'failed' | null>(null)
  const [error, setError] = useState('')

  const { data, error: loadError } = useSWR<CheckoutSessionStatus>(
    token && sessionId ? `/checkout/session?id=${encodeURIComponent(sessionId)}` : null,
    createFetcher(token),
    { revalidateOnFocus: false },
  )

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  // Already settled (e.g. back button): go to the result instead of paying twice.
  useEffect(() => {
    if (data && data.status !== 'pending' && sessionId) {
      router.replace(`/checkout/success?session_id=${encodeURIComponent(sessionId)}`)
    }
  }, [data, sessionId, router])

  const settle = async (outcome: 'paid' | 'failed') => {
    if (!sessionId) return
    setError('')
    setBusy(outcome)
    try {
      await createAuthedClient(token).post('/checkout/test-payment', { sessionId, outcome })
      router.push(`/checkout/success?session_id=${encodeURIComponent(sessionId)}`)
    } catch (e) {
      setError(axios.isAxiosError(e) ? (e.response?.data?.message ?? 'Payment failed') : 'Payment failed')
      setBusy(null)
    }
  }

  const cancel = async () => {
    // Same as cancelling on Stripe: the order is dropped, the cart is kept.
    if (sessionId) await settle('failed').catch(() => undefined)
    router.push('/cart?checkout=cancelled')
  }

  return (
    <section className="mx-auto w-full max-w-[560px] px-6 py-12">
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#F5D97A] bg-[#FFF7CC] p-4 text-sm text-[#5C4B00]">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p>
          <strong>TEST MODE.</strong> No card is charged. This page stands in for Stripe until payments are
          integrated; choosing &quot;Pay&quot; enrolls you exactly as a real payment would.
        </p>
      </div>

      <div className="rounded-[16px] border-[2px] border-[#E5E7EB] bg-white p-6">
        <h1 className="text-[24px] font-medium text-heading">Complete payment</h1>

        {loadError ? (
          <p className="mt-4 text-[#474348]">
            This checkout could not be found.{' '}
            <Link href="/cart" className="text-primary hover:underline">Back to cart</Link>
          </p>
        ) : !data ? (
          <p className="mt-4 text-[#474348]">Loading order…</p>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {data.courses.map((course) => (
                <li key={course.id} className="text-lg text-body">{course.title}</li>
              ))}
            </ul>
            <div className="mt-5 h-px bg-[#E5E7EB]" />
            <div className="mt-5 flex items-center justify-between text-lg font-semibold text-heading">
              <span>Total</span>
              <span>{formatGbp(data.total)}</span>
            </div>

            {error ? <p className="mt-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</p> : null}

            <Button
              type="button"
              onClick={() => void settle('paid')}
              disabled={busy !== null}
              className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white hover:translate-y-0 hover:bg-[#232A59] hover:from-[#232A59] hover:to-[#232A59] disabled:opacity-60"
            >
              {busy === 'paid' ? 'Processing…' : `Pay ${formatGbp(data.total)} (test)`}
            </Button>
            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => void settle('failed')}
                disabled={busy !== null}
                className="text-[#696969] hover:text-secondary disabled:opacity-50"
              >
                Simulate failed payment
              </button>
              <button
                type="button"
                onClick={() => void cancel()}
                disabled={busy !== null}
                className="text-primary hover:underline disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
