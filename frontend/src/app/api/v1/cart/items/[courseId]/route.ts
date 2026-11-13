import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { getCartView, removeFromCart } from '@/lib/cart'

/** DELETE /api/v1/cart/items/:courseId — remove a course from the cart. */
export const DELETE = withRoute(
  '/api/v1/cart/items/[courseId]',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)

    const { courseId } = (await params) ?? {}
    if (!courseId) return err('courseId is required')

    await removeFromCart(user.id, [courseId])
    return ok(await getCartView(user.id), 'Removed from cart')
  },
)
