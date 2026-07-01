import { NextRequest } from 'next/server'
import { randomUUID } from 'node:crypto'
import type { Prisma } from '@prisma/client'
import { paymentDb, prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { created, err, ok } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { decimalToNumber, uiDateRangeToApiRange, uiStatusToApiStatus } from '@/lib/payment-utils'

export const POST = withRoute('/api/v1/payments', async (req: NextRequest) => {
  const authUser = getAuthUser(req)
  if (!authUser) return err('Unauthorized', 401)

  const body = (await req.json()) as Record<string, unknown>
  const { courseId, paymentMethod, transactionId } = body ?? {}

  if (!courseId || typeof courseId !== 'string') return err('courseId is required')

  const course = await prisma.course.findFirst({
    where: { id: courseId, status: 'PUBLISHED' },
    include: { modules: { include: { lessons: { select: { id: true } } } } },
  })
  if (!course) return err('Course not found', 404)

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: authUser.id, courseId } },
  })
  if (existingEnrollment) return err('You are already enrolled in this course', 409)

  const amount = decimalToNumber(course.price)
  const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
  const isFree = amount <= 0

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        userId: authUser.id,
        courseId,
        amount,
        status: 'COMPLETED',
        reference: isFree ? `FREE-${randomUUID()}` : `PAY-${randomUUID()}`,
        paymentMethod: isFree
          ? 'Free Enrollment'
          : typeof paymentMethod === 'string'
            ? paymentMethod
            : 'Card',
        transactionId: typeof transactionId === 'string' ? transactionId : null,
      },
    })

    const enrollment = await tx.enrollment.create({
      data: {
        userId: authUser.id,
        courseId,
        lastAccessedAt: new Date(),
      },
    })

    if (lessonIds.length > 0) {
      await tx.lessonProgress.createMany({
        data: lessonIds.map((lessonId) => ({
          enrollmentId: enrollment.id,
          lessonId,
        })),
      })
    }

    return { paymentId: payment.id, courseId: enrollment.courseId }
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
