import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwt = { signAsync: jest.fn() };
const mockConfig = { get: jest.fn() };
const mockMail = { sendVerificationEmail: jest.fn(), sendPasswordResetEmail: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
        { provide: MailService, useValue: mockMail },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('throws ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
      await expect(
        service.register({ email: 'a@b.com', password: 'pass', name: 'Test' }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates user and sends verification email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: 'a@b.com',
        name: 'Test',
        role: 'LEARNER',
      });
      mockMail.sendVerificationEmail.mockResolvedValue(undefined);

      const result = await service.register({
        email: 'a@b.com',
        password: 'pass123',
        name: 'Test',
      });

      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockMail.sendVerificationEmail).toHaveBeenCalled();
      expect(result.message).toBe('Registration successful. Please verify your email.');
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'bad@b.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        passwordHash: await bcrypt.hash('correct', 10),
        emailVerified: true,
      });
      await expect(
        service.login({ email: 'a@b.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when email is not verified', async () => {
      const hash = await bcrypt.hash('pass123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1', email: 'a@b.com', role: 'LEARNER',
        passwordHash: hash, emailVerified: false,
      });
      await expect(
        service.login({ email: 'a@b.com', password: 'pass123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens for valid credentials', async () => {
      const hash = await bcrypt.hash('pass123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'a@b.com',
        name: 'Test',
        role: 'LEARNER',
        passwordHash: hash,
        emailVerified: true,
      });
      mockJwt.signAsync.mockResolvedValue('token');

      const result = await service.login({ email: 'a@b.com', password: 'pass123' });
      expect(result.data.accessToken).toBeDefined();
    });
  });
});
