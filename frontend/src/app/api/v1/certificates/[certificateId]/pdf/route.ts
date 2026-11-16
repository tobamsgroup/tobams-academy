import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { isAdminRequest } from '@/lib/admin-auth'
import { attachmentDisposition } from '@/lib/assignments'
import { certificateFileName, renderCertificate } from '@/lib/certificates'

/** GET /api/v1/certificates/:certificateId/pdf — the certificate as a PDF (owner or admin). */
export const GET = withRoute(
  '/api/v1/certificates/[certificateId]/pdf',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const { certificateId } = (await params) ?? {}
    if (!certificateId) return err('certificateId is required')

    const admin = isAdminRequest(req)
    const user = getAuthUser(req)
    if (!user && !admin) return err('Unauthorized', 401)

    const cert = await prisma.certificate.findUnique({ where: { id: certificateId } })
    if (!cert || (!admin && cert.userId !== user?.id)) return err('Certificate not found', 404)

    const pdf = await renderCertificate(cert)
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': attachmentDisposition(certificateFileName(cert.courseTitle)),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  },
)
