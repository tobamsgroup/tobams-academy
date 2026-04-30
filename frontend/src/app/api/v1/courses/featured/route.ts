import { prisma } from '@/lib/prisma'
import { ok } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

const COURSE_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  thumbnail: true,
  level: true,
  price: true,
  isFeatured: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  instructor: { select: { id: true, name: true } },
  _count: { select: { modules: true } },
}

export const GET = withRoute('/api/v1/courses/featured', async () => {
  const data = await prisma.course.findMany({
    where: { isFeatured: true, status: 'PUBLISHED' },
    select: COURSE_LIST_SELECT,
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
  return ok(data)
})
