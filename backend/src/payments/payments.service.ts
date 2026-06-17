import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentFilterDto } from './dto/payment-filter.dto';
import { DATE_RANGE_MAP } from './constants/date-range-map';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentDto) {
    const { courseId } = dto;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== 'PUBLISHED') {
      throw new BadRequestException('Course is not available for enrollment');
    }

    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('You are already enrolled in this course');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          userId,
          courseId,
          amount: course.price ?? 0,
          status: 'COMPLETED',
          reference: `FREE-${crypto.randomUUID()}`,
        },
      });

      const enrollment = await tx.enrollment.create({
        data: {
          userId,
          courseId,
        },
      });

      return enrollment.courseId;
    });

    return {
      data: {
        courseId: result,
      },
      message: 'Course enrollment successful',
    };
  }

  async findOne(userId: string, id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id,
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
    if (!payment || payment.userId !== userId) {
      throw new NotFoundException('Payment not found');
    }

    const duration = payment.course.modules.reduce((total, module) => {
      const moduleDuration = module.lessons.reduce(
        (sum, lesson) => sum + (lesson.duration ?? 0),
        0,
      );

      return total + moduleDuration;
    }, 0);
    return {
      data: {
        paymentDetails: {
          courseId: payment.courseId,
          paymentDate: payment.createdAt,
          paymentMethod: payment.paymentMethod || 'Free Enrollment',
          transactionId: payment.transactionId || null,
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
      },
    };
  }

  async findAll(userId: string, query: PaymentFilterDto) {
    const { status, courseName, range, page = 1, limit = 12 } = query;

    const pageNumber = page;
    const limitNumber = limit;

    const now = new Date();
    const fromDate = new Date();

    if (range) {
      const days = DATE_RANGE_MAP[range];
      fromDate.setDate(now.getDate() - days);
    }

    const where: Prisma.PaymentWhereInput = {
      userId,

      ...(status && { status }),

      ...(range && {
        createdAt: {
          gte: fromDate,
          lte: now,
        },
      }),

      ...(courseName && {
        course: {
          title: {
            contains: courseName,
            mode: 'insensitive',
          },
        },
      }),
    };

    const data = await this.prisma.payment.findMany({
      where,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      orderBy: {
        createdAt: 'desc',
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

    const total = await this.prisma.payment.count({ where });

    return {
      data,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async remove(userId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    return { message: 'Payment Record Successfully Deleted' };
  }
}
