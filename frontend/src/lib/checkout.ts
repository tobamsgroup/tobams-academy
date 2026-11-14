import { randomUUID } from 'node:crypto'
import type Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { notify } from '@/lib/notifications'
import { getStripe } from '@/lib/stripe'
import { getPaymentProvider, isSimulatedSession, SIMULATED_SESSION_PREFIX } from '@/lib/payment-provider'
import { toMinorUnits } from '@/lib/pricing'
import { CART_COURSE_SELECT, enrolledCourseIds, removeFromCart, toCartView } from '@/lib/cart'
import type { CheckoutResult, CheckoutSessionStatus } from '@/types/cart'
import { grantAccess } from '@/lib/enrollment-access'

export class CheckoutError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

const MAX_ITEMS = 20

function clientUrl() {
  return (process.env.CLIENT_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

async function notifyEnrolled(userId: string, courses: Array<{ title: string }>) {
  for (const course of courses) {
    await notify(userId, {
      type: 'ENROLLMENT',
      title: 'Enrollment confirmed',
      message: `You're now enrolled in "${course.title}". Head to My Courses to start learning.`,
      category: 'enrollmentConfirm',
    })
  }
}

/**
 * Start checkout for the given courses. A free total enrolls immediately; otherwise a Stripe
 * Checkout Session is created with PENDING payments that the webhook completes.
 * Amounts are always computed here from the database, never taken from the client.
 */
export async function startCheckout(
  user: { id: string; email: string },
  requestedIds: string[],
): Promise<CheckoutResult> {
  const courseIds = [...new Set(requestedIds)]
  if (courseIds.length === 0) throw new CheckoutError('Your cart is empty', 400)
  if (courseIds.length > MAX_ITEMS) throw new CheckoutError(`You can check out up to ${MAX_ITEMS} courses at once`, 400)

  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds }, status: 'PUBLISHED' },
    select: CART_COURSE_SELECT,
  })
  if (courses.length !== courseIds.length) throw new CheckoutError('One or more courses are unavailable', 404)

  const owned = await enrolledCourseIds(user.id, courseIds)
  if (owned.size > 0) {
    const titles = courses.filter((c) => owned.has(c.id)).map((c) => `"${c.title}"`).join(', ')
    throw new CheckoutError(`You're already enrolled in ${titles}`, 409)
  }

  const { items, total } = toCartView(courses)

  if (total === 0) {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.payment.create({
          data: {
            userId: user.id,
            courseId: item.id,
            amount: 0,
            status: 'COMPLETED',
            reference: `FREE-${randomUUID()}`,
            paymentMethod: 'Free Enrollment',
          },
        })
      }
      await grantAccess(tx, user.id, items.map((item) => item.id))
    })
    await removeFromCart(user.id, courseIds)
    await notifyEnrolled(user.id, items)
    return { status: 'enrolled', courses: items.map(({ id, slug, title }) => ({ id, slug, title })) }
  }

  const session =
    getPaymentProvider() === 'simulated'
      ? createSimulatedSession()
      : await createStripeSession(user, items.filter((i) => i.amount > 0))

  // One PENDING payment per course (free ones included, at £0) so the whole order is
  // fulfilled together when payment is confirmed.
  await prisma.payment.createMany({
    data: items.map((item) => ({
      userId: user.id,
      courseId: item.id,
      amount: item.amount,
      status: 'PENDING' as const,
      reference: `PAY-${randomUUID()}`,
      paymentMethod: session.paymentMethod,
      checkoutSessionId: session.id,
    })),
  })

  return { status: 'redirect', url: session.url }
}

/** Test-mode stand-in for a Stripe session: the learner "pays" on /checkout/test-payment. */
function createSimulatedSession() {
  const id = `${SIMULATED_SESSION_PREFIX}${randomUUID()}`
  return {
    id,
    url: `${clientUrl()}/checkout/test-payment?session_id=${encodeURIComponent(id)}`,
    paymentMethod: 'Test payment',
  }
}

async function createStripeSession(
  user: { id: string; email: string },
  paidItems: Array<{ id: string; title: string; amount: number }>,
) {
  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { userId: user.id },
    line_items: paidItems.map((item) => ({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: toMinorUnits(item.amount),
        product_data: { name: item.title, metadata: { courseId: item.id } },
      },
    })),
    success_url: `${clientUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl()}/cart?checkout=cancelled`,
  })
  if (!session.url) throw new CheckoutError('Could not start payment. Please try again.', 502)
  return { id: session.id, url: session.url, paymentMethod: 'Card' }
}

/**
 * Apply the outcome of a Stripe Checkout Session. Safe to call repeatedly and concurrently
 * (webhook and success page): only the first call that claims the PENDING payments sends
 * notifications; enrollment creation is idempotent.
 */
export async function syncCheckoutSession(
  sessionId: string,
  options: { userId?: string; session?: Stripe.Checkout.Session } = {},
): Promise<CheckoutSessionStatus | null> {
  const payments = await prisma.payment.findMany({
    where: { checkoutSessionId: sessionId },
    include: { course: { select: { id: true, slug: true, title: true } } },
  })
  if (payments.length === 0) return null
  const userId = payments[0].userId
  if (options.userId && payments.some((p) => p.userId !== options.userId)) return null

  const courses = payments.map((p) => p.course)
  const total = payments.reduce((sum, p) => sum + Number(p.amount), 0)

  // Simulated sessions have no Stripe record: their outcome is whatever the test payment
  // page recorded (see completeSimulatedSession).
  if (!options.session && isSimulatedSession(sessionId)) {
    const status = payments.every((p) => p.status === 'COMPLETED')
      ? 'paid'
      : payments.some((p) => p.status === 'FAILED')
        ? 'failed'
        : 'pending'
    return { status, courses, total }
  }

  const session = options.session ?? (await getStripe().checkout.sessions.retrieve(sessionId))

  if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') {
    const transactionId =
      typeof session.payment_intent === 'string' ? session.payment_intent : (session.payment_intent?.id ?? null)

    const claimed = await prisma.$transaction(async (tx) => {
      const { count } = await tx.payment.updateMany({
        where: { checkoutSessionId: sessionId, status: 'PENDING' },
        data: { status: 'COMPLETED', transactionId },
      })
      // Grant (or renew) access only when this call claimed the payments, so webhook retries
      // don't keep pushing the expiry date forward.
      if (count > 0) await grantAccess(tx, userId, courses.map((c) => c.id))
      return count
    })

    if (claimed > 0) {
      await removeFromCart(userId, courses.map((c) => c.id))
      await notifyEnrolled(userId, courses)
      await notify(userId, {
        type: 'PAYMENT',
        title: 'Payment received',
        message: `We received your payment of £${total.toFixed(2)} for ${courses.map((c) => `"${c.title}"`).join(', ')}.`,
      })
    }
    return { status: 'paid', courses, total }
  }

  if (session.status === 'expired') {
    await prisma.payment.updateMany({
      where: { checkoutSessionId: sessionId, status: 'PENDING' },
      data: { status: 'FAILED' },
    })
    return { status: 'failed', courses, total }
  }

  return { status: payments.every((p) => p.status === 'FAILED') ? 'failed' : 'pending', courses, total }
}

/** Mark a session's PENDING payments as FAILED (async payment failure). */
export async function failCheckoutSession(sessionId: string): Promise<void> {
  await prisma.payment.updateMany({
    where: { checkoutSessionId: sessionId, status: 'PENDING' },
    data: { status: 'FAILED' },
  })
}

/**
 * Outcome chosen on the test payment page. Runs the same fulfilment as a real Stripe
 * confirmation, so the paid flow behaves exactly as it will with Stripe.
 */
export async function completeSimulatedSession(
  sessionId: string,
  userId: string,
  outcome: 'paid' | 'failed',
): Promise<CheckoutSessionStatus | null> {
  if (!isSimulatedSession(sessionId)) return null
  const owned = await prisma.payment.findFirst({ where: { checkoutSessionId: sessionId, userId }, select: { id: true } })
  if (!owned) return null

  if (outcome === 'failed') {
    await failCheckoutSession(sessionId)
    return syncCheckoutSession(sessionId, { userId })
  }

  const confirmed = {
    id: sessionId,
    payment_status: 'paid',
    status: 'complete',
    payment_intent: `sim_pi_${randomUUID()}`,
  } as unknown as Stripe.Checkout.Session
  return syncCheckoutSession(sessionId, { userId, session: confirmed })
}
