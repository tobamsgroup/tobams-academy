import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { prisma } from '@/lib/prisma'
import { err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { EXPIRED_MESSAGE, isAccessActive } from '@/lib/enrollment-access'

/** Private course files live outside /public so only enrolled learners can read them. */
const CONTENT_ROOT = resolve(process.cwd(), 'content', 'courses')

/**
 * GET /api/v1/lessons/:lessonId/document
 * Streams the PDF behind a PDF lesson, for learners enrolled in the lesson's course.
 */
export const GET = withRoute(
  '/api/v1/lessons/[lessonId]/document',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const user = getAuthUser(req)
    if (!user) return err('Unauthorized', 401)

    const { lessonId } = (await params) ?? {}
    if (!lessonId) return err('lessonId is required')

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { kind: true, contentKey: true, module: { select: { courseId: true } } },
    })
    if (!lesson || (lesson.kind !== 'PDF' && lesson.kind !== 'SLIDES') || !lesson.contentKey) {
      return err('Document not found', 404)
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: lesson.module.courseId } },
      select: { id: true, expiresAt: true },
    })
    if (!enrollment) return err('Not enrolled in this course', 403)
    if (!isAccessActive(enrollment)) return err(EXPIRED_MESSAGE, 403)

    // contentKey is a path relative to CONTENT_ROOT; refuse anything that escapes it.
    const filePath = resolve(CONTENT_ROOT, lesson.contentKey)
    if (!filePath.startsWith(CONTENT_ROOT + sep) || !filePath.endsWith('.pdf')) {
      return err('Document not found', 404)
    }

    let file: Buffer
    try {
      file = await readFile(filePath)
    } catch {
      return err('Document not found', 404)
    }

    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        // Private: per-user authorised content must not be cached by shared caches.
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  },
)
