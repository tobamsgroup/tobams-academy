import { NextRequest } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { getAuthUser } from '@/lib/with-auth'

/** Admin access: the ADMIN_API_KEY header (for scripts/back office) or a signed-in ADMIN. */
export function isAdminRequest(req: NextRequest): boolean {
  const expected = process.env.ADMIN_API_KEY
  const provided = req.headers.get('x-admin-api-key')
  if (expected && provided) {
    const a = Buffer.from(provided)
    const b = Buffer.from(expected)
    if (a.length === b.length && timingSafeEqual(a, b)) return true
  }
  return getAuthUser(req)?.role === 'ADMIN'
}
