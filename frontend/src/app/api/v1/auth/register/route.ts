import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { hashPassword, hashToken } from '@/lib/auth-helpers'
import { sendVerificationEmail } from '@/lib/mail'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const POST = withRoute('/api/v1/auth/register', async (req: NextRequest) => {
  const body = await req.json()
  const { name, email, password } = body ?? {}

  if (!name || typeof name !== 'string' || name.trim().length === 0)
    return err('Name is required')
  if (!email || typeof email !== 'string' || !email.includes('@'))
    return err('Valid email is required')
  if (!password || typeof password !== 'string' || password.length < 8)
    return err('Password must be at least 8 characters')

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return err('Email already in use', 409)

  const passwordHash = await hashPassword(password)
  const rawToken = crypto.randomBytes(32).toString('hex')
  const verifyTokenHash = hashToken(rawToken)

  const user = await prisma.user.create({
    data: { email, name: name.trim(), passwordHash, verifyTokenHash },
  })

  console.log({verifyTokenHash})

  // await sendVerificationEmail(user.email, user.name, rawToken)

  return ok(undefined, 'Registration successful. Please verify your email.')
})
