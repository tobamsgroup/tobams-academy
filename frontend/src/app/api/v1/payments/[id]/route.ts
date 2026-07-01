import { NextRequest } from 'next/server'
import { paymentDb } from '@/lib/prisma'
import { getAuthUser } from '@/lib/with-auth'
import { err, ok } from '@/lib/api-utils'
import { withRoute } from '@/lib/with-route'
import { decimalToNumber } from '@/lib/payment-utils'

export const GET = withRoute(
  '/api/v1/payments/[id]',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const authUser = getAuthUser(req)
    if (!authUser) return err('Unauthorized', 401)

    const { id } = (await params) ?? {}
    if (!id) return err('Payment id is required')

    const payment = await paymentDb.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            modules: { include: { lessons: { select: { duration: true } } } },
          },
        },
      },
    })

    if (!payment || payment.userId !== authUser.id) return err('Payment not found', 404)

    const duration = payment.course.modules.reduce((total, module) => {
      const moduleDuration = module.lessons.reduce(
        (sum, lesson) => sum + (lesson.duration ?? 0),
        0,
      )
      return total + moduleDuration
    }, 0)

    return ok({
      paymentDetails: {
        courseId: payment.courseId,
        paymentDate: payment.createdAt.toISOString(),
        paymentMethod: payment.paymentMethod ?? 'Free Enrollment',
        transactionId: payment.transactionId,
        status: payment.status,
      },
      courseDetails: {
        courseTitle: payment.course.title,
        courseInstructor: payment.course.instructor.name,
        duration,
      },
      costOverview: {
        coursePrice: decimalToNumber(payment.course.price),
        totalAmount: decimalToNumber(payment.amount),
      },
    })
  },
)

export const DELETE = withRoute(
  '/api/v1/payments/[id]',
  async (req: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    const authUser = getAuthUser(req)
    if (!authUser) return err('Unauthorized', 401)

    const { id } = (await params) ?? {}
    if (!id) return err('Payment id is required')

    const payment = await paymentDb.findFirst({
      where: { id, userId: authUser.id },
    })
    if (!payment) return err('Payment not found', 404)

    await paymentDb.delete({ where: { id } })

    return ok(undefined, 'Payment Record Successfully Deleted')
  },
)
