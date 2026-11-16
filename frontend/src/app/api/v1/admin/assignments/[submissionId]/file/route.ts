import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { isAdminRequest } from '@/lib/admin-auth'
import { attachmentDisposition } from '@/lib/assignments'

/** GET /api/v1/admin/assignments/:submissionId/file — downloads a learner's submitted file. */
export const GET = withRoute(
  '/api/v1/admin/assignments/[submissionId]/file',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    if (!isAdminRequest(req)) return err('Unauthorized', 401)
    const { submissionId } = (await params) ?? {}
    if (!submissionId) return err('submissionId is required')

    const row = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      select: { fileName: true, mimeType: true, data: true },
    })
    if (!row) return err('Submission not found', 404)

    return new NextResponse(new Uint8Array(row.data), {
      headers: {
        'Content-Type': row.mimeType,
        'Content-Disposition': attachmentDisposition(row.fileName),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  },
)
