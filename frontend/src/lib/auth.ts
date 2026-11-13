import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { comparePassword } from './auth-helpers'
import { logger } from './logger'
import { signTokens } from './jwt'
import { authConfig } from './auth.config'
import { normalizeEmail } from './email'

class InvalidCredentials extends CredentialsSignin {
  code = 'invalid_credentials'
}

class EmailNotVerified extends CredentialsSignin {
  code = 'email_not_verified'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (!rawEmail || !password) throw new InvalidCredentials()
        // Ignore case and stray spaces (phone keyboards capitalise, autofill adds spaces).
        const email = normalizeEmail(rawEmail)

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new InvalidCredentials()

        const match = await comparePassword(password, user.passwordHash)
        if (!match) throw new InvalidCredentials()

        if (!user.emailVerified) throw new EmailNotVerified()

        if (user.deactivatedAt) throw new InvalidCredentials()

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
