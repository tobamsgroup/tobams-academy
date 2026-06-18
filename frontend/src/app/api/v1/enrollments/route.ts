import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { err, created } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { enrollmentInclude, toEnrollmentSummary } from '@/lib/enrollment-utils'

export const POST = withRoute('/api/v1/enrollments', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = (await req.json()) as Record<string, unknown>
  const { courseId } = body ?? {}

  if (!courseId || typeof courseId !== 'string')
    return err('courseId is required')

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: authUser.id, courseId } },
    include: enrollmentInclude,
  })
  if (existing) return err('Already enrolled in this course', 409)

  const course = await prisma.course.findFirst({
    where: { id: courseId, status: 'PUBLISHED' },
    include: { modules: { include: { lessons: { select: { id: true } } } } },
  })
  if (!course) return err('Course not found', 404)

  const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))

  const enrollment = await prisma.$transaction(async (tx) => {
    const createdEnrollment = await tx.enrollment.create({
      data: {
        userId: authUser.id,
        courseId,
        lastAccessedAt: new Date(),
      },
    })

    if (lessonIds.length > 0) {
      await tx.lessonProgress.createMany({
        data: lessonIds.map((lessonId) => ({
          enrollmentId: createdEnrollment.id,
          lessonId,
        })),
      })
    }

    return tx.enrollment.findUniqueOrThrow({
      where: { id: createdEnrollment.id },
      include: enrollmentInclude,
    })
  })

  return created(toEnrollmentSummary(enrollment, lessonIds.length), 'Enrolled successfully')
})
