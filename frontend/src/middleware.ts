import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

const PUBLIC_PATHS = ['/', '/courses', '/login', '/register', '/forgot-password', '/verify-email']
const ADMIN_PREFIX = '/admin'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const isLoggedIn = !!session

  // Auth pages (/login, /register, etc.) remain reachable while logged in (no redirect to /dashboard).

  // Protect admin routes
  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.url))
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Protect all other non-public routes
  // Dashboard is temporarily public (no login required) — tighten when auth is required.
  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/courses')) ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/')
  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
