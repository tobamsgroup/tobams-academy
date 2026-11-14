import { NextRequest } from 'next/server'
import { randomUUID } from 'node:crypto'
import type { Prisma } from '@prisma/client'
import { paymentDb, prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { created, err, ok } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { notify } from '@/lib/notifications'
import { chargeAmount } from '@/lib/pricing'
import { decimalToNumber, uiDateRangeToApiRange, uiStatusToApiStatus } from '@/lib/payment-utils'
import { grantAccess, isAccessActive } from '@/lib/enrollment-access'

export const POST = withRoute('/api/v1/payments', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = (await req.json()) as Record<string, unknown>
  const { courseId } = body ?? {}

  if (!courseId || typeof courseId !== 'string') return err('courseId is required')

  const course = await prisma.course.findFirst({
    where: { id: courseId, status: 'PUBLISHED' },
  })
  if (!course) return err('Course not found', 404)

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: authUser.id, courseId } },
  })
  if (isAccessActive(existingEnrollment)) return err('You are already enrolled in this course', 409)

  // Paid courses must go through Stripe checkout (POST /api/v1/checkout); this endpoint
  // only records free enrollments, otherwise anyone could enroll without paying.
  if (chargeAmount(course) > 0) return err('This course requires payment. Please use checkout.', 402)

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        userId: authUser.id,
        courseId,
        amount: 0,
        status: 'COMPLETED',
        reference: `FREE-${randomUUID()}`,
        paymentMethod: 'Free Enrollment',
      },
    })

    // Enroll, or renew expired access (progress is kept).
    await grantAccess(tx, authUser.id, [courseId])

    // No LessonProgress rows here: a row means the lesson is completed
    // (completedAt is non-nullable), so seeding rows would mark the course as done.

    return { paymentId: payment.id, courseId }
  })

  await notify(authUser.id, {
    type: 'ENROLLMENT',
    title: 'Enrollment confirmed',
    message: `You're now enrolled in "${course.title}". Head to My Courses to start learning.`,
    category: 'enrollmentConfirm',
  })
  return created(result, 'Course enrollment successful')
})

export const GET = withRoute('/api/v1/payments', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const { searchParams } = req.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 12) || 12))
  const courseName = searchParams.get('courseName')?.trim()
  const statusParam = searchParams.get('status') ?? 'all'
  const rangeParam = searchParams.get('range') ?? 'all'

  const apiStatus = statusParam !== 'all' ? uiStatusToApiStatus(statusParam) : undefined
  const apiRange = rangeParam !== 'all' ? uiDateRangeToApiRange(rangeParam) : undefined

  const now = new Date()
  const fromDate = new Date()
  if (apiRange) {
    const days =
      apiRange === 'LAST_7_DAYS'
        ? 7
        : apiRange === 'LAST_30_DAYS'
          ? 30
          : apiRange === 'LAST_60_DAYS'
            ? 60
            : 90
    fromDate.setDate(now.getDate() - days)
  }

  const where: Prisma.PaymentWhereInput = {
    userId: authUser.id,
    ...(apiStatus ? { status: apiStatus } : {}),
    ...(apiRange
      ? {
          createdAt: {
            gte: fromDate,
            lte: now,
          },
        }
      : {}),
    ...(courseName
      ? {
          course: {
            title: { contains: courseName, mode: 'insensitive' },
          },
        }
      : {}),
  }

  const [rows, total] = await Promise.all([
    paymentDb.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        course: { select: { id: true, title: true } },
      },
    }),
    paymentDb.count({ where }),
  ])

  return ok(
    rows.map((row) => ({
      id: row.id,
      amount: decimalToNumber(row.amount),
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      course: row.course,
    })),
    'Success',
    {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  )
})
