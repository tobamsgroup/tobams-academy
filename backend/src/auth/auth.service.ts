import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mail: MailService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async signTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('ACCESS_TOKEN_EXPIRY') ?? '7h',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('REFRESH_TOKEN_EXPIRY') ?? '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const rawToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenHash = this.hashToken(rawToken);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        verifyTokenHash,
      },
    });

    await this.mail.sendVerificationEmail(user.email, user.name, rawToken);

    return { message: 'Registration successful. Please verify your email.' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const tokens = await this.signTokens(user.id, user.email, user.role);
    return {
      data: {
        ...tokens,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      message: 'Login successful',
    };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    const user = await this.prisma.user.findFirst({
      where: { verifyTokenHash: tokenHash },
    });
    if (!user) throw new UnauthorizedException('Invalid or expired token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyTokenHash: null },
    });

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user) return { message: 'If that email exists, a reset link has been sent' };

    const rawToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = this.hashToken(rawToken);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetTokenHash, resetTokenExpiry },
    });

    await this.mail.sendPasswordResetEmail(user.email, user.name, rawToken);
    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hashToken(token);
    const user = await this.prisma.user.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpiry: { gt: new Date() },
      },
    });
    if (!user) throw new UnauthorizedException('Invalid or expired reset token');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetTokenHash: null, resetTokenExpiry: null },
    });

    return { message: 'Password reset successfully' };
  }

  async refresh(userId: string, email: string, role: string) {
    const tokens = await this.signTokens(userId, email, role);
    return { data: tokens, message: 'Tokens refreshed' };
  }
}
