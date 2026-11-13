import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { addToCart, getCartView } from '@/lib/cart'

/** POST /api/v1/cart/items  { courseId } — add a course to the cart. */
export const POST = withRoute('/api/v1/cart/items', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  const courseId = body?.courseId
  if (typeof courseId !== 'string' || !courseId) return err('courseId is required')

  const result = await addToCart(user.id, courseId)
  if (result === 'not-found') return err('Course not found', 404)
  if (result === 'enrolled') return err('You are already enrolled in this course', 409)

  return ok(await getCartView(user.id), result === 'added' ? 'Added to cart' : 'Already in your cart')
})
