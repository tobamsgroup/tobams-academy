import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { previewCart } from '@/lib/cart'

/** POST /api/v1/cart/preview  { courseIds } — prices for a guest cart (no sign-in needed). */
export const POST = withRoute('/api/v1/cart/preview', async (req: NextRequest) => {
  const body = await req.json().catch(() => null)
  const courseIds = body?.courseIds
  if (!Array.isArray(courseIds) || courseIds.some((id) => typeof id !== 'string')) {
    return err('courseIds must be an array of strings')
  }
  return ok(await previewCart(courseIds as string[]))
})
