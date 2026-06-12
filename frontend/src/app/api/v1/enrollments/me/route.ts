import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

export const GET = withRoute('/api/v1/enrollments/me', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '6', 10)))
  const search = searchParams.get('search')?.trim().toLowerCase() ?? ''
  const tab = searchParams.get('tab') ?? 'all'
  const sort = searchParams.get('sort') ?? 'recent'
  const skip = (page - 1) * limit

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        select: { id: true, title: true, thumbnail: true, modules: { include: { lessons: { select: { id: true, duration: true } } } } },
      },
      lessonProgress: { select: { lessonId: true } },
    },
    orderBy: { enrolledAt: 'desc' },
  })

  const enriched = enrollments.map((e) => {
    const allLessons = e.course.modules.flatMap((m) => m.lessons)
    const totalLessons = allLessons.length
    const completedCount = e.lessonProgress.length
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    return {
      enrollmentId: e.id,
      courseId: e.courseId,
      courseTitle: e.course.title,
      courseThumbnail: e.course.thumbnail,
      progress,
      lastAccessedAt: e.lastAccessedAt,
      completedAt: e.completedAt,
    }
  })

  // Filter
  let filtered = enriched.filter((e) => {
    if (search && !e.courseTitle.toLowerCase().includes(search)) return false
    if (tab === 'inProgress') return e.progress < 100
    if (tab === 'completed') return e.progress >= 100
    return true
  })

  // Sort
  if (sort === 'active') {
    filtered = filtered.sort((a, b) => b.progress - a.progress)
  } else if (sort === 'az') {
    filtered = filtered.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle))
  }
  // 'recent' is already sorted by enrolledAt desc from the query

  const total = filtered.length
  const data = filtered.slice(skip, skip + limit)

  return ok(data, 'Success', {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  })
})
