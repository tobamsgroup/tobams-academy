import { prisma } from '@/lib/prisma'
import type { DashboardOverview } from '@/types/dashboard'

const DAY_MS = 24 * 60 * 60 * 1000

/** Monday 00:00 UTC of the week containing `date`. */
export function startOfUtcWeek(date: Date): Date {
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const sinceMonday = (day.getUTCDay() + 6) % 7
  return new Date(day.getTime() - sinceMonday * DAY_MS)
}

/** Seconds of tracked learning time, overall and per course. */
export async function getTrackedSeconds(userId: string) {
  const rows = await prisma.learningActivity.groupBy({
    by: ['courseId'],
    where: { userId },
    _sum: { seconds: true },
  })
  const byCourse = new Map(rows.map((r) => [r.courseId, r._sum.seconds ?? 0]))
  const total = rows.reduce((sum, r) => sum + (r._sum.seconds ?? 0), 0)
  return { total, byCourse }
}

/** Everything the dashboard home needs, computed from real enrollment, progress and activity data. */
export async function getDashboardOverview(userId: string, now = new Date()): Promise<DashboardOverview> {
  const thisWeek = startOfUtcWeek(now)
  const lastWeek = new Date(thisWeek.getTime() - 7 * DAY_MS)
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))

  const [enrollments, tracked, weekRows, yearRows] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      orderBy: [{ lastAccessedAt: { sort: 'desc', nulls: 'last' } }, { enrolledAt: 'desc' }],
      include: {
        lessonProgress: { select: { lessonId: true } },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            modules: {
              orderBy: { position: 'asc' },
              select: {
                position: true,
                title: true,
                lessons: { orderBy: { position: 'asc' }, select: { id: true, title: true } },
              },
            },
          },
        },
      },
    }),
    getTrackedSeconds(userId),
    prisma.learningActivity.findMany({
      where: { userId, day: { gte: lastWeek } },
      select: { day: true, seconds: true },
    }),
    prisma.learningActivity.findMany({
      where: { userId, day: { gte: yearStart } },
      select: { day: true, seconds: true },
    }),
  ])

  let thisWeekSeconds = 0
  let lastWeekSeconds = 0
  for (const row of weekRows) {
    if (row.day >= thisWeek) thisWeekSeconds += row.seconds
    else lastWeekSeconds += row.seconds
  }

  const monthlySeconds = Array.from({ length: 12 }, () => 0)
  for (const row of yearRows) monthlySeconds[row.day.getUTCMonth()] += row.seconds

  const courses = enrollments.map((enrollment) => {
    const done = new Set(enrollment.lessonProgress.map((lp) => lp.lessonId))
    const lessons = enrollment.course.modules.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, modulePosition: m.position, moduleTitle: m.title })),
    )
    const completed = lessons.filter((l) => done.has(l.id)).length
    const isCompleted = Boolean(enrollment.completedAt) || (lessons.length > 0 && completed === lessons.length)
    const next = lessons.find((l) => !done.has(l.id))
    return {
      courseId: enrollment.course.id,
      title: enrollment.course.title,
      slug: enrollment.course.slug,
      progress: isCompleted ? 100 : lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
      isCompleted,
      lastAccessedAt: (enrollment.lastAccessedAt ?? enrollment.enrolledAt).toISOString(),
      timeSpentSeconds: tracked.byCourse.get(enrollment.course.id) ?? 0,
      nextLesson: next
        ? { id: next.id, title: next.title, moduleNumber: next.modulePosition, moduleTitle: next.moduleTitle }
        : null,
    }
  })

  const inProgress = courses.filter((c) => !c.isCompleted)

  return {
    continueLearning: inProgress.slice(0, 4),
    insights: {
      thisWeekSeconds,
      lastWeekSeconds,
      totalSeconds: tracked.total,
      coursesInProgress: inProgress.length,
      coursesEnrolled: courses.length,
      coursesCompleted: courses.length - inProgress.length,
    },
    engagement: { year: now.getUTCFullYear(), monthlySeconds },
  }
}
