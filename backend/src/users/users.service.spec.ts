import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('throws NotFoundException when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('returns user without passwordHash', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1', name: 'Alice', email: 'a@b.com', role: 'LEARNER',
        passwordHash: 'secret', emailVerified: true,
        verifyTokenHash: null, resetTokenHash: null, resetTokenExpiry: null,
      });
      const result = await service.findById('1');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('verifyTokenHash');
      expect(result).not.toHaveProperty('resetTokenHash');
    });
  });

  describe('updateProfile', () => {
    it('updates and returns the user', async () => {
      mockPrisma.user.update.mockResolvedValue({
        id: '1', name: 'Bob', email: 'a@b.com', role: 'LEARNER',
        emailVerified: true, verifyTokenHash: null, resetTokenHash: null, resetTokenExpiry: null,
      });
      const result = await service.updateProfile('1', { name: 'Bob' });
      expect(result.name).toBe('Bob');
      expect(result).not.toHaveProperty('passwordHash');
    });
  });
});
