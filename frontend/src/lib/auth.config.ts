import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const u = user as unknown as { role: string; accessToken: string }
        token.role = u.role
        token.accessToken = u.accessToken
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as 'LEARNER' | 'INSTRUCTOR' | 'ADMIN'
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
