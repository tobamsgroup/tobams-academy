export interface CartCourse {
  id: string
  slug: string
  title: string
  description: string
  thumbnail: string | null
  category: string
  /** Amount charged in GBP (early-bird applied); 0 for free courses. */
  amount: number
  /** Standard price when an early-bird discount applies, for strike-through display. */
  originalAmount: number | null
}

export interface CartView {
  items: CartCourse[]
  /** Sum of item amounts in GBP. */
  total: number
}

export type CheckoutResult =
  | { status: 'enrolled'; courses: Array<{ id: string; slug: string; title: string }> }
  | { status: 'redirect'; url: string }

export interface CheckoutSessionStatus {
  status: 'paid' | 'pending' | 'failed'
  courses: Array<{ id: string; slug: string; title: string }>
  total: number
}
