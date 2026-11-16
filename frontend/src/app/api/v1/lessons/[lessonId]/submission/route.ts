import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { notify } from '@/lib/notifications'
import { recordLessonCompletion } from '@/lib/lesson-completion'
import {
  MAX_SUBMISSION_BYTES,
  SUBMISSION_EXTENSIONS,
  SUBMISSION_TYPES,
  fileExtension,
  loadAssignmentForLearner,
  sanitizeFileName,
  submissionMetaSelect,
  toSubmissionMeta,
} from '@/lib/assignments'

type Ctx = { params?: Promise<Record<string, string>> }

/**
 * GET /api/v1/lessons/:lessonId/submission
 * The learner's current submission for an assignment lesson (null if not submitted yet).
 */
export const GET = withRoute('/api/v1/lessons/[lessonId]/submission', async (req: NextRequest, { params }: Ctx) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)
  const { lessonId } = (await params) ?? {}
  if (!lessonId) return err('lessonId is required')

  const ctx = await loadAssignmentForLearner(user.id, lessonId)
  if (ctx.error) return ctx.error

  const row = await prisma.assignmentSubmission.findUnique({
    where: { enrollmentId_lessonId: { enrollmentId: ctx.enrollment.id, lessonId } },
    select: submissionMetaSelect,
  })
  return ok({ submission: row ? toSubmissionMeta(row) : null })
})

/**
 * POST /api/v1/lessons/:lessonId/submission   (multipart/form-data, field "file")
 * Uploads (or replaces) the learner's work and marks the assignment lesson complete.
 */
export const POST = withRoute('/api/v1/lessons/[lessonId]/submission', async (req: NextRequest, { params }: Ctx) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)
  const { lessonId } = (await params) ?? {}
  if (!lessonId) return err('lessonId is required')

  // Reject oversized bodies before reading them.
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > MAX_SUBMISSION_BYTES + 64 * 1024) return err('File is too large (maximum 10 MB)', 413)

  const ctx = await loadAssignmentForLearner(user.id, lessonId)
  if (ctx.error) return ctx.error

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!file || typeof file === 'string') return err('Attach your assignment as "file"')
  if (file.size === 0) return err('The file is empty')
  if (file.size > MAX_SUBMISSION_BYTES) return err('File is too large (maximum 10 MB)', 413)

  const fileName = sanitizeFileName(file.name)
  const mimeType = SUBMISSION_TYPES[fileExtension(fileName)]
  if (!mimeType) {
    return err(`Unsupported file type. Upload one of: ${SUBMISSION_EXTENSIONS.join(', ')}`, 415)
  }

  const data = new Uint8Array(await file.arrayBuffer())
  const where = { enrollmentId_lessonId: { enrollmentId: ctx.enrollment.id, lessonId } }
  const previous = await prisma.assignmentSubmission.findUnique({ where, select: { id: true } })
  const row = await prisma.assignmentSubmission.upsert({
    where,
    // Re-uploading replaces the file; submittedAt tracks the latest upload.
    update: { fileName, mimeType, size: file.size, data, submittedAt: new Date() },
    create: { enrollmentId: ctx.enrollment.id, lessonId, fileName, mimeType, size: file.size, data },
    select: submissionMetaSelect,
  })

  const completion = await recordLessonCompletion({
    userId: user.id,
    courseId: ctx.lesson.courseId,
    lessonId,
    enrollment: ctx.enrollment,
  })

  await notify(user.id, {
    type: 'COURSE_UPDATE',
    title: previous ? 'Assignment re-submitted' : 'Assignment submitted',
    message: `We've received your "${ctx.lesson.title}" submission (${fileName}).`,
    category: 'progressTracking',
  })

  return ok({ submission: toSubmissionMeta(row), ...completion }, previous ? 'Submission replaced' : 'Submitted')
})
