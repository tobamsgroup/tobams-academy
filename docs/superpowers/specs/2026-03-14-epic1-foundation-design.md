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
- `npm run dev` — `docker-compose up` (all 4 services with hot reload)
- `npm run migrate` — `prisma migrate dev` (run locally outside Docker against `DATABASE_URL`)
- `npm run studio` — Prisma Studio on port 5555

> **Note:** `prisma migrate dev` is for local development only. Inside Docker containers and CI, the entrypoint uses `prisma migrate deploy` (non-interactive, no client regeneration).

---

## 2. Backend Architecture (NestJS + Prisma)

### Tech stack
- **Runtime:** Node.js 20, NestJS 10, TypeScript
- **ORM:** Prisma — `prisma/schema.prisma` for models, `prisma/migrations/` for migration history
- **Auth:** Passport.js with `passport-jwt`, `@nestjs/jwt`
- **Validation:** `class-validator` + `class-transformer` via global `ValidationPipe`
- **Email:** Mailjet via `node-mailjet` (verification emails and password reset)
- **Icons:** Lucide (consistent icon set, used across frontend too)
- **Docs:** `@nestjs/swagger` auto-generated at `/api/docs`

### Directory structure

```
backend/
├── src/
│   ├── auth/              # register, login, logout, refresh, verify-email, reset-password
│   ├── users/             # profile get/update, RolesGuard
│   ├── mail/              # MailjetService — verify email + password reset templates
│   ├── config/            # ConfigModule with typed env validation
│   ├── prisma/            # PrismaService singleton
│   └── main.ts            # Bootstrap, global pipes, CORS, Swagger, /api/v1 prefix
├── prisma/
│   ├── schema.prisma      # User + Category models
│   ├── migrations/        # Auto-generated migration files
│   └── seed.ts            # Seeds initial categories for Epic 2
├── test/                  # e2e tests
├── Dockerfile
├── .env.example
└── package.json
```

### Prisma schema (initial models)

```prisma
model User {
  id               String    @id @default(uuid())
  email            String    @unique
  name             String
  passwordHash     String
  role             Role      @default(LEARNER)
  emailVerified    Boolean   @default(false)
  verifyTokenHash  String?   // SHA-256 hash of the verification token
  resetTokenHash   String?   // SHA-256 hash of the reset token
  resetTokenExpiry DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model Category {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())
}

enum Role {
  LEARNER
  INSTRUCTOR
  ADMIN
}
```

> **Token security:** Verification and reset tokens are generated as random strings, hashed with SHA-256 before storage, and never stored in plaintext. The raw token is sent in the email link; only the hash lives in the DB.

### Seeding

`prisma/seed.ts` populates initial categories (e.g. Business, Leadership, Data, Technology, Design) so that Epic 2's course filtering works from day one. Run via `npx prisma db seed`.

### API response envelope

All endpoints return:
```json
{ "data": {}, "message": "string", "meta": {}, "error": null }
```

### JWT configuration
- **Access token:** 7 hours (deliberate UX trade-off — avoids frequent re-authentication in a training context where learners have long sessions; no token blacklist is required at this scale)
- **Refresh token:** 7 days

### CORS
`main.ts` calls `app.enableCors({ origin: process.env.CLIENT_URL, credentials: true })` so the frontend (port 3000) can reach the API (port 3001) in local development.

---

## 3. Frontend Architecture (Next.js 14)

### Tech stack
- **Framework:** Next.js 14 App Router, TypeScript
- **Styling:** Tailwind CSS with custom theme tokens
- **Fonts:** Nunito Sans (body) via `next/font/google`; Google Sans (headings) via CSS import
- **Icons:** Lucide React (`lucide-react`) — consistent with backend icon decisions
- **Data fetching:** SWR with global fetcher that attaches NextAuth session JWT
- **State:** Redux Toolkit — `uiSlice` (modals, toasts, sidebar)
- **Auth:** NextAuth.js **v5** (Auth.js) with Credentials provider

### NextAuth v5 conventions
Config lives in `src/lib/auth.ts` and exports `{ handlers, auth, signIn, signOut }`. The route handler at `app/api/auth/[...nextauth]/route.ts` re-exports `handlers`. Middleware uses `auth` directly (not `getToken`). Session type is extended:

```ts
// types/next-auth.d.ts
declare module "next-auth" {
  interface Session {
    user: { id: string; name: string; email: string; role: "LEARNER" | "INSTRUCTOR" | "ADMIN" }
    accessToken: string
  }
}
```

### Directory structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/                      # /login, /register, /forgot-password, /verify-email
│   │   ├── (public)/                    # / (landing), /courses, /courses/[slug]
│   │   ├── (protected)/                 # /dashboard, /learn/...
│   │   ├── admin/                       # Admin section (role-gated via Middleware)
│   │   └── api/auth/[...nextauth]/      # NextAuth v5 route handler
│   ├── components/
│   │   ├── ui/                          # Button, Input, Card, Modal, Toast
│   │   └── [feature]/                   # Feature-scoped components
│   ├── hooks/                           # SWR hooks: useCourses, useProfile, etc.
│   ├── store/                           # Redux store + uiSlice
│   ├── lib/
│   │   ├── fetcher.ts                   # SWR global fetcher (attaches accessToken from session)
│   │   └── auth.ts                      # NextAuth v5 config
│   ├── types/
│   │   └── next-auth.d.ts               # Session type extension
│   └── middleware.ts                    # Route protection + role-based redirects
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
- **Hero:** Left — headline (Google Sans, 700) + subtext (Nunito Sans) + dual CTA buttons + social proof row; Right — gradient panel (`#571244 → #EF4353 → #f97316`) with Lucide icons (not emoji) floating with CSS animation, and a certificate toast badge
- **Stats bar:** Full-width dark purple band — 5K+ Learners / 50+ Courses / 98% Satisfaction / 12+ Categories
- **Courses section:** Category filter pills + 3-column course grid with progress bars
- **Animations:** Hero text slides in from left on load; icons float vertically via `@keyframes`; progress bars fill on mount; certificate badge fades up with delay

### Route protection (middleware.ts)

| Route pattern | Rule |
|---|---|
| `/dashboard/*`, `/learn/*` | Must be authenticated → else redirect `/login` |
| `/admin/*` | Must be `ADMIN` role → else redirect `/dashboard` |
| `/login`, `/register` | Must be unauthenticated → else redirect `/dashboard` |
| `INSTRUCTOR` role | Treated as `LEARNER` for routing — lands on `/dashboard` |

---

## 4. Authentication Flow

### Registration
1. `POST /api/v1/auth/register` — hash password (bcrypt), generate random verify token, store its SHA-256 hash, send Mailjet email
2. `POST /api/v1/auth/verify-email` — hash incoming token, compare to stored hash, set `emailVerified = true`

### Login
1. `POST /api/v1/auth/login` — validate credentials, return access token (7h) + refresh token (7d)
2. NextAuth v5 Credentials provider calls this endpoint, maps response into `session.user` + `session.accessToken`

### Logout
1. `POST /api/v1/auth/logout` — stateless; server clears any server-side refresh token record if stored (for this epic, logout is client-side session destruction via NextAuth `signOut()` only, as refresh tokens are JWTs with no blacklist table yet)
2. Frontend calls NextAuth `signOut()` which clears the session cookie

### Token refresh
1. `POST /api/v1/auth/refresh` — validate refresh token → issue new access token

### Password reset
1. `POST /api/v1/auth/forgot-password` — generate reset token, hash and store, send Mailjet email (token expires 1h)
2. `POST /api/v1/auth/reset-password` — hash incoming token, compare to stored hash, check expiry, update password

### Roles
- Stored on `User.role`, embedded in JWT claims, synced to NextAuth session via `session` callback
- `RolesGuard` on NestJS enforces role at API level
- `middleware.ts` enforces role at routing level

---

## 5. Docker & Local Development

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]     # Used from Epic 5 onwards (BullMQ)

  backend:
    build: ./backend
    ports: ["3001:3001", "5555:5555"]
    depends_on: [postgres]
    volumes:
      - ./backend:/app
      - backend_modules:/app/node_modules   # prevent host mount from shadowing container node_modules
    command: sh -c "npx prisma migrate deploy && npm run start:dev"

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
    volumes:
      - ./frontend:/app
      - frontend_modules:/app/node_modules  # same fix for frontend

volumes:
  postgres_data:
  backend_modules:
  frontend_modules:
```

Single `.env` file at root, referenced by both containers.

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
AUTH_SECRET=changeme   # NextAuth v5 uses AUTH_SECRET
```

---

## 8. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login, return JWT (consumed by NextAuth) |
| POST | `/api/v1/auth/logout` | Client-side session destruction (stateless) |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/verify-email` | Verify email with hashed token |
| POST | `/api/v1/auth/forgot-password` | Request password reset email |
| POST | `/api/v1/auth/reset-password` | Set new password via hashed reset token |
| GET | `/api/v1/users/me` | Get current user profile |
| PATCH | `/api/v1/users/me` | Update profile |
| GET | `/health` | API health check (used by Docker healthcheck) |
| GET | `/api/docs` | Swagger UI |

---

## 9. Acceptance Criteria

- `docker-compose up` starts all 4 services cleanly with no errors
- `prisma migrate deploy` (run in container entrypoint) applies base migrations cleanly
- `POST /api/v1/auth/register` creates user, sends Mailjet verification email, returns 201
- `POST /api/v1/auth/login` returns JWT tokens; NextAuth v5 session is established
- Visiting a protected route unauthenticated redirects to `/login` via middleware
- Visiting `/login` while authenticated redirects to `/dashboard`
- Session object contains `user.role` and `accessToken`; SWR fetcher reads `accessToken` and attaches it as `Authorization: Bearer`
- Password reset email delivers a working reset link via Mailjet; token expires after 1 hour
- Swagger UI accessible at `/api/docs` with all auth endpoints documented
- `GET /health` returns 200
- Landing page renders at `/` with Google Sans + Nunito Sans fonts and Lucide icons
- Unit tests for AuthService and UsersService achieve >85% coverage
- GitHub Actions CI passes on a clean branch
- `prisma db seed` populates initial categories
