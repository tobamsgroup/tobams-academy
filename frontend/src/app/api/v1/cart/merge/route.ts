import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { addToCart, getCartView } from '@/lib/cart'

/**
 * POST /api/v1/cart/merge  { courseIds }
 * Moves a guest (browser) cart into the user's account after sign-in. Courses the user
 * already owns or that no longer exist are skipped.
 */
export const POST = withRoute('/api/v1/cart/merge', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  const courseIds = body?.courseIds
  if (!Array.isArray(courseIds) || courseIds.some((id) => typeof id !== 'string')) {
    return err('courseIds must be an array of strings')
  }

  for (const courseId of [...new Set(courseIds as string[])].slice(0, 50)) {
    await addToCart(user.id, courseId)
  }
  return ok(await getCartView(user.id))
})
