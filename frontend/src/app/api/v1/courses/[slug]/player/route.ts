import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'

export const GET = withRoute('/api/v1/courses/[slug]/player', async (
  req: NextRequest,
  { params }: { params?: Promise<Record<string, string>> },
) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const { slug } = (await params) ?? {}
  if (!slug) return err('Slug is required')

  const course = await prisma.course.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      modules: {
        orderBy: { position: 'asc' },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: 'asc' },
            select: { id: true, title: true, position: true, duration: true, kind: true, contentKey: true, contentUrl: true },
          },
        },
      },
    },
  })

  if (!course) return err('Course not found', 404)

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  })
  if (!enrollment) return err('Not enrolled in this course', 403)

  return ok({ courseId: course.id, courseTitle: course.title, modules: course.modules })
})
