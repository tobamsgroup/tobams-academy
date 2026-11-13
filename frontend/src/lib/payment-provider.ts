export type PaymentProvider = 'stripe' | 'simulated'

/** Checkout session ids created by the simulated provider. */
export const SIMULATED_SESSION_PREFIX = 'sim_'

/**
 * Which payment provider paid checkouts use.
 *
 * PAYMENT_PROVIDER=simulated replaces Stripe with an in-app test payment page so the whole
 * paid flow can be exercised before Stripe is integrated. It hands out paid courses without
 * taking money, so it is refused when NODE_ENV=production unless
 * ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION=true (e.g. a private staging deploy).
 */
export function getPaymentProvider(): PaymentProvider {
  if (process.env.PAYMENT_PROVIDER !== 'simulated') return 'stripe'
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION !== 'true') {
    return 'stripe'
  }
  return 'simulated'
}

export function isSimulatedSession(sessionId: string): boolean {
  return sessionId.startsWith(SIMULATED_SESSION_PREFIX)
}
