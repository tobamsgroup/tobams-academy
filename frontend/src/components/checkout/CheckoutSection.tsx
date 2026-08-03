'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { usePayments } from '@/hooks/usePayments'
import { useEnrollments } from '@/hooks/useEnrollments'
import { formatCoursePrice, parseCoursePrice } from '@/lib/catalogue-courses'
import { publicFetcher } from '@/lib/fetcher'
import type { CourseDetail } from '@/types/course'

export default function CheckoutSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  const { purchaseCourse, getErrorMessage } = usePayments()
  const { mutate: mutateEnrollments } = useEnrollments()

  const courseId = searchParams.get('courseId')
  const slug = searchParams.get('slug')

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      const callback = `/checkout?courseId=${courseId ?? ''}&slug=${slug ?? ''}`
      router.replace(`/login?callbackUrl=${encodeURIComponent(callback)}`)
    }
  }, [status, router, courseId, slug])

  useEffect(() => {
    if (!slug) {
      setLoadingCourse(false)
      return
    }
    let cancelled = false
    setLoadingCourse(true)
    publicFetcher<CourseDetail>(`/courses/${slug}`)
      .then((data) => {
        if (!cancelled) setCourse(data)
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load course details.')
      })
      .finally(() => {
        if (!cancelled) setLoadingCourse(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const price = course ? parseCoursePrice(course.price) : 0
  const total = price

  const handlePay = async () => {
    setError('')
    if (!courseId) {
      setError('Missing course. Go back and select a course.')
      return
    }

    setSubmitting(true)
    try {
      await purchaseCourse({
        courseId,
        paymentMethod: 'Card',
        transactionId: `TXN${Date.now()}`,
      })
      await mutateEnrollments()
      router.push(`/dashboard/courses/${slug ?? course?.slug ?? ''}`)
    } catch (err) {
      setError(getErrorMessage(err) ?? 'Payment failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingCourse) {
    return (
      <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
        <p className="text-[#474348]">Loading checkout…</p>
      </section>
    )
  }

  if (!course || !courseId) {
    return (
      <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
        <p className="text-[#474348]">No course selected for checkout.</p>
        <Link href="/courses" className="mt-4 inline-block text-primary hover:underline">
          Browse courses
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
      <nav className="mb-12 flex items-center text-lg">
        <Link href={`/courses/${course.slug}`} className="text-[#DA55B5] transition-colors hover:text-[#B83092]">
          {course.title}
        </Link>
        <span className="mx-4">
          <ChevronRight className="h-4 w-4 text-heading" />
        </span>
        <span className="line-clamp-1 text-heading">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.95fr]">
        <div className="order-2 rounded-[16px] border-[2px] border-[#E5E7EB] bg-white p-5 md:px-6 md:py-7 lg:order-1">
          <h2 className="text-xl font-medium text-heading md:text-[24px]">Payment Details</h2>
          <p className="mt-2 text-lg text-[#474348]">
            Complete your purchase to enroll in this course
          </p>

          {error ? <p className="mt-4 text-sm text-secondary">{error}</p> : null}

          <form
            className="mt-7 space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              void handlePay()
            }}
          >
            <div>
              <label htmlFor="cardHolderName" className="mb-2 block text-lg font-medium text-body">
                Card Holder Name
              </label>
              <input
                id="cardHolderName"
                type="text"
                required
                className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
              />
            </div>

            <div>
              <label htmlFor="emailAddress" className="mb-2 block text-lg font-medium text-body">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                required
                className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
              />
            </div>

            <div>
              <label htmlFor="cardNumber" className="mb-2 block text-lg font-medium text-body">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                required
                className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="mb-2 block text-lg font-medium text-body">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  required
                  className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
                />
              </div>

              <div>
                <label htmlFor="cvv" className="mb-2 block text-lg font-medium text-body">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  required
                  className="h-[48px] w-full rounded-lg border-[2px] border-[#E5E7EB] bg-white px-4 text-[#252A64] outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white hover:translate-y-0 hover:bg-[#232A59] hover:from-[#232A59] hover:to-[#232A59] disabled:opacity-60"
            >
              {submitting ? 'Processing…' : `Pay ${formatCoursePrice(course.price)}`}
            </Button>
          </form>
        </div>

        <aside className="order-1 rounded-[16px] border-[2px] border-[#E5E7EB] bg-white p-5 md:p-7 lg:order-2 lg:self-start">
          <h3 className="text-xl font-medium text-heading md:text-[24px]">Payment Summary</h3>
          <p className="mt-2 text-lg text-[#474348]">Here is the breakdown of your payment</p>

          <div className="mt-7 space-y-5">
            <div className="flex items-center justify-between text-lg text-body">
              <span>Course</span>
              <span className="max-w-[60%] truncate text-right">{course.title}</span>
            </div>
            <div className="flex items-center justify-between text-lg text-body">
              <span>Subtotal</span>
              <span>{formatCoursePrice(course.price)}</span>
            </div>
            <div className="h-px w-full bg-[#E5E7EB]" />
            <div className="flex items-center justify-between text-lg font-semibold text-heading">
              <span>Total</span>
              <span>{formatCoursePrice(String(total))}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
