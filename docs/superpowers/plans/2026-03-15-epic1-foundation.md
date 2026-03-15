# Epic 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a full-stack LMS with NestJS backend + Next.js 14 frontend, JWT auth, Prisma + PostgreSQL, Mailjet email, and a production-quality landing page.

**Architecture:** Plain two-app monorepo (`backend/` + `frontend/`) with a root `package.json` for convenience scripts. Backend exposes a versioned REST API (`/api/v1`) consumed by the frontend via SWR. NextAuth v5 bridges the two auth systems by calling the NestJS login endpoint and embedding the JWT in the encrypted session cookie.

**Tech Stack:** NestJS 10, Prisma, PostgreSQL 16, Redis 7, Next.js 14 App Router, TypeScript, Tailwind CSS, SWR, Redux Toolkit, NextAuth v5, Mailjet, Lucide React, Google Sans + Nunito Sans, Docker Compose, GitHub Actions, Jest

---

## Chunk 1: Monorepo Shell + Docker Compose

### Task 1: Root monorepo scaffold

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `docker-compose.yml`

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "tobams-academy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "docker-compose up",
    "dev:build": "docker-compose up --build",
    "stop": "docker-compose down",
    "migrate": "cd backend && npx prisma migrate dev",
    "studio": "cd backend && npx prisma studio",
    "seed": "cd backend && npx prisma db seed"
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```gitignore
node_modules/
.env
.env.local
dist/
.next/
.superpowers/
*.log
```

- [ ] **Step 3: Create `.env.example`**

```env
# ── Database ──────────────────────────────────────────
DATABASE_URL=postgresql://postgres:password@postgres:5432/tobams_academy

# ── Redis ─────────────────────────────────────────────
REDIS_URL=redis://redis:6379

# ── JWT ───────────────────────────────────────────────
JWT_SECRET=change_me_in_production
JWT_REFRESH_SECRET=change_me_refresh_in_production
ACCESS_TOKEN_EXPIRY=7h
REFRESH_TOKEN_EXPIRY=7d

# ── Mailjet ───────────────────────────────────────────
MAILJET_API_KEY=
MAILJET_API_SECRET=
MAILJET_FROM_EMAIL=noreply@tobamsacademy.com
MAILJET_FROM_NAME=Tobams Academy

# ── App ───────────────────────────────────────────────
CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# ── NextAuth v5 ───────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=change_me_nextauth_in_production
```

- [ ] **Step 4: Create `docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: tobams_academy
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
      - "5555:5555"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - backend_modules:/app/node_modules
    command: sh -c "npx prisma migrate deploy && npm run start:dev"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - frontend_modules:/app/node_modules
    command: npm run dev

volumes:
  postgres_data:
  backend_modules:
  frontend_modules:
```

- [ ] **Step 5: Copy `.env.example` to `.env`**

```bash
cp .env.example .env
```

- [ ] **Step 6: Commit**

```bash
git add package.json .gitignore .env.example docker-compose.yml
git commit -m "chore: add root monorepo shell and docker-compose"
```

---

## Chunk 2: NestJS Backend Scaffold

### Task 2: Scaffold NestJS project

**Files:**
- Create: `backend/` (full NestJS project)
- Create: `backend/Dockerfile`
- Create: `backend/.env.example`

- [ ] **Step 1: Scaffold NestJS inside `backend/`**

```bash
cd backend
npx @nestjs/cli new . --package-manager npm --skip-git
```

When prompted for package manager, choose `npm`. This creates the standard NestJS structure.

- [ ] **Step 2: Install backend dependencies**

```bash
cd backend
npm install @nestjs/config @nestjs/jwt @nestjs/passport @nestjs/swagger
npm install passport passport-jwt bcryptjs node-mailjet class-validator class-transformer
npm install @prisma/client
npm install --save-dev prisma @types/bcryptjs @types/passport-jwt
```

- [ ] **Step 3: Replace `backend/Dockerfile`**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

- [ ] **Step 4: Update `backend/tsconfig.json` — ensure strict mode**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

- [ ] **Step 5: Update `backend/package.json` scripts**

Add to the `scripts` section:

```json
"start:dev": "nest start --watch",
"start:prod": "node dist/main.js"
```

- [ ] **Step 6: Commit**

```bash
cd ..
git add backend/
git commit -m "chore: scaffold NestJS backend with dependencies"
```

---

### Task 3: Prisma setup + initial schema

**Files:**
- Create: `backend/prisma/schema.prisma`
- Create: `backend/prisma/seed.ts`
- Create: `backend/src/prisma/prisma.service.ts`
- Create: `backend/src/prisma/prisma.module.ts`

- [ ] **Step 1: Initialise Prisma**

```bash
cd backend
npx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and adds `DATABASE_URL` to `.env`.

- [ ] **Step 2: Write `backend/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String    @id @default(uuid())
  email            String    @unique
  name             String
  passwordHash     String
  role             Role      @default(LEARNER)
  emailVerified    Boolean   @default(false)
  verifyTokenHash  String?
  resetTokenHash   String?
  resetTokenExpiry DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@map("users")
}

model Category {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  @@map("categories")
}

enum Role {
  LEARNER
  INSTRUCTOR
  ADMIN
}
```

- [ ] **Step 3: Write `backend/prisma/seed.ts`**

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Business', slug: 'business' },
  { name: 'Leadership', slug: 'leadership' },
  { name: 'Data & Analytics', slug: 'data-analytics' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Design', slug: 'design' },
  { name: 'Personal Development', slug: 'personal-development' },
  { name: 'Project Management', slug: 'project-management' },
  { name: 'Marketing', slug: 'marketing' },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`Seeded ${categories.length} categories`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 4: Add seed config to `backend/package.json`**

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Also install `ts-node` if not already present:

```bash
cd backend && npm install --save-dev ts-node
```

- [ ] **Step 5: Create `backend/src/prisma/prisma.service.ts`**

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

- [ ] **Step 6: Create `backend/src/prisma/prisma.module.ts`**

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] **Step 7: Run migration (requires Postgres running)**

```bash
cd backend
npx prisma migrate dev --name init
```

Expected: migration file created in `prisma/migrations/`, Prisma client generated.

- [ ] **Step 8: Commit**

```bash
cd ..
git add backend/prisma/ backend/src/prisma/
git commit -m "feat: add Prisma schema (User, Category) and PrismaModule"
```

---

### Task 4: NestJS app bootstrap — global config, CORS, Swagger, versioning

**Files:**
- Modify: `backend/src/main.ts`
- Create: `backend/src/config/config.module.ts`

- [ ] **Step 1: Write `backend/src/config/config.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      // No envFilePath — variables are injected via docker-compose env_file
      // or via shell environment in local dev. This works in both contexts.
    }),
  ],
})
export class ConfigModule {}
```

- [ ] **Step 2: Rewrite `backend/src/main.ts`**

```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — allow frontend origin
  app.enableCors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API versioning
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Tobams Academy API')
    .setDescription('LMS API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log(`Backend running on http://localhost:3001`);
  console.log(`Swagger docs at http://localhost:3001/api/docs`);
}
bootstrap();
```

- [ ] **Step 3: Update `backend/src/app.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- [ ] **Step 4: Add health check to `backend/src/app.controller.ts`**

```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
```

- [ ] **Step 5: Verify the app starts**

```bash
cd backend && npm run start:dev
```

Expected: `Backend running on http://localhost:3001` in the console. Visit `http://localhost:3001/health` → `{"status":"ok"}`.

- [ ] **Step 6: Commit**

```bash
cd ..
git add backend/src/
git commit -m "feat: bootstrap NestJS with CORS, validation, Swagger, versioning, health check"
```

---

## Chunk 3: NestJS Auth — Register, Login, JWT

### Task 5: API response interceptor + shared DTOs

**Files:**
- Create: `backend/src/common/interceptors/response.interceptor.ts`
- Create: `backend/src/common/decorators/roles.decorator.ts`
- Create: `backend/src/common/guards/roles.guard.ts`

- [ ] **Step 1: Create `backend/src/common/interceptors/response.interceptor.ts`**

Wraps all responses in `{ data, message, meta, error }`.

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  message: string;
  meta?: Record<string, unknown>;
  error: null;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        data: data?.data ?? data,
        message: data?.message ?? 'Success',
        meta: data?.meta,
        error: null,
      })),
    );
  }
}
```

- [ ] **Step 2: Register interceptor globally in `backend/src/main.ts`**

Add after `app.useGlobalPipes(...)`:

```ts
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// ...
app.useGlobalInterceptors(new ResponseInterceptor());
```

- [ ] **Step 3: Create `backend/src/common/decorators/roles.decorator.ts`**

```ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

- [ ] **Step 4: Create `backend/src/common/guards/roles.guard.ts`**

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/common/
git commit -m "feat: add response interceptor, roles decorator and guard"
```

---

### Task 6: AuthModule — register + login

**Files:**
- Create: `backend/src/auth/auth.module.ts`
- Create: `backend/src/auth/auth.controller.ts`
- Create: `backend/src/auth/auth.service.ts`
- Create: `backend/src/auth/dto/register.dto.ts`
- Create: `backend/src/auth/dto/login.dto.ts`
- Create: `backend/src/auth/strategies/jwt.strategy.ts`
- Create: `backend/src/auth/strategies/jwt-refresh.strategy.ts`
- Create: `backend/src/auth/guards/jwt-auth.guard.ts`
- Create: `backend/src/auth/guards/jwt-refresh.guard.ts`

- [ ] **Step 1: Write failing tests for AuthService**

Create `backend/src/auth/auth.service.spec.ts`:

```ts
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
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwt = { signAsync: jest.fn() };
const mockConfig = { get: jest.fn() };
const mockMail = { sendVerificationEmail: jest.fn() };

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
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend && npx jest auth.service.spec.ts --no-coverage
```

Expected: FAIL — `AuthService` not found.

- [ ] **Step 3: Create DTOs**

`backend/src/auth/dto/register.dto.ts`:
```ts
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
}
```

`backend/src/auth/dto/login.dto.ts`:
```ts
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() password: string;
}
```

- [ ] **Step 4: Create `backend/src/auth/auth.service.ts`**

```ts
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
```

- [ ] **Step 5: Create JWT strategies — access + refresh**

`backend/src/auth/strategies/jwt.strategy.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: { sub: string; email: string; role: string }) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
```

`backend/src/auth/guards/jwt-auth.guard.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Also create the refresh token strategy `backend/src/auth/strategies/jwt-refresh.strategy.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  validate(payload: { sub: string; email: string; role: string }) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
```

And the refresh guard `backend/src/auth/guards/jwt-refresh.guard.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
```

- [ ] **Step 6: Create `backend/src/auth/auth.controller.ts`**

```ts
import { Body, Controller, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Request() req) {
    const { id, email, role } = req.user;
    return this.authService.refresh(id, email, role);
  }

  @Post('logout')
  logout() {
    return { message: 'Logged out successfully' };
  }
}
```

- [ ] **Step 7: Create `backend/src/auth/auth.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 8: Register AuthModule in `backend/src/app.module.ts`**

```ts
import { AuthModule } from './auth/auth.module';
// add to imports array:
AuthModule,
```

- [ ] **Step 9: Run tests — expect PASS**

```bash
cd backend && npx jest auth.service.spec.ts --no-coverage
```

Expected: all tests PASS.

- [ ] **Step 10: Commit**

```bash
cd ..
git add backend/src/auth/
git commit -m "feat: implement AuthModule with register, login, verify-email, password reset"
```

---

## Chunk 4: Mailjet + UsersModule

### Task 7: MailService with Mailjet

**Files:**
- Create: `backend/src/mail/mail.service.ts`
- Create: `backend/src/mail/mail.module.ts`

- [ ] **Step 1: Write failing test**

Create `backend/src/mail/mail.service.spec.ts`:

```ts
import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

const mockConfig = {
  get: (key: string) => ({
    MAILJET_API_KEY: 'key',
    MAILJET_API_SECRET: 'secret',
    MAILJET_FROM_EMAIL: 'noreply@test.com',
    MAILJET_FROM_NAME: 'Test',
    CLIENT_URL: 'http://localhost:3000',
  }[key]),
};

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  it('sendVerificationEmail resolves without throwing', async () => {
    // We are testing the service constructs the email correctly,
    // not that Mailjet actually delivers it — mock the send method
    jest.spyOn(service as any, 'send').mockResolvedValue(undefined);
    await expect(
      service.sendVerificationEmail('a@b.com', 'Alice', 'token123'),
    ).resolves.not.toThrow();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd backend && npx jest mail.service.spec.ts --no-coverage
```

Expected: FAIL — `MailService` not found.

- [ ] **Step 3: Create `backend/src/mail/mail.service.ts`**

```ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailjet from 'node-mailjet';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private client: Mailjet;
  private fromEmail: string;
  private fromName: string;
  private clientUrl: string;

  constructor(private config: ConfigService) {
    this.client = new Mailjet({
      apiKey: this.config.get<string>('MAILJET_API_KEY'),
      apiSecret: this.config.get<string>('MAILJET_API_SECRET'),
    });
    this.fromEmail = this.config.get<string>('MAILJET_FROM_EMAIL');
    this.fromName = this.config.get<string>('MAILJET_FROM_NAME');
    this.clientUrl = this.config.get<string>('CLIENT_URL');
  }

  private async send(
    to: string,
    toName: string,
    subject: string,
    htmlContent: string,
  ) {
    try {
      await this.client.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: { Email: this.fromEmail, Name: this.fromName },
            To: [{ Email: to, Name: toName }],
            Subject: subject,
            HTMLPart: htmlContent,
          },
        ],
      });
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
      throw err;
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const link = `${this.clientUrl}/verify-email?token=${token}`;
    const html = `
      <h2>Welcome to Tobams Academy, ${name}!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${link}" style="background:#571244;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `;
    await this.send(to, name, 'Verify your Tobams Academy email', html);
  }

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const link = `${this.clientUrl}/reset-password?token=${token}`;
    const html = `
      <h2>Password Reset Request</h2>
      <p>Hi ${name}, we received a request to reset your Tobams Academy password.</p>
      <a href="${link}" style="background:#EF4353;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
        Reset Password
      </a>
      <p>This link expires in 1 hour. If you did not request a reset, ignore this email.</p>
    `;
    await this.send(to, name, 'Reset your Tobams Academy password', html);
  }
}
```

- [ ] **Step 4: Create `backend/src/mail/mail.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd backend && npx jest mail.service.spec.ts --no-coverage
```

- [ ] **Step 6: Commit**

```bash
cd ..
git add backend/src/mail/
git commit -m "feat: add MailService with Mailjet for verification and password reset emails"
```

---

### Task 8: UsersModule

**Files:**
- Create: `backend/src/users/users.service.ts`
- Create: `backend/src/users/users.controller.ts`
- Create: `backend/src/users/users.module.ts`
- Create: `backend/src/users/dto/update-profile.dto.ts`

- [ ] **Step 1: Write failing test**

Create `backend/src/users/users.service.spec.ts`:

```ts
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
      });
      const result = await service.findById('1');
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('updateProfile', () => {
    it('updates and returns the user', async () => {
      mockPrisma.user.update.mockResolvedValue({
        id: '1', name: 'Bob', email: 'a@b.com', role: 'LEARNER',
        emailVerified: true,
      });
      const result = await service.updateProfile('1', { name: 'Bob' });
      expect(result.name).toBe('Bob');
    });
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd backend && npx jest users.service.spec.ts --no-coverage
```

- [ ] **Step 3: Create `backend/src/users/dto/update-profile.dto.ts`**

```ts
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
}
```

- [ ] **Step 4: Create `backend/src/users/users.service.ts`**

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private safeUser(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, verifyTokenHash, resetTokenHash, resetTokenExpiry, ...safe } = user;
    return safe;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.safeUser(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    return this.safeUser(user);
  }
}
```

- [ ] **Step 5: Create `backend/src/users/users.controller.ts`**

```ts
import { Body, Controller, Get, Patch, Request, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }
}
```

- [ ] **Step 6: Create `backend/src/users/users.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

- [ ] **Step 7: Register in `backend/src/app.module.ts`**

```ts
import { UsersModule } from './users/users.module';
// add to imports array:
UsersModule,
```

- [ ] **Step 8: Run tests — expect PASS**

```bash
cd backend && npx jest users.service.spec.ts --no-coverage
```

- [ ] **Step 9: Run full backend test suite**

```bash
cd backend && npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 10: Commit**

```bash
cd ..
git add backend/src/users/
git commit -m "feat: add UsersModule with profile get/update endpoints"
```

---

## Chunk 5: Next.js Frontend Scaffold

### Task 9: Scaffold Next.js 14 project

**Files:**
- Create: `frontend/` (Next.js project)
- Create: `frontend/Dockerfile`

- [ ] **Step 1: Scaffold Next.js inside `frontend/`**

```bash
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```

- [ ] **Step 2: Install frontend dependencies**

```bash
cd frontend
npm install next-auth@beta swr @reduxjs/toolkit react-redux lucide-react
npm install --save-dev @types/node
```

- [ ] **Step 3: Create `frontend/Dockerfile`**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

- [ ] **Step 4: Update `frontend/tailwind.config.ts` — add brand colors**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#571244',
        secondary: '#EF4353',
        accent: '#f97316',
      },
      fontFamily: {
        heading: ['Google Sans', 'Nunito Sans', 'sans-serif'],
        body: ['var(--font-nunito)', 'Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 5: Update `frontend/src/app/layout.tsx` — load fonts**

```tsx
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Tobams Academy',
  description: 'Professional training courses to advance your career',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${nunitoSans.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Update `frontend/src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-google-sans: 'Google Sans', sans-serif;
}

@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-google-sans), var(--font-nunito), sans-serif;
  }
}
```

- [ ] **Step 7: Commit**

```bash
cd ..
git add frontend/
git commit -m "chore: scaffold Next.js 14 with Tailwind, brand colors, and fonts"
```

---

## Chunk 6: NextAuth v5 + SWR + Redux

### Task 10: NextAuth v5 configuration

**Files:**
- Create: `frontend/src/lib/auth.ts`
- Create: `frontend/src/app/api/auth/[...nextauth]/route.ts`
- Create: `frontend/src/types/next-auth.d.ts`

- [ ] **Step 1: Create `frontend/src/types/next-auth.d.ts`**

```ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    user: {
      id: string
      role: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN'
    } & DefaultSession['user']
  }
}
```

- [ ] **Step 2: Create `frontend/src/lib/auth.ts`**

```ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!res.ok) return null

        const { data } = await res.json()
        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          accessToken: data.accessToken,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.accessToken = (user as any).accessToken
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as 'LEARNER' | 'INSTRUCTOR' | 'ADMIN'
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
```

- [ ] **Step 3: Create `frontend/src/app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/lib/auth.ts frontend/src/app/api/ frontend/src/types/
git commit -m "feat: configure NextAuth v5 Credentials provider with JWT session"
```

---

### Task 11: SWR fetcher + Redux store

**Files:**
- Create: `frontend/src/lib/fetcher.ts`
- Create: `frontend/src/store/index.ts`
- Create: `frontend/src/store/uiSlice.ts`
- Create: `frontend/src/components/providers.tsx`

- [ ] **Step 1: Create `frontend/src/lib/fetcher.ts`**

SWR runs in client components. Use a factory that accepts the token from `useSession()` to avoid calling the server-only `auth()` function client-side.

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

/**
 * Build a SWR fetcher bound to a specific access token.
 * Usage: const { data } = useSWR('/courses', createFetcher(session?.accessToken))
 */
export function createFetcher(accessToken?: string) {
  return async function fetcher<T>(path: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    const res = await fetch(`${API_URL}${path}`, { headers })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const json = await res.json()
    return json.data
  }
}

/**
 * Unauthenticated fetcher for public endpoints (courses catalogue, etc.)
 */
export async function publicFetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  return json.data
}
```

- [ ] **Step 2: Create `frontend/src/store/uiSlice.ts`**

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  sidebarOpen: boolean
  activeModal: string | null
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[]
}

const initialState: UiState = {
  sidebarOpen: true,
  activeModal: null,
  toasts: [],
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload
    },
    closeModal(state) {
      state.activeModal = null
    },
    addToast(state, action: PayloadAction<Omit<UiState['toasts'][0], 'id'>>) {
      state.toasts.push({ ...action.payload, id: Date.now().toString() })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const { toggleSidebar, openModal, closeModal, addToast, removeToast } =
  uiSlice.actions
export default uiSlice.reducer
```

- [ ] **Step 3: Create `frontend/src/store/index.ts`**

```ts
import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

- [ ] **Step 4: Create `frontend/src/components/providers.tsx`**

```tsx
'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  )
}
```

- [ ] **Step 5: Wrap app in providers — update `frontend/src/app/layout.tsx`**

```tsx
import { Providers } from '@/components/providers'
// inside <body>:
<body className={`${nunitoSans.variable} font-body antialiased`}>
  <Providers>{children}</Providers>
</body>
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/lib/fetcher.ts frontend/src/store/ frontend/src/components/providers.tsx frontend/src/app/layout.tsx
git commit -m "feat: add SWR fetcher with auth header injection and Redux store with uiSlice"
```

---

## Chunk 7: Next.js Middleware + Auth Pages

### Task 12: Route protection middleware

**Files:**
- Create: `frontend/src/middleware.ts`

- [ ] **Step 1: Create `frontend/src/middleware.ts`**

```ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/courses', '/login', '/register', '/forgot-password', '/verify-email']
const ADMIN_PREFIX = '/admin'
const AUTH_PATHS = ['/login', '/register']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const isLoggedIn = !!session

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect admin routes
  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.url))
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Protect all other non-public routes
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith('/courses'),
  )
  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/middleware.ts
git commit -m "feat: add NextAuth v5 middleware for route protection and role-based redirects"
```

---

### Task 13: Auth pages — Login, Register, Forgot Password, Verify Email

**Files:**
- Create: `frontend/src/lib/utils.ts`
- Create: `frontend/src/app/(auth)/layout.tsx`
- Create: `frontend/src/app/(auth)/login/page.tsx`
- Create: `frontend/src/app/(auth)/register/page.tsx`
- Create: `frontend/src/app/(auth)/forgot-password/page.tsx`
- Create: `frontend/src/app/(auth)/verify-email/page.tsx`
- Create: `frontend/src/components/ui/Button.tsx`
- Create: `frontend/src/components/ui/Input.tsx`

- [ ] **Step 1: Create shared UI primitives**

`frontend/src/components/ui/Button.tsx`:
```tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold font-heading transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-secondary/40 hover:-translate-y-0.5',
      ghost: 'border-2 border-slate-200 text-slate-600 hover:border-primary hover:text-primary',
      danger: 'bg-secondary text-white hover:opacity-90',
    }
    return (
      <button ref={ref} className={cn(base, variants[variant], className)} disabled={disabled || loading} {...props}>
        {loading ? <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
```

`frontend/src/components/ui/Input.tsx`:
```tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20',
          error && 'border-secondary focus:border-secondary focus:ring-secondary/20',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-secondary">{error}</span>}
    </div>
  ),
)
Input.displayName = 'Input'
```

Create `frontend/src/lib/utils.ts`:
```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Install clsx and tailwind-merge:
```bash
cd frontend && npm install clsx tailwind-merge
```

- [ ] **Step 2: Create auth layout**

`frontend/src/app/(auth)/layout.tsx`:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="font-heading text-2xl font-bold text-primary">
            Tobams<span className="text-secondary">.</span>Academy
          </span>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-primary/5">
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Login page**

`frontend/src/app/(auth)/login/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-500">Sign in to continue learning</p>
      {error && <div className="mb-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">Sign In</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        No account?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">Create one</Link>
      </p>
    </>
  )
}
```

- [ ] **Step 4: Create Register page**

`frontend/src/app/(auth)/register/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data?.message ?? 'Registration failed')
    } else {
      router.push('/login?registered=1')
    }
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Create account</h1>
      <p className="mb-6 text-sm text-slate-500">Start your learning journey today</p>
      {error && <div className="mb-4 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        <Button type="submit" loading={loading} className="w-full">Create Account</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </>
  )
}
```

- [ ] **Step 5: Create Forgot Password page**

`frontend/src/app/(auth)/forgot-password/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-3 text-4xl">📬</div>
        <h2 className="mb-2 text-xl font-bold text-slate-900">Check your email</h2>
        <p className="text-sm text-slate-500">If that email exists, a reset link has been sent.</p>
        <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">Back to login</Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Reset password</h1>
      <p className="mb-6 text-sm text-slate-500">We'll send a reset link to your email</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-primary hover:underline">Back to login</Link>
      </p>
    </>
  )
}
```

- [ ] **Step 6: Create Verify Email page**

`frontend/src/app/(auth)/verify-email/page.tsx`:
```tsx
import { Suspense } from 'react'
import { VerifyEmailContent } from './VerifyEmailContent'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-center text-slate-500">Verifying your email…</p>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
```

Also create `frontend/src/app/(auth)/verify-email/VerifyEmailContent.tsx` (the actual client component that reads search params):
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'

export function VerifyEmailContent() {
  const params = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`, { method: 'POST' })
      .then((r) => setStatus(r.ok ? 'success' : 'error'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="text-center">
      {status === 'loading' && <p className="text-slate-500">Verifying your email…</p>}
      {status === 'success' && (
        <>
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
          <h2 className="mb-2 text-xl font-bold text-slate-900">Email verified!</h2>
          <p className="mb-6 text-sm text-slate-500">Your account is ready. Sign in to start learning.</p>
          <Link href="/login" className="font-semibold text-primary hover:underline">Go to login</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle className="mx-auto mb-3 h-12 w-12 text-secondary" />
          <h2 className="mb-2 text-xl font-bold text-slate-900">Verification failed</h2>
          <p className="text-sm text-slate-500">This link is invalid or has expired.</p>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
cd ..
git add frontend/src/app/\(auth\)/ frontend/src/components/ui/ frontend/src/lib/utils.ts
git commit -m "feat: add auth pages (login, register, forgot-password, verify-email) and UI primitives"
```

---

## Chunk 8: Landing Page

### Task 14: Landing page — Option B Vibrant Split

**Files:**
- Create: `frontend/src/app/(public)/page.tsx`
- Create: `frontend/src/app/(public)/layout.tsx`
- Create: `frontend/src/components/landing/Navbar.tsx`
- Create: `frontend/src/components/landing/Hero.tsx`
- Create: `frontend/src/components/landing/StatsBar.tsx`
- Create: `frontend/src/components/landing/CoursesSection.tsx`

- [ ] **Step 1: Create public layout**

`frontend/src/app/(public)/layout.tsx`:
```tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>
}
```

- [ ] **Step 2: Create `frontend/src/components/landing/Navbar.tsx`**

```tsx
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-100 bg-white/95 px-8 py-4 backdrop-blur-sm">
      <Link href="/" className="font-heading text-xl font-bold text-primary">
        Tobams<span className="text-secondary">.</span>Academy
      </Link>
      <div className="flex items-center gap-6 text-sm text-slate-500">
        <Link href="/courses" className="transition-colors hover:text-primary">Courses</Link>
        <Link href="#" className="transition-colors hover:text-primary">Community</Link>
        <Link href="#" className="transition-colors hover:text-primary">About</Link>
        <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">Login</Link>
        <Link
          href="/register"
          className="rounded-lg bg-primary px-5 py-2 font-heading text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
        >
          Get Started →
        </Link>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Create `frontend/src/components/landing/Hero.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Trophy, Lightbulb, GraduationCap } from 'lucide-react'

const floatingIcons = [BookOpen, Trophy, Lightbulb]

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="flex min-h-[520px]">
      {/* Left */}
      <div className={`flex flex-1 flex-col justify-center px-12 py-16 transition-all duration-700 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[2px] text-secondary">
          ✦ Professional Training Platform
        </p>
        <h1 className="mb-4 text-5xl font-bold leading-tight text-slate-900">
          Grow Faster.<br />
          Learn <span className="text-secondary">Smarter.</span>
        </h1>
        <p className="mb-8 max-w-md text-base leading-relaxed text-slate-500">
          Join thousands of professionals mastering in-demand skills with structured, expert-designed courses. Progress at your pace, earn recognised certificates.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-primary to-secondary px-7 py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/40"
          >
            Start Free Trial →
          </Link>
          <Link
            href="/courses"
            className="rounded-xl border-2 border-slate-200 px-7 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:border-primary hover:text-primary"
          >
            Browse Courses
          </Link>
        </div>
        {/* Social proof */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex">
            {['👩', '👨', '👩🏿', '👨🏽'].map((emoji, i) => (
              <span
                key={i}
                className="flex h-8 w-8 -ml-2 first:ml-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary to-secondary text-sm shadow-sm"
              >
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            <strong className="text-slate-700">5,000+</strong> learners already enrolled
          </p>
        </div>
      </div>

      {/* Right — gradient panel */}
      <div className="relative flex w-80 flex-shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-primary via-[#8b2252] to-secondary">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/[0.06]" />
        <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-white/[0.05]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 animate-spin-slow rounded-full border border-white/10" />
        </div>

        {/* Certificate toast */}
        <div className="absolute top-5 left-5 flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-2 backdrop-blur-sm animate-fade-up">
          <Trophy className="h-5 w-5 text-yellow-300" />
          <div>
            <p className="text-xs font-bold text-white">Certificate Earned!</p>
            <p className="text-[10px] text-white/60">Product Management · just now</p>
          </div>
        </div>

        {/* Main icon */}
        <GraduationCap className="relative z-10 h-16 w-16 animate-float text-white drop-shadow-lg" />

        {/* Mini icons */}
        <div className="relative z-10 mt-4 flex gap-3">
          {floatingIcons.map((Icon, i) => (
            <div
              key={i}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/18 backdrop-blur-sm"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <Icon className="h-5 w-5 animate-float text-white" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Add custom animations to `frontend/tailwind.config.ts`**

```ts
animation: {
  'float': 'float 3s ease-in-out infinite',
  'fade-up': 'fadeUp 0.6s ease 0.4s both',
  'spin-slow': 'spin 12s linear infinite',
},
keyframes: {
  float: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
  fadeUp: {
    from: { opacity: '0', transform: 'translateY(10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
},
```

- [ ] **Step 5: Create `frontend/src/components/landing/StatsBar.tsx`**

```tsx
const stats = [
  { value: '5K+', label: 'Active Learners' },
  { value: '50+', label: 'Expert Courses' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '12+', label: 'Categories' },
]

export function StatsBar() {
  return (
    <div className="flex bg-primary">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex-1 py-4 text-center transition-colors hover:bg-white/5 ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}
        >
          <p className="font-heading text-2xl font-bold text-white">{s.value}</p>
          <p className="mt-0.5 text-xs text-white/55">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Create `frontend/src/components/landing/CoursesSection.tsx`**

```tsx
'use client'

import { useState } from 'react'

const categories = ['All', 'Business', 'Leadership', 'Data', 'Technology', 'Design']

const courses = [
  { title: 'Product Management', meta: '12 lessons · 6 hours · Beginner', tag: 'Bestseller', progress: 70, gradient: 'from-primary to-secondary' },
  { title: 'Data Analysis', meta: '8 lessons · 4 hours · Intermediate', tag: 'New', progress: 35, gradient: 'from-indigo-600 to-cyan-500' },
  { title: 'Leadership Essentials', meta: '10 lessons · 5 hours · All levels', tag: 'Popular', progress: 55, gradient: 'from-emerald-600 to-sky-500' },
]

export function CoursesSection() {
  const [active, setActive] = useState('All')

  return (
    <section className="bg-slate-50 px-12 py-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Featured Courses</h2>
        <button className="text-sm font-semibold text-secondary hover:underline">See all courses →</button>
      </div>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
              active === cat
                ? 'border-secondary bg-secondary text-white'
                : 'border-slate-200 text-slate-500 hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-3 gap-5">
        {courses.map((c) => (
          <div
            key={c.title}
            className="group overflow-hidden rounded-xl border border-purple-50 bg-white shadow-sm shadow-primary/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className={`relative h-28 bg-gradient-to-br ${c.gradient}`}>
              <span className="absolute bottom-2 left-2 rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {c.tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-heading text-sm font-bold text-slate-900">{c.title}</h3>
              <p className="text-xs text-slate-400">{c.meta}</p>
              <div className="mt-3">
                <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">{c.progress}% complete</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Assemble landing page**

`frontend/src/app/(public)/page.tsx`:
```tsx
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { StatsBar } from '@/components/landing/StatsBar'
import { CoursesSection } from '@/components/landing/CoursesSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <StatsBar />
      <CoursesSection />
    </div>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add frontend/src/app/\(public\)/ frontend/src/components/landing/
git commit -m "feat: build landing page (Option B — Vibrant Split) with animations and Lucide icons"
```

---

## Chunk 9: GitHub Actions CI + Final Wiring

### Task 15: GitHub Actions CI pipeline

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Add coverage threshold to `backend/package.json` Jest config**

Add a `jest` key (or update `jest.config.js` if it exists) to enforce the 85% gate:

```json
"jest": {
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  "coverageThreshold": {
    "global": {
      "lines": 85
    }
  }
}
```

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [backend, frontend]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: ${{ matrix.app }}/package-lock.json
      - run: npm ci
        working-directory: ${{ matrix.app }}
      - run: npm run lint
        working-directory: ${{ matrix.app }}

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [backend, frontend]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: ${{ matrix.app }}/package-lock.json
      - run: npm ci
        working-directory: ${{ matrix.app }}
      - run: npx tsc --noEmit
        working-directory: ${{ matrix.app }}

  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: backend/package-lock.json
      - run: npm ci
        working-directory: backend
      - run: npx jest --coverage
        working-directory: backend
        # coverageThreshold is set in package.json jest config — CI fails if below 85%
```

- [ ] **Step 3: Commit**

```bash
git add .github/ backend/package.json
git commit -m "ci: add GitHub Actions pipeline (lint, type-check, test with 85% coverage gate)"
```

---

### Task 16: Smoke test — end-to-end startup

- [ ] **Step 1: Start all services**

```bash
docker-compose up --build
```

Expected: all 4 containers start without errors. Postgres and Redis pass their healthchecks. Backend applies migrations.

- [ ] **Step 2: Verify health endpoint**

```bash
curl http://localhost:3001/health
```

Expected: `{"data":{"status":"ok"},"message":"Success","error":null}`

- [ ] **Step 3: Verify Swagger**

Open `http://localhost:3001/api/docs` in browser. Expected: Swagger UI loads with auth and users tag groups visible.

- [ ] **Step 4: Verify landing page**

Open `http://localhost:3000` in browser. Expected: landing page renders with Navbar, Hero split layout, Stats bar, and Courses section.

- [ ] **Step 5: Verify register flow**

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Expected: `{"data":null,"message":"Registration successful. Please verify your email.","error":null}`

- [ ] **Step 6: Verify login flow**

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: `{"data":{"accessToken":"...","refreshToken":"...","user":{...}},"message":"Login successful","error":null}`

> Note: login will return `UnauthorizedException` if email is not verified. To test without Mailjet, temporarily set `emailVerified: true` via Prisma Studio (`npm run studio`).

- [ ] **Step 7: Run full backend test suite**

```bash
cd backend && npx jest --coverage
```

Expected: all tests pass, AuthService and UsersService each above 85% line coverage.

- [ ] **Step 8: Final commit**

```bash
cd ..
git add -A
git commit -m "feat: Epic 1 complete — full-stack LMS foundation with auth, landing page, and CI"
```
