'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { createFetcher } from '@/lib/fetcher'
import { formatGbp } from '@/lib/format-money'
import { useCart } from '@/hooks/useCart'
import { useEnrollments } from '@/hooks/useEnrollments'
import type { CheckoutSessionStatus } from '@/types/cart'

const POLL_MS = 2000
const MAX_WAIT_MS = 60_000

export default function CheckoutSuccess() {
  const router = useRouter()
  const sessionId = useSearchParams().get('session_id')
  const { data: session, status } = useSession()
  const token = session?.accessToken
  // Stop polling after a minute; the webhook still completes the order later.
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), MAX_WAIT_MS)
    return () => window.clearTimeout(timer)
  }, [])
  const cart = useCart()
  const { mutate: mutateEnrollments } = useEnrollments()

  const { data, error } = useSWR<CheckoutSessionStatus>(
    token && sessionId ? `/checkout/session?id=${encodeURIComponent(sessionId)}` : null,
    createFetcher(token),
    {
      // Keep checking until Stripe confirms the payment (or we give up after a minute).
      refreshInterval: (latest) => (latest?.status === 'pending' && !timedOut ? POLL_MS : 0),
      revalidateOnFocus: false,
    },
  )

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  const paid = data?.status === 'paid'
  useEffect(() => {
    if (paid) {
      void mutateEnrollments()
      void cart.refresh()
    }
    // refresh once when the payment is confirmed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid])

  const stillPending = data?.status === 'pending' && timedOut

  let icon = <Clock className="h-14 w-14 text-primary" aria-hidden />
  let title = 'Confirming your payment…'
  let message = 'This usually takes a few seconds. Please keep this page open.'

  if (!sessionId || error) {
    icon = <XCircle className="h-14 w-14 text-secondary" aria-hidden />
    title = "We couldn't find this payment"
    message = 'If you were charged, your courses will appear in My Courses shortly, and you will get a notification.'
  } else if (paid) {
    icon = <CheckCircle className="h-14 w-14 text-emerald-500" aria-hidden />
    title = 'Payment successful'
    message = `You paid ${formatGbp(data.total)}. You're now enrolled. Happy learning!`
  } else if (data?.status === 'failed') {
    icon = <XCircle className="h-14 w-14 text-secondary" aria-hidden />
    title = 'Payment was not completed'
    message = 'You have not been charged. Your courses are still in your cart if you want to try again.'
  } else if (stillPending) {
    title = 'Your payment is still processing'
    message = "We'll enroll you automatically as soon as Stripe confirms it and send you a notification."
  }

  return (
    <section className="mx-auto flex w-full max-w-[640px] flex-col items-center px-6 py-16 text-center">
      {icon}
      <h1 className="mt-5 text-[28px] font-semibold text-heading">{title}</h1>
      <p className="mt-3 text-lg text-[#474348]">{message}</p>

      {paid && data.courses.length > 0 ? (
        <ul className="mt-8 w-full space-y-3 text-left">
          {data.courses.map((course) => (
            <li
              key={course.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-[#E5E7EB] px-4 py-3"
            >
              <span className="min-w-0 truncate font-medium text-heading">{course.title}</span>
              <Link
                href={`/dashboard/courses/${course.slug}`}
                className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#232A59]"
              >
                Start learning
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 flex gap-4">
        {data?.status === 'failed' ? (
          <Link href="/cart" className="font-medium text-primary hover:underline">
            Back to cart
          </Link>
        ) : (
          <Link href="/dashboard/courses" className="font-medium text-primary hover:underline">
            Go to My Courses
          </Link>
        )}
      </div>
    </section>
  )
}
