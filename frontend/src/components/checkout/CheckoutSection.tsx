'use client'

import Link from 'next/link'
import { ChevronRight, Lock } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { useEnrollments } from '@/hooks/useEnrollments'
import { createAuthedClient } from '@/lib/fetcher'
import { formatGbp } from '@/lib/format-money'
import type { CartView, CheckoutResult } from '@/types/cart'

async function previewCourse([, courseId]: [string, string]): Promise<CartView> {
  const { data } = await axios.post<{ data: CartView }>(`${process.env.NEXT_PUBLIC_API_URL}/cart/preview`, {
    courseIds: [courseId],
  })
  return data.data
}

export default function CheckoutSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const token = session?.accessToken
  const cart = useCart()
  const { mutate: mutateEnrollments } = useEnrollments()

  // "Buy now" checks out a single course; otherwise the whole cart.
  const buyNowId = searchParams.get('courseId')
  const single = useSWR(buyNowId ? ['checkout-course', buyNowId] : null, previewCourse)
  const view: CartView | undefined = buyNowId ? single.data : { items: cart.items, total: cart.total }
  const loading = status === 'loading' || (buyNowId ? single.isLoading : cart.isLoading)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      const callback = buyNowId ? `/checkout?courseId=${encodeURIComponent(buyNowId)}` : '/checkout'
      router.replace(`/login?callbackUrl=${encodeURIComponent(callback)}`)
    }
  }, [status, router, buyNowId])

  const items = view?.items ?? []
  const total = view?.total ?? 0
  const isFree = total === 0

  const handleCheckout = async () => {
    setError('')
    setSubmitting(true)
    try {
      const { data } = await createAuthedClient(token).post<{ data: CheckoutResult }>(
        '/checkout',
        buyNowId ? { courseIds: [buyNowId] } : {},
      )
      const result = data.data
      if (result.status === 'redirect') {
        window.location.assign(result.url) // Stripe-hosted payment page
        return
      }
      await Promise.all([mutateEnrollments(), cart.refresh()])
      router.push(
        result.courses.length === 1 ? `/dashboard/courses/${result.courses[0].slug}` : '/dashboard/courses',
      )
    } catch (e) {
      setError(
        axios.isAxiosError(e) ? (e.response?.data?.message ?? 'Checkout failed. Please try again.') : 'Checkout failed. Please try again.',
      )
      setSubmitting(false)
    }
  }

  if (loading || status !== 'authenticated') {
    return (
      <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
        <p className="text-[#474348]">Loading checkout…</p>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
        <p className="text-[#474348]">
          {buyNowId ? 'This course is not available for checkout.' : 'Your cart is empty.'}
        </p>
        <Link href="/courses" className="mt-4 inline-block text-primary hover:underline">
          Browse courses
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
      <nav className="mb-12 flex items-center text-lg">
        {buyNowId ? (
          <Link href={`/courses/${items[0].slug}`} className="text-[#DA55B5] transition-colors hover:text-[#B83092]">
            {items[0].title}
          </Link>
        ) : (
          <Link href="/cart" className="text-[#DA55B5] transition-colors hover:text-[#B83092]">
            Cart
          </Link>
        )}
        <span className="mx-4">
          <ChevronRight className="h-4 w-4 text-heading" />
        </span>
        <span className="line-clamp-1 text-heading">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.95fr]">
        <div className="order-2 rounded-[16px] border-[2px] border-[#E5E7EB] bg-white p-5 md:px-6 md:py-7 lg:order-1">
          <h2 className="text-xl font-medium text-heading md:text-[24px]">
            {isFree ? 'Confirm Enrollment' : 'Payment'}
          </h2>
          <p className="mt-2 text-lg text-[#474348]">
            {isFree
              ? 'These courses are free. Confirm to start learning straight away.'
              : 'You will be taken to a secure payment page. You will be enrolled as soon as payment is confirmed.'}
          </p>

          <dl className="mt-6 space-y-2 text-[#474348]">
            <div className="flex justify-between gap-4">
              <dt>Account</dt>
              <dd className="truncate font-medium text-heading">{session?.user?.email}</dd>
            </div>
          </dl>

          {error ? <p className="mt-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</p> : null}

          <Button
            type="button"
            onClick={() => void handleCheckout()}
            disabled={submitting}
            className="mt-7 w-full rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white hover:translate-y-0 hover:bg-[#232A59] hover:from-[#232A59] hover:to-[#232A59] disabled:opacity-60"
          >
            {submitting
              ? isFree
                ? 'Enrolling…'
                : 'Redirecting to payment…'
              : isFree
                ? 'Enroll for free'
                : `Pay ${formatGbp(total)} securely`}
          </Button>
          {!isFree ? (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-[#696969]">
              <Lock className="h-3.5 w-3.5" aria-hidden /> Payments are processed securely. We never see your card details.
            </p>
          ) : null}
        </div>

        <aside className="order-1 rounded-[16px] border-[2px] border-[#E5E7EB] bg-white p-5 md:p-7 lg:order-2 lg:self-start">
          <h3 className="text-xl font-medium text-heading md:text-[24px]">Order Summary</h3>
          <p className="mt-2 text-lg text-[#474348]">Here is the breakdown of your order</p>

          <ul className="mt-7 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 text-lg text-body">
                <span className="min-w-0 truncate">{item.title}</span>
                <span className="shrink-0 text-right">
                  {formatGbp(item.amount)}
                  {item.originalAmount ? (
                    <span className="ml-2 text-sm text-[#696969] line-through">{formatGbp(item.originalAmount)}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 h-px w-full bg-[#E5E7EB]" />
          <div className="mt-5 flex items-center justify-between text-lg font-semibold text-heading">
            <span>Total</span>
            <span>{formatGbp(total)}</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
