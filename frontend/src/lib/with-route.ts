import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'
import { err } from './api-utils'

type RouteContext = { params?: Promise<Record<string, string>> }
type Handler = (req: NextRequest, ctx: RouteContext) => Promise<NextResponse>

export function withRoute(name: string, handler: Handler): Handler {
  return async (req: NextRequest, ctx: RouteContext) => {
    const start = Date.now()
    const label = `${req.method} ${name}`

    try {
      const res = await handler(req, ctx)
      const ms = Date.now() - start
      const { status } = res

      if (status >= 500) {
        logger.error(`${label} → ${status}`, { route: name, method: req.method, status, ms })
      } else if (status >= 400) {
        logger.warn(`${label} → ${status}`, { route: name, method: req.method, status, ms })
      } else {
        logger.info(`${label} → ${status}`, { route: name, method: req.method, status, ms })
      }

      return res
    } catch (error) {
      const ms = Date.now() - start
      logger.error(`${label} → 500 (unhandled exception)`, {
        route: name,
        method: req.method,
        ms,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      return err('Internal server error', 500)
    }
  }
}
