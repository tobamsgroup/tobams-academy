'use client'

import { useEffect, useRef } from 'react'
import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

const PUBLIC_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/otp']
const PUBLIC_EXACT = new Set(['/', '/courses'])

function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true
  if (pathname === '/courses' || pathname.startsWith('/courses/')) return true
  if (PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true
  }
  return false
}

function hasValidSession(session: ReturnType<typeof useSession>['data']) {
  return !!session?.user && !!session.accessToken && session.error !== 'RefreshAccessTokenError'
}

export function AuthSessionGuard() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const signingOutRef = useRef(false)
  const interceptorInstalledRef = useRef(false)

  useEffect(() => {
    if (interceptorInstalledRef.current) return
    interceptorInstalledRef.current = true

    axios.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          (error as { response?: { status?: number } }).response?.status === 401
        ) {
          void signOut({ redirect: false }).then(() => {
            const callbackUrl = window.location.pathname || '/dashboard'
            window.location.assign(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
          })
        }
        return Promise.reject(error)
      },
    )
  }, [])

  useEffect(() => {
    if (status !== 'authenticated') return
    if (hasValidSession(session)) return
    if (signingOutRef.current) return

    signingOutRef.current = true
    const callbackUrl = isPublicPath(pathname) ? pathname : pathname || '/dashboard'

    void signOut({ redirect: false }).then(() => {
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    })
  }, [session, status, pathname, router])

  return null
}
