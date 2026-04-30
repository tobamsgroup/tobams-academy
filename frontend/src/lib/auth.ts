import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { comparePassword } from './auth-helpers'
import { signTokens } from './jwt'
import { authConfig } from './auth.config'

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
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (!email || !password) throw new InvalidCredentials()

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new InvalidCredentials()

        const match = await comparePassword(password, user.passwordHash)
        if (!match) throw new InvalidCredentials()

        if (!user.emailVerified) throw new EmailNotVerified()

        const { accessToken } = signTokens(user.id, user.email, user.role)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken,
        }
      },
    }),
  ],
})
