import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api-utils";
import { withRoute } from "@/lib/with-route";
import { getAuthUser } from "@/lib/with-auth";

export const GET = withRoute(
  "/api/v1/payments/[paymentId]",
  async (
    req: NextRequest,
    { params }: { params?: Promise<Record<string, string>> },
  ) => {
    const user = getAuthUser(req);

    if (!user) return err("Unauthorized", 401);

    const { paymentId } = (await params) ?? {};

    if (!paymentId) return err("paymentId is required");

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },

      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },

            modules: {
              include: {
                lessons: {
                  select: {
                    duration: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!payment || payment.userId !== user.id)
      return err("Payment not found", 404);

    const duration = payment.course.modules.reduce(
      (total: number, module: { lessons: { duration: number | null }[] }) => {
        const moduleDuration = module.lessons.reduce(
          (sum, lesson) => sum + (lesson.duration ?? 0),
          0,
        );

        return total + moduleDuration;
      },
      0,
    );

    return ok({
      paymentDetails: {
        courseId: payment.courseId,
        paymentDate: payment.createdAt,
        paymentMethod: payment.paymentMethod ?? "Free Enrollment",
        transactionId: payment.transactionId ?? null,
        status: payment.status,
      },

      courseDetails: {
        courseTitle: payment.course.title,
        courseInstructor: payment.course.instructor.name,
        duration,
      },

      costOverview: {
        coursePrice: payment.course.price ?? 0,
        totalAmount: payment.amount,
      },
    });
  },
);

export const DELETE = withRoute(
  "/api/v1/payments/[paymentId]",
  async (
    req: NextRequest,
    { params }: { params?: Promise<Record<string, string>> },
  ) => {
    const user = getAuthUser(req);

    if (!user) return err("Unauthorized", 401);

    const { paymentId } = (await params) ?? {};

    if (!paymentId) return err("paymentId is required");

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: user.id,
      },
    });

    if (!payment) return err("Payment not found", 404);

    await prisma.payment.delete({
      where: {
        id: paymentId,
      },
    });

    return ok();
  },
);
