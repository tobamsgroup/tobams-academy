import { prisma } from '@/lib/prisma'
import { ok } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'

export const GET = withRoute('/api/v1/categories', async () => {
  const data = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return ok(data)
})
