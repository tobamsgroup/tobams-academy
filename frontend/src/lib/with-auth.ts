import { NextRequest } from 'next/server'
import { verifyAccessToken } from './jwt'

export interface AuthUser {
  id: string
  email: string
  role: string
}

export function getAuthUser(req: NextRequest): AuthUser | null {
  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Bearer ')) return null
  const token = header.slice(7)
  const payload = verifyAccessToken(token)
  if (!payload) return null
  return { id: payload.sub, email: payload.email, role: payload.role }
}
