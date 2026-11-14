import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { comparePassword } from './auth-helpers'
import { logger } from './logger'
import { signTokens } from './jwt'
import { authConfig } from './auth.config'
import { normalizeEmail } from './email'
import { issueSignInCode, verifySignInCode } from './two-factor'

class InvalidCredentials extends CredentialsSignin {
  code = 'invalid_credentials'
}

class EmailNotVerified extends CredentialsSignin {
  code = 'email_not_verified'
}

/** Password was right; 2FA is on, so a code was emailed and must be entered. */
class TwoFactorRequired extends CredentialsSignin {
  code = 'two_factor_required'
}

class InvalidTwoFactorCode extends CredentialsSignin {
  code = 'invalid_otp'
}

/** No valid code (expired, or too many wrong attempts): the user must request a new one. */
class TwoFactorCodeExpired extends CredentialsSignin {
  code = 'otp_expired'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'Verification code', type: 'text' },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        const otp = (credentials?.otp as string | undefined)?.trim() || undefined
        if (!rawEmail || !password) throw new InvalidCredentials()
        // Ignore case and stray spaces (phone keyboards capitalise, autofill adds spaces).
        const email = normalizeEmail(rawEmail)

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new InvalidCredentials()

        const match = await comparePassword(password, user.passwordHash)
        if (!match) throw new InvalidCredentials()

        if (!user.emailVerified) throw new EmailNotVerified()

        // Two-factor: the password alone isn't enough; require the emailed code.
        if (user.twoFactorEnabled) {
          if (!otp) {
            await issueSignInCode(user)
            throw new TwoFactorRequired()
          }
          const check = await verifySignInCode(user, otp)
          if (check === 'invalid') throw new InvalidTwoFactorCode()
          if (check === 'expired') throw new TwoFactorCodeExpired()
        }

        // Signing in reactivates a deactivated account (as the deactivation email promises).
        if (user.deactivatedAt || !user.isActive) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isActive: true, deactivatedAt: null, deactivationReason: null },
          })
        }

        let tokens: ReturnType<typeof signTokens>
        try {
          tokens = signTokens(user.id, user.email, user.role)
        } catch (error) {
          // e.g. JWT_SECRET / JWT_REFRESH_SECRET missing in this environment
          logger.error('Sign-in failed: could not create API tokens', {
            error: error instanceof Error ? error.message : String(error),
          })
          throw error
        }
        const { accessToken, refreshToken } = tokens

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken,
          refreshToken,
        }
      },
    }),
  ],
})
