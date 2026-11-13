import type { NextAuthConfig } from 'next-auth'
import {
  getAccessTokenExpiryTimestamp,
  refreshAuthTokens,
} from '@/lib/auth-token'

export const authConfig: NextAuthConfig = {
  providers: [],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as {
          id: string
          role: string
          accessToken: string
          refreshToken: string
        }
        token.id = u.id ?? user.id
        token.role = u.role
        token.accessToken = u.accessToken
        token.refreshToken = u.refreshToken
        token.accessTokenExpires = getAccessTokenExpiryTimestamp()
        token.error = undefined
        return token
      }

      const expiresAt = token.accessTokenExpires as number | undefined
      if (token.accessToken && expiresAt && Date.now() < expiresAt) {
        return token
      }

      const refreshToken = token.refreshToken as string | undefined
      if (!refreshToken) {
        return { ...token, accessToken: undefined, error: 'RefreshAccessTokenError' as const }
      }

      const refreshed = await refreshAuthTokens(refreshToken)
      if (!refreshed) {
        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
          error: 'RefreshAccessTokenError' as const,
        }
      }

      return {
        ...token,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        accessTokenExpires: refreshed.accessTokenExpires,
        error: undefined,
      }
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as 'LEARNER' | 'INSTRUCTOR' | 'ADMIN'
      session.accessToken = token.error ? undefined : (token.accessToken as string | undefined)
      session.error = token.error as 'RefreshAccessTokenError' | undefined
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
