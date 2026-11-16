import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { getAuthUser } from '@/lib/with-auth'
import { certificateVerifyUrl } from '@/lib/certificates'

/** GET /api/v1/certificates — the signed-in learner's certificates, newest first. */
export const GET = withRoute('/api/v1/certificates', async (req: NextRequest) => {
  const user = getAuthUser(req)
  if (!user) return err('Unauthorized', 401)

  const rows = await prisma.certificate.findMany({
    where: { userId: user.id },
    orderBy: { issuedAt: 'desc' },
    select: {
      id: true,
      certificateNumber: true,
      courseId: true,
      courseTitle: true,
      learnerName: true,
      issuedAt: true,
      course: { select: { slug: true } },
    },
  })

  return ok(
    rows.map(({ course, issuedAt, ...r }) => ({
      ...r,
      courseSlug: course.slug,
      issuedAt: issuedAt.toISOString(),
      verifyUrl: certificateVerifyUrl(r.certificateNumber),
    })),
  )
})
