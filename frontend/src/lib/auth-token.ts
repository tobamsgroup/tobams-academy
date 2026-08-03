import { SignJWT, jwtVerify } from 'jose'

type TokenPayload = {
  sub: string
  email: string
  role: string
}

function getSecret(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} is not configured`)
  return new TextEncoder().encode(value)
}

function getAccessTokenMaxAgeMs() {
  const expiry = process.env.ACCESS_TOKEN_EXPIRY ?? '7h'
  const match = expiry.match(/^(\d+)([smhd])$/)
  if (!match) return 7 * 60 * 60 * 1000
  const amount = Number(match[1])
  const unit = match[2]
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  }
  return amount * (multipliers[unit] ?? 3_600_000)
}

export function getAccessTokenExpiryTimestamp() {
  return Date.now() + getAccessTokenMaxAgeMs()
}

export async function verifyRefreshTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getSecret(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET')
    const { payload } = await jwtVerify(token, secret)
    if (typeof payload.sub !== 'string') return null
    if (typeof payload.email !== 'string') return null
    if (typeof payload.role !== 'string') return null
    return { sub: payload.sub, email: payload.email, role: payload.role }
  } catch {
    return null
  }
}

export async function signAccessTokenEdge(payload: TokenPayload) {
  const secret = getSecret(process.env.JWT_SECRET, 'JWT_SECRET')
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY ?? '7h'

  return new SignJWT({
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function refreshAuthTokens(refreshToken: string) {
  const payload = await verifyRefreshTokenEdge(refreshToken)
  if (!payload) return null

  const accessToken = await signAccessTokenEdge(payload)
  return {
    accessToken,
    refreshToken,
    accessTokenExpires: getAccessTokenExpiryTimestamp(),
  }
}
