import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { ok, err, created } from "@/lib/api-utils";
import { withRoute } from "@/lib/with-route";
import { getAuthUser } from "@/lib/with-auth";
import { getDateRange, PaymentDateRange } from "@/lib/date-range";

export const POST = withRoute("/api/v1/payments", async (req: NextRequest) => {
  const user = getAuthUser(req);

  if (!user) return err("Unauthorized", 401);

  const body = await req.json().catch(() => null);

  const courseId = body?.courseId as string | undefined;

  if (!courseId) return err("Course id is required");

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      status: "PUBLISHED",
    },
  });

  if (!course) return err("Course not found", 404);

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
  });

  if (existingEnrollment) {
    await prisma.enrollment.update({
      where: { id: existingEnrollment.id },
      data: { lastAccessedAt: new Date() },
    });
    return ok(
      {
        id: existingEnrollment.id,
        courseId,
        enrolledAt: existingEnrollment.enrolledAt,
      },
      "Already enrolled",
    );
  }

  const result = await prisma.$transaction(async (tx: typeof prisma) => {
    const payment = await tx.payment.create({
      data: {
        userId: user.id,
        courseId,
        amount: course.price ?? 0,
        status: "COMPLETED",
        reference: `FREE-${crypto.randomUUID()}`,
      },
    });

    const enrollment = await tx.enrollment.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    return {
      payment,
      enrollment,
    };
  });

  return created(
    {
      courseId: result.enrollment.courseId,
      enrollmentId: result.enrollment.id,
      paymentId: result.payment.id,
      paymentStatus: result.payment.status,
      reference: result.payment.reference,
      transactionId: result.payment.transactionId,
    },
    "Course enrollment successful",
  );
});

export const GET = withRoute("/api/v1/payments", async (req: NextRequest) => {
  const user = getAuthUser(req);

  if (!user) return err("Unauthorized", 401);

  const { searchParams } = req.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)),
  );
  const status = searchParams.get("status") ?? undefined;
  const courseName = searchParams.get("courseName") ?? undefined;
  const range = searchParams.get("range") as PaymentDateRange | null;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    userId: user.id,

    ...(status && {
      status,
    }),

    ...(range && {
      createdAt: getDateRange(range),
    }),

    ...(courseName && {
      course: {
        title: {
          contains: courseName,
          mode: "insensitive",
        },
      },
    }),
  };

  const data = await prisma.payment.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  const total = await prisma.payment.count({
    where,
  });

  return ok(data, "Success", {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});
