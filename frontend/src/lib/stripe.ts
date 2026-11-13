import Stripe from 'stripe'

let client: Stripe | null = null

export class PaymentsNotConfiguredError extends Error {
  constructor() {
    super('Payments are not configured (STRIPE_SECRET_KEY is missing)')
  }
}

/** Server-side Stripe client. Throws PaymentsNotConfiguredError when no secret key is set. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new PaymentsNotConfiguredError()
  client ??= new Stripe(key)
  return client
}
