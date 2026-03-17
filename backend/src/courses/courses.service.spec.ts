import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';

const mockCourse = {
  id: 'c1', title: 'Test Course', slug: 'test-course',
  description: 'Desc', level: 'BEGINNER', status: 'PUBLISHED',
  isFeatured: true, price: null, categoryId: 'cat1', instructorId: 'u1',
  createdAt: new Date(), updatedAt: new Date(),
  category: { id: 'cat1', name: 'Business', slug: 'business', createdAt: new Date() },
  instructor: { id: 'u1', name: 'Jane', email: 'jane@test.com' },
  _count: { modules: 4 },
};

const mockPrisma = {
  course: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<CoursesService>(CoursesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns paginated courses', async () => {
      mockPrisma.course.findMany.mockResolvedValue([mockCourse]);
      mockPrisma.course.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 12 });

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 12, totalPages: 1 });
    });

    it('applies search filter to where clause', async () => {
      mockPrisma.course.findMany.mockResolvedValue([]);
      mockPrisma.course.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 12, search: 'python' });

      const callArg = mockPrisma.course.findMany.mock.calls[0][0];
      expect(callArg.where.OR).toBeDefined();
    });

    it('applies categoryId filter', async () => {
      mockPrisma.course.findMany.mockResolvedValue([]);
      mockPrisma.course.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 12, categoryId: 'cat1' });

      const callArg = mockPrisma.course.findMany.mock.calls[0][0];
      expect(callArg.where.categoryId).toBe('cat1');
    });
  });

  describe('findFeatured', () => {
    it('returns only featured published courses', async () => {
      mockPrisma.course.findMany.mockResolvedValue([mockCourse]);

      await service.findFeatured();

      const callArg = mockPrisma.course.findMany.mock.calls[0][0];
      expect(callArg.where).toEqual({ isFeatured: true, status: 'PUBLISHED' });
    });
  });

  describe('findBySlug', () => {
    it('returns course with nested modules and lessons', async () => {
      const fullCourse = { ...mockCourse, modules: [] };
      mockPrisma.course.findUnique.mockResolvedValue(fullCourse);

      const result = await service.findBySlug('test-course');

      expect(mockPrisma.course.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: 'test-course' } }),
      );
      expect(result).toEqual(fullCourse);
    });

    it('returns null when course not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);
      const result = await service.findBySlug('nonexistent');
      expect(result).toBeNull();
    });
  });
});
