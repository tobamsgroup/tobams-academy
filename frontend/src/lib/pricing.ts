import { decimalToNumber } from '@/lib/payment-utils'

/**
 * What a learner is charged for a course, in pounds. Mirrors getCoursePricing() on the
 * course page: the early-bird price applies when it is set and lower than the standard price.
 */
export function chargeAmount(course: { price: unknown; earlyBirdPrice?: unknown }): number {
  const standard = decimalToNumber(course.price)
  const early = decimalToNumber(course.earlyBirdPrice ?? null)
  const amount = early > 0 && early < standard ? early : standard
  return Math.max(0, Math.round(amount * 100) / 100)
}

/** Pounds → pence for Stripe. */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100)
}
