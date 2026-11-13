'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { getCourseThumbnail } from '@/lib/dashboard-courses'
import { formatGbp } from '@/lib/format-money'

export default function CartSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, total, isLoading, error, remove } = useCart()
  const [removing, setRemoving] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const cancelled = searchParams.get('checkout') === 'cancelled'

  const handleRemove = async (courseId: string) => {
    setActionError('')
    setRemoving(courseId)
    try {
      await remove(courseId)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not remove the course.')
    } finally {
      setRemoving(null)
    }
  }

  const checkoutButtonLabel = total === 0 ? 'Proceed to Enroll' : 'Proceed to Checkout'

  return (
    <section className="mx-auto w-full max-w-[1312px] px-6 py-10">
      <nav className="mb-12 text-lg flex items-center">
        <Link href="/courses" className="hover:text-white/80 text-[#DA55B5] transition-colors">
          Courses
        </Link>
        <span className="mx-4"><ChevronRight className="w-4 h-4 text-heading" /></span>
        <span className="text-heading line-clamp-1">Cart</span>
      </nav>

      {cancelled ? (
        <div className="mb-6 rounded-lg bg-[#FFF7CC] p-4 text-sm text-[#7A6500]">
          Payment was cancelled. Your courses are still in your cart.
        </div>
      ) : null}
      {actionError ? <div className="mb-6 rounded-lg bg-secondary/10 p-4 text-sm text-secondary">{actionError}</div> : null}

      {error ? (
        <p className="text-[#474348]">We couldn&apos;t load your cart. Please refresh the page.</p>
      ) : isLoading ? (
        <div className="space-y-4" aria-busy="true">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-[123px] animate-pulse rounded-xl bg-[#EEF0F6]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[16px] border border-[#E5E7EB] p-10 text-center">
          <h2 className="text-[24px] font-medium text-[#252A64]">Your cart is empty</h2>
          <p className="mt-2 text-lg text-[#696969]">Find a course you&apos;d like to take and add it here.</p>
          <Link
            href="/courses"
            className="mt-6 inline-flex rounded-lg bg-[#303869] px-6 py-3 font-medium text-white hover:bg-[#232A59]"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col xl:gap-[206px] gap-6 lg:flex-row lg:items-start">
            <div className="order-2 flex-1 lg:order-1">
              <div className="mb-4 items-center justify-between hidden md:flex">
                <h2 className="text-[24px] font-medium text-[#252A64]">
                  {items.length} {items.length === 1 ? 'Course' : 'Courses'} in Cart
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-[44px] md:py-6 border-b items-start justify-start border-[#E5E7EB]"
                  >
                    <Link
                      href={`/courses/${item.slug}`}
                      className="relative md:h-[123px] md:w-[232px] h-[200px] w-full shrink-0 overflow-hidden rounded-xl bg-[#F2E8FA]"
                    >
                      <Image
                        src={getCourseThumbnail(item, index)}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 232px"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <span className="inline-flex rounded bg-[#EEF0F6] px-3 py-1 text-primary">{item.category}</span>
                      <Link href={`/courses/${item.slug}`}>
                        <h3 className="mt-2 text-[20px] font-medium text-heading hover:underline">{item.title}</h3>
                      </Link>
                      <p className="mt-1 line-clamp-2 text-lg text-[#696969]">{item.description}</p>
                    </div>

                    <div className="flex items-center md:justify-start justify-between w-full md:w-auto gap-4">
                      <div className="text-right">
                        <p className="text-[18px] font-semibold text-[#252A64]">{formatGbp(item.amount)}</p>
                        {item.originalAmount ? (
                          <p className="text-sm text-[#696969] line-through">{formatGbp(item.originalAmount)}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleRemove(item.id)}
                        disabled={removing === item.id}
                        className="text-[#696969] hover:text-[#252A64] disabled:opacity-40"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="order-1 w-full lg:order-2 lg:w-[347px]">
              <h3 className="md:mb-5 mb-[14px] md:text-[24px] text-lg font-medium text-body">Total</h3>
              <p className="text-[40px] font-bold leading-none text-heading">{formatGbp(total)}</p>
              {total === 0 ? (
                <p className="mt-3 text-sm text-[#474348]">All courses in your cart are free. No payment needed.</p>
              ) : null}

              <Button
                type="button"
                onClick={() => router.push('/checkout')}
                className="mt-6 hidden w-full rounded-lg bg-[#303869] px-6 py-3 text-lg font-medium text-white hover:translate-y-0 hover:bg-[#232A59] hover:from-[#232A59] hover:to-[#232A59] lg:block"
              >
                {checkoutButtonLabel}
              </Button>
            </aside>
          </div>
          <Button
            type="button"
            onClick={() => router.push('/checkout')}
            className="mt-6 w-full rounded-lg bg-[#303869] px-6 py-3 font-medium text-white hover:translate-y-0 hover:bg-[#232A59] hover:from-[#232A59] hover:to-[#232A59] lg:hidden"
          >
            {checkoutButtonLabel}
          </Button>
        </>
      )}
    </section>
  )
}
