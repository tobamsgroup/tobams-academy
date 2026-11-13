import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { getCartView } from '@/lib/cart'
import { CheckoutError, startCheckout } from '@/lib/checkout'
import { PaymentsNotConfiguredError } from '@/lib/stripe'
import { logger } from '@/lib/logger'

/**
 * POST /api/v1/checkout  { courseIds? }
 * Checks out the given courses ("Buy now"), or the whole cart when courseIds is omitted.
 * Returns { status: 'enrolled' } for a free total, or { status: 'redirect', url } to Stripe.
 */
export const POST = withRoute('/api/v1/checkout', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  let courseIds: string[]
  if (body?.courseIds !== undefined) {
    if (!Array.isArray(body.courseIds) || body.courseIds.some((id: unknown) => typeof id !== 'string')) {
      return err('courseIds must be an array of strings')
    }
    courseIds = body.courseIds
  } else {
    courseIds = (await getCartView(user.id)).items.map((i) => i.id)
  }

  try {
    return ok(await startCheckout({ id: user.id, email: user.email }, courseIds))
  } catch (error) {
    if (error instanceof CheckoutError) return err(error.message, error.status)
    if (error instanceof PaymentsNotConfiguredError) {
      logger.error(error.message)
      return err('Online payments are not available right now. Please try again later.', 503)
    }
    throw error
  }
})
