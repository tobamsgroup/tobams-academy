import { prisma } from '@/lib/prisma'
import { decimalToNumber } from '@/lib/payment-utils'
import { chargeAmount } from '@/lib/pricing'
import { activeEnrollmentWhere } from '@/lib/enrollment-access'
import type { CartCourse, CartView } from '@/types/cart'

export const CART_COURSE_SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  thumbnail: true,
  price: true,
  earlyBirdPrice: true,
  status: true,
  category: { select: { name: true } },
} as const

type CartCourseRow = {
  id: string
  slug: string
  title: string
  description: string
  thumbnail: string | null
  price: unknown
  earlyBirdPrice: unknown
  category: { name: string }
}

export function toCartCourse(course: CartCourseRow): CartCourse {
  const amount = chargeAmount(course)
  const standard = decimalToNumber(course.price)
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    category: course.category.name,
    amount,
    originalAmount: standard > amount ? standard : null,
  }
}

export function toCartView(courses: CartCourseRow[]): CartView {
  const items = courses.map(toCartCourse)
  const total = Math.round(items.reduce((sum, i) => sum + i.amount, 0) * 100) / 100
  return { items, total }
}

/** Ids of the given courses the user currently has access to. */
export async function enrolledCourseIds(userId: string, courseIds: string[]): Promise<Set<string>> {
  if (courseIds.length === 0) return new Set()
  const rows = await prisma.enrollment.findMany({
    // Only active access counts as owned: expired courses can be bought again.
    where: { userId, courseId: { in: courseIds }, ...activeEnrollmentWhere() },
    select: { courseId: true },
  })
  return new Set(rows.map((r) => r.courseId))
}

/**
 * The user's cart. Courses they have since enrolled in, or that are no longer published,
 * are dropped from the cart here so it never offers something they can't buy.
 */
export async function getCartView(userId: string): Promise<CartView> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { orderBy: { addedAt: 'asc' }, include: { course: { select: CART_COURSE_SELECT } } } },
  })
  if (!cart) return { items: [], total: 0 }

  const owned = await enrolledCourseIds(userId, cart.items.map((i) => i.courseId))
  const stale = cart.items.filter((i) => owned.has(i.courseId) || i.course.status !== 'PUBLISHED')
  if (stale.length > 0) {
    await prisma.cartItem.deleteMany({ where: { id: { in: stale.map((i) => i.id) } } })
  }

  const staleIds = new Set(stale.map((i) => i.id))
  return toCartView(cart.items.filter((i) => !staleIds.has(i.id)).map((i) => i.course))
}

export type AddToCartResult = 'added' | 'already-in-cart' | 'enrolled' | 'not-found'

export async function addToCart(userId: string, courseId: string): Promise<AddToCartResult> {
  const course = await prisma.course.findFirst({ where: { id: courseId, status: 'PUBLISHED' }, select: { id: true } })
  if (!course) return 'not-found'
  if ((await enrolledCourseIds(userId, [courseId])).size > 0) return 'enrolled'

  const cart = await prisma.cart.upsert({ where: { userId }, update: {}, create: { userId } })
  const existing = await prisma.cartItem.findUnique({ where: { cartId_courseId: { cartId: cart.id, courseId } } })
  if (existing) return 'already-in-cart'

  await prisma.cartItem.create({ data: { cartId: cart.id, courseId } })
  return 'added'
}

export async function removeFromCart(userId: string, courseIds: string[]): Promise<void> {
  if (courseIds.length === 0) return
  await prisma.cartItem.deleteMany({ where: { cart: { userId }, courseId: { in: courseIds } } })
}

/** Course details for a guest cart (course ids kept in the browser). Unknown ids are ignored. */
export async function previewCart(courseIds: string[]): Promise<CartView> {
  const unique = [...new Set(courseIds)].slice(0, 50)
  if (unique.length === 0) return { items: [], total: 0 }
  const courses = await prisma.course.findMany({
    where: { id: { in: unique }, status: 'PUBLISHED' },
    select: CART_COURSE_SELECT,
  })
  const byId = new Map(courses.map((c) => [c.id, c]))
  return toCartView(unique.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])))
}
