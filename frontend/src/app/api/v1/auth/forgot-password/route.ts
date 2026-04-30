import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/auth-helpers'
import { sendPasswordResetEmail } from '@/lib/mail'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

const SAFE_MSG = 'If that email exists, a reset link has been sent'

export const POST = withRoute('/api/v1/auth/forgot-password', async (req: NextRequest) => {
  const body = await req.json()
  const { email } = body ?? {}

  if (!email || typeof email !== 'string') return err('Email is required')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return ok(undefined, SAFE_MSG)

  const rawToken = crypto.randomBytes(32).toString('hex')
  const resetTokenHash = hashToken(rawToken)
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { resetTokenHash, resetTokenExpiry },
  })

  await sendPasswordResetEmail(user.email, user.name, rawToken)

  return ok(undefined, SAFE_MSG)
})
