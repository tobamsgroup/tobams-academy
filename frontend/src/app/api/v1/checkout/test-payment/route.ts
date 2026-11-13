import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { completeSimulatedSession } from '@/lib/checkout'
import { getPaymentProvider } from '@/lib/payment-provider'

/**
 * POST /api/v1/checkout/test-payment  { sessionId, outcome: 'paid' | 'failed' }
 * Settles a simulated checkout from the test payment page. Only exists while
 * PAYMENT_PROVIDER=simulated; returns 404 otherwise.
 */
export const POST = withRoute('/api/v1/checkout/test-payment', async (req: NextRequest) => {
  if (getPaymentProvider() !== 'simulated') return err('Not found', 404)

  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  const sessionId = body?.sessionId
  const outcome = body?.outcome
  if (typeof sessionId !== 'string' || !sessionId) return err('sessionId is required')
  if (outcome !== 'paid' && outcome !== 'failed') return err("outcome must be 'paid' or 'failed'")

  const status = await completeSimulatedSession(sessionId, user.id, outcome)
  if (!status) return err('Checkout not found', 404)
  return ok(status)
})
