import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    error?: 'RefreshAccessTokenError'
    user: {
      id: string
      role: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN'
    } & DefaultSession['user']
  }

  interface User {
    role: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN'
    accessToken: string
    refreshToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: 'RefreshAccessTokenError'
  }
}
