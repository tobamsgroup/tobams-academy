import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from './dto/payment-filter.dto';

const mockCourse = {
  id: 'c1',
  status: 'PUBLISHED',
};

const mockEnrollment = {
  id: 'e1',
  userId: 'u1',
  courseId: 'c1',
};

const mockPayment = {
  id: 'p1',
  userId: 'u1',
  courseId: 'c1',
  amount: 0,
  status: PaymentStatus.COMPLETED,
  //status: 'COMPLETED',
  reference: 'FREE-123456',
  createdAt: new Date(),
};

type MockTx = typeof mockPrisma;

const mockPrisma: {
  course: { findUnique: jest.Mock };
  enrollment: { findUnique: jest.Mock; create: jest.Mock };
  payment: {
    create: jest.Mock;
    findFirst: jest.Mock;
    delete: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
  };
  $transaction: jest.Mock;
} = {
  course: {
    findUnique: jest.fn(),
  },

  enrollment: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },

  payment: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },

  $transaction: jest.fn((cb: (tx: MockTx) => unknown) => {
    return cb(mockPrisma);
  }),
};
const prisma = mockPrisma as unknown as PrismaService;
describe('PaymentService - create', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    jest.clearAllMocks();
  });

  // Successful enrollment edge case
  it('creates payment and enrollment successfully', async () => {
    mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
    mockPrisma.enrollment.findUnique.mockResolvedValue(null);

    mockPrisma.payment.create.mockResolvedValue(mockPayment);
    mockPrisma.enrollment.create.mockResolvedValue(mockEnrollment);

    const result = await service.create('u1', { courseId: 'c1' });

    expect(result.data.courseId).toBe('c1');

    expect(mockPrisma.payment.create).toHaveBeenCalled();
    expect(mockPrisma.enrollment.create).toHaveBeenCalled();
  });

  // Course not found edge case
  it('throws if course does not exist', async () => {
    mockPrisma.course.findUnique.mockResolvedValue(null);

    await expect(service.create('u1', { courseId: 'c1' })).rejects.toThrow(
      'Course not found',
    );
  });

  // Course not published edge case
  it('throws if course is not published', async () => {
    mockPrisma.course.findUnique.mockResolvedValue({
      id: 'c1',
      status: 'DRAFT',
    });

    await expect(service.create('u1', { courseId: 'c1' })).rejects.toThrow(
      'Course is not available for enrollment',
    );
  });

  // User already enrolled in the course
  it('throws if user already enrolled', async () => {
    mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
    mockPrisma.enrollment.findUnique.mockResolvedValue(mockEnrollment);

    await expect(service.create('u1', { courseId: 'c1' })).rejects.toThrow(
      'You are already enrolled in this course',
    );
  });
  describe('PaymentService - remove', () => {
    it('deletes payment history successfully', async () => {
      mockPrisma.payment.findFirst.mockResolvedValue(mockPayment);

      mockPrisma.payment.delete.mockResolvedValue(mockPayment);

      const result = await service.remove('u1', 'p1');

      expect(result.message).toBe('Payment Record Successfully Deleted');

      expect(mockPrisma.payment.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'p1',
          userId: 'u1',
        },
      });

      expect(mockPrisma.payment.delete).toHaveBeenCalledWith({
        where: {
          id: 'p1',
        },
      });
    });

    it('throws if payment history does not exist', async () => {
      mockPrisma.payment.findFirst.mockResolvedValue(null);

      await expect(service.remove('u1', 'p1')).rejects.toThrow(
        'Payment not found',
      );

      expect(mockPrisma.payment.delete).not.toHaveBeenCalled();
    });
  });

  const findManyMock = mockPrisma.payment.findMany;
  const countMock = mockPrisma.payment.count;

  describe('findAll', () => {
    it('returns payments with pagination', async () => {
      findManyMock.mockResolvedValue([mockPayment]);
      countMock.mockResolvedValue(1);

      const result = await service.findAll('u1', {
        page: '1',
        limit: '10',
      });

      expect(findManyMock).toHaveBeenCalled();
      expect(countMock).toHaveBeenCalled();

      const query = findManyMock.mock.calls[0][0];

      expect(query.where.userId).toBe('u1');
      expect(query.skip).toBe(0);
      expect(query.take).toBe(10);

      expect(result.meta.total).toBe(1);
    });
    it('filters by status', async () => {
      findManyMock.mockResolvedValue([mockPayment]);
      countMock.mockResolvedValue(1);

      await service.findAll('u1', {
        status: PaymentStatus.COMPLETED,
        page: '1',
        limit: '10',
      });

      const query = findManyMock.mock.calls[0][0];

      expect(query.where.status).toBe(PaymentStatus.COMPLETED);
    });
    it('applies pagination correctly', async () => {
      findManyMock.mockResolvedValue([mockPayment]);
      countMock.mockResolvedValue(20);

      await service.findAll('u1', {
        page: '2',
        limit: '5',
      });

      const query = findManyMock.mock.calls[0][0];

      expect(query.skip).toBe(5);
      expect(query.take).toBe(5);
    });
    it('applies date range filter', async () => {
      findManyMock.mockResolvedValue([mockPayment]);
      countMock.mockResolvedValue(1);

      await service.findAll('u1', {
        range: 'LAST_7_DAYS',
        page: '1',
        limit: '10',
      });

      const query = findManyMock.mock.calls[0][0];

      expect(query.where.createdAt).toBeDefined();

      expect(query.where.userId).toBe('u1');
    });
    it('filters by course name', async () => {
      findManyMock.mockResolvedValue([mockPayment]);
      countMock.mockResolvedValue(1);

      await service.findAll('u1', {
        courseName: 'nestjs',
        page: '1',
        limit: '10',
      });

      const query = findManyMock.mock.calls[0][0];

      expect(query.where.course.title.contains).toBe('nestjs');
      expect(query.where.course.title.mode).toBe('insensitive');
    });
  });
});
