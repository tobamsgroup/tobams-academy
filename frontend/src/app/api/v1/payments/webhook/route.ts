import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { failCheckoutSession, syncCheckoutSession } from '@/lib/checkout'
import { logger } from '@/lib/logger'

/**
 * POST /api/v1/payments/webhook — Stripe events. The signature is verified against the raw
 * body with STRIPE_WEBHOOK_SECRET before anything is trusted.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers.get('stripe-signature')
  if (!secret || !signature) {
    return NextResponse.json({ message: 'Webhook not configured' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(await req.text(), signature, secret)
  } catch (error) {
    logger.warn('Rejected Stripe webhook', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await syncCheckoutSession(event.data.object.id, { session: event.data.object })
        break
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired':
        await failCheckoutSession(event.data.object.id)
        break
    }
  } catch (error) {
    // 500 makes Stripe retry the event later.
    logger.error('Stripe webhook handling failed', {
      type: event.type,
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ message: 'Webhook handling failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
