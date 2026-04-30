import { ok } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const POST = withRoute('/api/v1/auth/logout', async () => {
  return ok(undefined, 'Logged out successfully')
})
