import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
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

export const GET = withRoute('/api/v1/courses', async (req: NextRequest) => {
  const { searchParams } = req.nextUrl

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)))
  const search = searchParams.get('search') ?? undefined
  const categoryId = searchParams.get('categoryId') ?? undefined
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { status: 'PUBLISHED' }
  if (categoryId) where.categoryId = categoryId
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where,
      select: COURSE_LIST_SELECT,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.course.count({ where }),
  ])

  return ok(data, 'Success', {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
})
