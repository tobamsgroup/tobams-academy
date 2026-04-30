import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth-helpers'
import { signTokens } from '@/lib/jwt'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const POST = withRoute('/api/v1/auth/login', async (req: NextRequest) => {
  const body = await req.json()
  const { email, password } = body ?? {}

  if (!email || !password) return err('Email and password are required')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return err('Invalid credentials', 401)

  const match = await comparePassword(password, user.passwordHash)
  if (!match) return err('Invalid credentials', 401)

  if (!user.emailVerified)
    return err('Please verify your email before logging in', 401)

  const tokens = signTokens(user.id, user.email, user.role)

  return ok(
    {
      ...tokens,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    'Login successful',
  )
})
