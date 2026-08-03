import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

const PUBLIC_EXACT = new Set(['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/otp'])
const PUBLIC_PREFIXES = ['/courses']
const AUTH_PAGES = new Set(['/login', '/register', '/forgot-password', '/reset-password', '/otp'])
const ADMIN_PREFIX = '/admin'

const isPublicPath = (pathname: string) =>
  PUBLIC_EXACT.has(pathname) || PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const isLoggedIn =
    !!session?.user &&
    !!session.accessToken &&
    session.error !== 'RefreshAccessTokenError'

  if (isLoggedIn && AUTH_PAGES.has(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.url))
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  if (!isPublicPath(pathname) && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
