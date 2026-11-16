import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { attachmentDisposition, loadAssignmentForLearner } from '@/lib/assignments'

/**
 * GET /api/v1/lessons/:lessonId/submission/file
 * Downloads the learner's own uploaded work.
 */
export const GET = withRoute(
  '/api/v1/lessons/[lessonId]/submission/file',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)
    const { lessonId } = (await params) ?? {}
    if (!lessonId) return err('lessonId is required')

    const ctx = await loadAssignmentForLearner(user.id, lessonId)
    if (ctx.error) return ctx.error

    const row = await prisma.assignmentSubmission.findUnique({
      where: { enrollmentId_lessonId: { enrollmentId: ctx.enrollment.id, lessonId } },
      select: { fileName: true, mimeType: true, data: true },
    })
    if (!row) return err('No submission yet', 404)

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
