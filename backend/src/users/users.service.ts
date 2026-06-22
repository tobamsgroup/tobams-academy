import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private safeUser(user: Record<string, unknown>) {
    const safe = { ...user };

    delete safe.passwordHash;
    delete safe.verifyTokenHash;
    delete safe.resetTokenHash;
    delete safe.resetTokenExpiry;

    return safe;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.safeUser(user as Record<string, unknown>);
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    return this.safeUser(user as Record<string, unknown>);
  }
}
