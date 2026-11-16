import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { isAdminRequest } from '@/lib/admin-auth'

const DEFAULT_COURSE_SLUG = 'time-intelligence-masterclass'

/**
 * GET /api/v1/admin/assignments?courseSlug=...&week=2
 * Headers: x-admin-api-key: <ADMIN_API_KEY>   (or a signed-in ADMIN)
 *
 * Lists learners' assignment submissions (newest first), with a download path for each file.
 */
export const GET = withRoute('/api/v1/admin/assignments', async (req: NextRequest) => {
  if (!isAdminRequest(req)) return err('Unauthorized', 401)

  const search = req.nextUrl.searchParams
  const courseSlug = search.get('courseSlug') || DEFAULT_COURSE_SLUG
  const weekParam = search.get('week')
  const week = weekParam ? Number(weekParam) : undefined
  if (weekParam && (!Number.isInteger(week) || (week as number) < 1)) return err('week must be a positive number')

  const course = await prisma.course.findFirst({ where: { slug: courseSlug }, select: { id: true, title: true } })
  if (!course) return err(`Course "${courseSlug}" not found`, 404)

  const rows = await prisma.assignmentSubmission.findMany({
    where: { lesson: { module: { courseId: course.id, ...(week ? { position: week } : {}) } } },
    orderBy: { submittedAt: 'desc' },
    select: {
      id: true,
      fileName: true,
      mimeType: true,
      size: true,
      submittedAt: true,
      lesson: { select: { id: true, title: true, module: { select: { title: true, position: true } } } },
      enrollment: { select: { user: { select: { id: true, name: true, email: true } } } },
    },
  })

  const submissions = rows.map((r) => ({
    id: r.id,
    learner: r.enrollment.user,
    week: r.lesson.module.position,
    weekTitle: r.lesson.module.title,
    assignment: { lessonId: r.lesson.id, title: r.lesson.title },
    fileName: r.fileName,
    mimeType: r.mimeType,
    size: r.size,
    submittedAt: r.submittedAt.toISOString(),
    downloadPath: `/api/v1/admin/assignments/${r.id}/file`,
  }))

  return ok({ course: { slug: courseSlug, title: course.title }, count: submissions.length, submissions })
})
