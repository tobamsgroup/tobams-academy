import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { getCartView } from '@/lib/cart'

/** GET /api/v1/cart — the signed-in user's cart with server-computed prices. */
export const GET = withRoute('/api/v1/cart', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)
  return ok(await getCartView(user.id))
})
