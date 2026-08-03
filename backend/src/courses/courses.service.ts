import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListCoursesDto } from './dto/list-courses.dto';

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
};

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: ListCoursesDto) {
    const { page, limit, search, categoryId } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        select: COURSE_LIST_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findFeatured() {
    return this.prisma.course.findMany({
      where: { isFeatured: true, status: 'PUBLISHED' },
      select: COURSE_LIST_SELECT,
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: {
        category: true,
        instructor: { select: { id: true, name: true, email: true } },
        modules: {
          orderBy: { position: 'asc' },
          include: {
            lessons: { orderBy: { position: 'asc' } },
          },
        },
      },
    });
  }
}
