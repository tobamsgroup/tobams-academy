import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

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
          amount: 0,
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
