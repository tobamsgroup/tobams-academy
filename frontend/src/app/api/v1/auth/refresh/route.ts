import { NextRequest } from 'next/server'
import { verifyRefreshToken, signTokens } from '@/lib/jwt'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const POST = withRoute('/api/v1/auth/refresh', async (req: NextRequest) => {
  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Bearer ')) return err('Refresh token required', 401)

  const token = header.slice(7)
  const payload = verifyRefreshToken(token)
  if (!payload) return err('Invalid or expired refresh token', 401)

  const tokens = signTokens(payload.sub, payload.email, payload.role)

  return ok(tokens, 'Tokens refreshed')
})
