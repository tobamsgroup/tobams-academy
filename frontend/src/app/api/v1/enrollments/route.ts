import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

export const POST = withRoute('/api/v1/enrollments', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  const courseId = body?.courseId as string | undefined
  if (!courseId) return err('courseId is required')

  const course = await prisma.course.findUnique({ where: { id: courseId, status: 'PUBLISHED' } })
  if (!course) return err('Course not found', 404)

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  })
  if (existing) {
    await prisma.enrollment.update({
      where: { id: existing.id },
      data: { lastAccessedAt: new Date() },
    })
    return ok({ id: existing.id, courseId, enrolledAt: existing.enrolledAt }, 'Already enrolled')
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId: user.id, courseId, lastAccessedAt: new Date() },
  })

  return created({ id: enrollment.id, courseId, enrolledAt: enrollment.enrolledAt }, 'Enrolled successfully')
})
