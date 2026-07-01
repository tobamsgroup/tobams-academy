'use client'

import { useSession } from 'next-auth/react'

export function useAuthSession() {
  const { data: session, status, update } = useSession()

  const isAuthenticated =
    status === 'authenticated' &&
    !!session?.accessToken &&
    session.error !== 'RefreshAccessTokenError'

  return {
    session,
    status,
    accessToken: isAuthenticated ? session?.accessToken : undefined,
    isAuthenticated,
    isLoading: status === 'loading',
    update,
  }
}
