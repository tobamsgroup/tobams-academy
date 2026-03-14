# Epic 1: Project Infrastructure & Foundation — Design Spec

**Date:** 2026-03-14
**Status:** Approved
**Scope:** Full-stack LMS foundation — NestJS backend + Next.js 14 frontend in a single monorepo

---

## 1. Repository Structure

Plain two-app monorepo — no Turborepo or Nx. Each app manages its own dependencies. Root package.json provides convenience scripts only.

```
tobams-academy/
├── backend/               # NestJS API
├── frontend/              # Next.js 14 app
├── docs/
│   ├── github-issues/     # Epic specs
│   └── superpowers/specs/ # Design documents
├── docker-compose.yml     # Postgres + Redis + API + Web
├── .env.example           # Shared env variable template
├── package.json           # Root scripts: dev, stop, migrate, studio
└── .gitignore
```

**Root scripts:**
- `npm run dev` — `docker-compose up` (all 4 services)
- `npm run migrate` — `prisma migrate dev` inside backend container
- `npm run studio` — Prisma Studio on port 5555

---

## 2. Backend Architecture (NestJS + Prisma)

### Tech stack
- **Runtime:** Node.js 20, NestJS 10, TypeScript
- **ORM:** Prisma (replaces TypeORM) — `prisma/schema.prisma` for models, `prisma/migrations/` for migration history
- **Auth:** Passport.js with `passport-jwt`, `@nestjs/jwt`
- **Validation:** `class-validator` + `class-transformer` via global `ValidationPipe`
- **Email:** Mailjet via `node-mailjet`
- **Docs:** `@nestjs/swagger` auto-generated at `/api/docs`

### Directory structure

```
backend/
├── src/
│   ├── auth/              # register, login, refresh, verify-email, reset-password
│   ├── users/             # profile get/update, RolesGuard
│   ├── mail/              # MailjetService — verify email + password reset templates
│   ├── config/            # ConfigModule with typed env validation
│   ├── prisma/            # PrismaService singleton
│   └── main.ts            # Bootstrap, global pipes, Swagger, /api/v1 prefix
├── prisma/
│   ├── schema.prisma      # User model + enums
│   └── migrations/        # Auto-generated migration files
├── test/                  # e2e tests
├── Dockerfile
├── .env.example
└── package.json
```

### Prisma schema (initial models)

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  name            String
  passwordHash    String
  role            Role      @default(LEARNER)
  emailVerified   Boolean   @default(false)
  verifyToken     String?
  resetToken      String?
  resetTokenExpiry DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum Role {
  LEARNER
  INSTRUCTOR
  ADMIN
}
```

### API response envelope

All endpoints return:
```json
{ "data": {}, "message": "string", "meta": {}, "error": null }
```

### JWT configuration
- **Access token:** 7 hours
- **Refresh token:** 7 days
- Tokens embedded in NextAuth session; refresh handled by `POST /api/v1/auth/refresh`

---

## 3. Frontend Architecture (Next.js 14)

### Tech stack
- **Framework:** Next.js 14 App Router, TypeScript
- **Styling:** Tailwind CSS with custom theme tokens
- **Fonts:** Nunito Sans (body) via `next/font/google`; Google Sans (headings) via CSS import
- **Data fetching:** SWR with global fetcher that attaches NextAuth session JWT
- **State:** Redux Toolkit — `uiSlice` (modals, toasts, sidebar)
- **Auth:** NextAuth.js v5 with Credentials provider

### Directory structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/             # /login, /register, /forgot-password, /verify-email
│   │   ├── (public)/           # / (landing), /courses, /courses/[slug]
│   │   ├── (protected)/        # /dashboard, /learn/...
│   │   ├── admin/              # Admin section (role-gated via Middleware)
│   │   └── api/auth/[...nextauth]/ # NextAuth route handler
│   ├── components/
│   │   ├── ui/                 # Button, Input, Card, Modal, Toast (shared primitives)
│   │   └── [feature]/          # Feature-scoped components
│   ├── hooks/                  # SWR hooks: useSession, useCourses, etc.
│   ├── store/                  # Redux store + uiSlice
│   ├── lib/
│   │   ├── fetcher.ts          # SWR global fetcher
│   │   └── auth.ts             # NextAuth config (Credentials provider)
│   └── middleware.ts           # Route protection + role-based redirects
├── public/
├── Dockerfile
├── .env.example
└── package.json
```

### Tailwind theme tokens

```js
// tailwind.config.ts
colors: {
  primary:   '#571244',
  secondary: '#EF4353',
  accent:    '#f97316',
}
```

### Landing page design (Option B — Vibrant Split)

- **Nav:** Logo left, links + CTA right; white background with subtle bottom border
- **Hero:** Left — headline + subtext + dual CTA buttons + social proof avatars; Right — gradient panel (#571244 → #EF4353 → #f97316) with floating emoji icons and a certificate toast badge
- **Stats bar:** Full-width dark purple band — 5K+ Learners / 50+ Courses / 98% Satisfaction / 12+ Categories
- **Courses section:** Category filter pills + 3-column course grid with progress bars
- **Animations:** Hero text slides in from left, icons float vertically, progress bars fill on load, certificate badge fades up

### Route protection (middleware.ts)

| Route pattern | Rule |
|---|---|
| `/dashboard/*`, `/learn/*` | Must be authenticated → else `/login` |
| `/admin/*` | Must be `ADMIN` role → else `/dashboard` |
| `/login`, `/register` | Must be unauthenticated → else `/dashboard` |

---

## 4. Authentication Flow

### Registration
1. `POST /api/v1/auth/register` — create user, hash password, generate verify token
2. Mailjet sends verification email with token link
3. `POST /api/v1/auth/verify-email` — validate token, set `emailVerified = true`

### Login
1. `POST /api/v1/auth/login` — validate credentials, return access token (7h) + refresh token (7d)
2. NextAuth Credentials provider calls this endpoint and stores tokens in the encrypted session cookie

### Route access
1. `middleware.ts` calls NextAuth `getToken()` on every request
2. Unauthenticated requests to protected routes → redirect `/login`
3. Non-admin requests to `/admin/*` → redirect `/dashboard`

### Password reset
1. `POST /api/v1/auth/forgot-password` — generate reset token, send Mailjet email
2. `POST /api/v1/auth/reset-password` — validate token (expires 1h), update password hash

### Roles
- Stored on `User.role` in DB, embedded in JWT claims, synced to NextAuth session
- `RolesGuard` on NestJS enforces role at the API level
- `middleware.ts` enforces role at the Next.js routing level

---

## 5. Docker & Local Development

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    port: 5432
    volume: postgres_data

  redis:
    image: redis:7-alpine
    port: 6379              # Used from Epic 5 onwards (BullMQ)

  backend:
    build: ./backend
    port: 3001
    depends_on: [postgres]
    volumes: ./backend:/app  # hot reload

  frontend:
    build: ./frontend
    port: 3000
    depends_on: [backend]
    volumes: ./frontend:/app # hot reload
```

Single `.env` file at root, referenced by both containers. Prisma Studio available on port `5555` via `npm run studio`.

---

## 6. CI/CD (GitHub Actions)

Trigger: pull request to `main`

Three parallel jobs:
1. **lint** — ESLint on `backend/` and `frontend/`
2. **type-check** — `tsc --noEmit` on both apps
3. **test** — Jest unit tests; `AuthService` and `UsersService` must reach >85% coverage

PR merge is blocked if any job fails.

---

## 7. Environment Variables

### Backend `.env.example`
```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/tobams_academy
REDIS_URL=redis://redis:6379
JWT_SECRET=changeme
JWT_REFRESH_SECRET=changeme_refresh
ACCESS_TOKEN_EXPIRY=7h
REFRESH_TOKEN_EXPIRY=7d
MAILJET_API_KEY=
MAILJET_API_SECRET=
MAILJET_FROM_EMAIL=noreply@tobamsacademy.com
MAILJET_FROM_NAME=Tobams Academy
CLIENT_URL=http://localhost:3000
```

### Frontend `.env.example`
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changeme
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## 8. Acceptance Criteria

- `docker-compose up` starts all 4 services cleanly with no errors
- `npm run migrate` applies base Prisma migrations cleanly
- `POST /api/v1/auth/register` creates user, sends verification email, returns 201
- `POST /api/v1/auth/login` returns JWT tokens; NextAuth session is established
- Visiting a protected route unauthenticated redirects to `/login` via Middleware
- Visiting `/login` while authenticated redirects to `/dashboard`
- `useSession()` in any Client Component returns the authenticated user with role
- SWR fetcher correctly attaches the NextAuth session JWT to all API requests
- Password reset email delivers a working reset link via Mailjet
- Swagger UI accessible at `/api/docs` with all auth endpoints documented
- GitHub Actions CI passes on a clean branch
- Landing page renders correctly at `/` with Google Sans + Nunito Sans fonts
- Unit tests for AuthService and UsersService achieve >85% coverage
