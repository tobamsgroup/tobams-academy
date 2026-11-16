import { NextRequest } from 'next/server'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { findCertificateByNumber } from '@/lib/certificates'

/**
 * GET /api/v1/certificates/verify/:number — public check that a certificate is genuine.
 * Returns only what is printed on the certificate.
 */
export const GET = withRoute(
  '/api/v1/certificates/verify/[number]',
  async (_req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const { number } = (await params) ?? {}
    const cert = number ? await findCertificateByNumber(number) : null
    if (!cert) return err('No certificate found with that number', 404)
    return ok(cert)
  },
)
