import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { syncCheckoutSession } from '@/lib/checkout'

/**
 * GET /api/v1/checkout/session?id=cs_...
 * Status of the user's Stripe Checkout Session. Also completes the order if Stripe reports
 * it paid but the webhook hasn't arrived yet, so the success page never waits on it.
 */
export const GET = withRoute('/api/v1/checkout/session', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const sessionId = req.nextUrl.searchParams.get('id')
  if (!sessionId) return err('id is required')

  const status = await syncCheckoutSession(sessionId, { userId: user.id })
  if (!status) return err('Checkout not found', 404)
  return ok(status)
})
