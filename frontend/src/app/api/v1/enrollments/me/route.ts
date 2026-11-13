import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { enrollmentInclude, toEnrollmentSummary } from '@/lib/enrollment-utils'

const MAX_LIMIT = 100

/**
 * GET /api/v1/enrollments/me?search=&tab=all|inProgress|completed&sort=recent|active|az&page=&limit=
 * The user's enrollments as EnrollmentSummary (with the course summary the dashboard renders).
 * Returns every enrollment (up to 100) unless `limit` is given, because the dashboard uses
 * this list to know which courses the user owns.
 */
export const GET = withRoute('/api/v1/enrollments/me', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') ?? String(MAX_LIMIT), 10) || MAX_LIMIT))
  const search = searchParams.get('search')?.trim().toLowerCase() ?? ''
  const tab = searchParams.get('tab') ?? 'all'
  const sort = searchParams.get('sort') ?? 'recent'

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: enrollmentInclude,
    orderBy: { enrolledAt: 'desc' },
  })

  // Lesson totals per course, counted in the database rather than loading every lesson.
  const moduleCounts = await prisma.courseModule.findMany({
    where: { courseId: { in: [...new Set(enrollments.map((e) => e.courseId))] } },
    select: { courseId: true, _count: { select: { lessons: true } } },
  })
  const lessonTotals = new Map<string, number>()
  for (const m of moduleCounts) {
    lessonTotals.set(m.courseId, (lessonTotals.get(m.courseId) ?? 0) + m._count.lessons)
  }

  let summaries = enrollments.map((e) => toEnrollmentSummary(e, lessonTotals.get(e.courseId) ?? 0))

  summaries = summaries.filter((s) => {
    if (search && !s.course.title.toLowerCase().includes(search)) return false
    if (tab === 'inProgress') return s.progress < 100
    if (tab === 'completed') return s.progress >= 100
    return true
  })

  if (sort === 'active') {
    summaries.sort((a, b) => b.progress - a.progress)
  } else if (sort === 'az') {
    summaries.sort((a, b) => a.course.title.localeCompare(b.course.title))
  } else {
    // 'recent': most recently studied first, falling back to enrollment date
    summaries.sort(
      (a, b) =>
        new Date(b.lastAccessedAt ?? b.enrolledAt).getTime() - new Date(a.lastAccessedAt ?? a.enrolledAt).getTime(),
    )
  }

  const total = summaries.length
  const data = summaries.slice((page - 1) * limit, page * limit)

  return ok(data, 'Success', {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  })
})
