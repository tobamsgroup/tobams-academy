import jwt from 'jsonwebtoken'

interface JwtPayload {
  sub: string
  email: string
  role: string
}

export function signTokens(userId: string, email: string, role: string) {
  const payload = { sub: userId, email, role }
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRY ?? '7h') as jwt.SignOptions['expiresIn'],
  })
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRY ?? '7d') as jwt.SignOptions['expiresIn'],
  })
  return { accessToken, refreshToken }
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  } catch {
    return null
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload
  } catch {
    return null
  }
}
