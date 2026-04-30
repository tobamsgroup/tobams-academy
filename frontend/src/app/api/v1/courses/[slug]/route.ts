import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const GET = withRoute('/api/v1/courses/[slug]', async (
  _req: NextRequest,
  { params }: { params?: Promise<Record<string, string>> },
) => {
  const { slug } = (await params) ?? {}
  if (!slug) return err('Slug is required')

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      instructor: { select: { id: true, name: true, email: true } },
      modules: {
        orderBy: { position: 'asc' },
        include: { lessons: { orderBy: { position: 'asc' } } },
      },
    },
  })

  if (!course) return err('Course not found', 404)

  return ok(course)
})
