import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { isAdminRequest } from '@/lib/admin-auth'
import { logger } from '@/lib/logger'
import { adminEnroll, MAX_ADMIN_ENROLLMENTS, parseTargets } from '@/lib/admin-enroll'

const DEFAULT_COURSE_SLUG = 'time-intelligence-masterclass'

/**
 * POST /api/v1/admin/enrollments
 * Headers: x-admin-api-key: <ADMIN_API_KEY>
 * Body:    { "emails": ["a@x.com", { "email": "b@y.com", "name": "Bola Ade" }], "courseSlug"?: "..." }
 *
 * Enrolls each person without payment (default course: Time Intelligence Masterclass).
 * New emails get an account and a temporary password by email; existing accounts are
 * enrolled (or have their access renewed) and notified. Returns a result per email.
 */
export const POST = withRoute('/api/v1/admin/enrollments', async (req: NextRequest) => {
  if (!isAdminRequest(req)) return err('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  if (!Array.isArray(body?.emails) || body.emails.length === 0) {
    return err('emails must be a non-empty array of email addresses')
  }
  if (body.emails.length > MAX_ADMIN_ENROLLMENTS) {
    return err(`Send at most ${MAX_ADMIN_ENROLLMENTS} emails per request`)
  }

  const courseSlug = typeof body.courseSlug === 'string' && body.courseSlug ? body.courseSlug : DEFAULT_COURSE_SLUG
  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, status: 'PUBLISHED' },
    select: { id: true, slug: true, title: true },
  })
  if (!course) return err(`Course "${courseSlug}" not found`, 404)

  const { targets, invalid } = parseTargets(body.emails)

  // Sequential on purpose: each person gets an email; this keeps the SMTP provider happy.
  const results = [...invalid]
  for (const target of targets) {
    results.push(await adminEnroll(course, target))
  }

  const summary = {
    created: results.filter((r) => r.status === 'created').length,
    enrolled: results.filter((r) => r.status === 'enrolled').length,
    renewed: results.filter((r) => r.status === 'renewed').length,
    failed: results.filter((r) => r.status === 'failed').length,
  }
  logger.info('Admin enrollment', { course: course.slug, ...summary })

  return ok({ course: { slug: course.slug, title: course.title }, summary, results })
})
