# Epic 1: Project Infrastructure & Foundation

**Status:** 🔴 Not Started
**Priority:** P0 — Critical Path
**Iteration:** 1 (Weeks 1–2)
**Total Estimate:** 54 hours
**Dependencies:** None (Foundation epic)

## Overview

This epic establishes the foundational infrastructure for the Training Academy LMS, built on **Next.js 14 App Router + TypeScript (frontend)** and **NestJS + TypeScript (backend)**. The primary objective is to scaffold both applications, configure PostgreSQL via **Prisma**, set up Docker Compose for local development, implement JWT-based authentication on the NestJS side, wire NextAuth.js v5 on the Next.js side for session management, and establish the base patterns that all subsequent epics depend on.

The NestJS backend is configured with AuthModule, UsersModule, ConfigModule, and PrismaModule. NextAuth.js v5 is configured with a Credentials provider that exchanges email/password for a JWT from the NestJS API, storing the session server-side. SWR is configured as the data-fetching layer with a shared global fetcher. Redux Toolkit is set up with a base store for global client-side state (UI state, modals, notifications). Docker Compose runs Postgres, Redis, the NestJS API, and the Next.js app together locally.

Without this epic, no other development can proceed. Every subsequent epic assumes authentication is working, SWR fetcher is configured, and all base migrations are applied.

## Key Deliverables

- ✅ NestJS project scaffolded with modular structure (AuthModule, UsersModule, ConfigModule, DatabaseModule)
- ✅ Next.js 14 App Router project scaffolded with TypeScript and Tailwind CSS
- ✅ Redux Toolkit store configured with base `uiSlice` (modals, toasts, sidebar state)
- ✅ SWR global fetcher configured with auth headers, error handling, and revalidation defaults
- ✅ PostgreSQL connected via **Prisma** with base migrations for `users` and `categories` tables
- ✅ Docker Compose running Postgres, Redis, NestJS API, and Next.js locally
- ✅ NestJS JWT authentication (access token **7 hours**, refresh token 7 days) with Passport.js guards
- ✅ NextAuth.js v5 Credentials provider wired to `POST /api/v1/auth/login`, storing JWT in session
- ✅ NextAuth.js v5 session strategy configured (JWT session with NestJS token embedded)
- ✅ Next.js Middleware protecting authenticated routes using NextAuth v5 `auth()`
- ✅ Email verification flow with **Mailjet** on NestJS
- ✅ Password reset flow (request + confirm)
- ✅ Role-based access control: `learner`, `instructor`, `admin` enforced via NestJS guards and NextAuth session role
- ✅ Versioned API routing at `/api/v1/` with Swagger at `/api/docs`
- ✅ Standardised API response wrapper: `{ data, message, meta, error }`
- ✅ Auth pages: `/login`, `/register`, `/forgot-password`, `/verify-email`
- ✅ GitHub Actions CI pipeline (lint, type-check, test on PR)
- ✅ Unit tests for AuthService and UsersService (>85% coverage)

## Acceptance Criteria

- `docker-compose up` starts all services cleanly with no errors
- `prisma migrate deploy` (run in container entrypoint) applies base Prisma migrations cleanly
- `prisma db seed` populates initial categories
- `POST /api/v1/auth/register` creates user, sends Mailjet verification email, returns 201
- `POST /api/v1/auth/login` returns JWT tokens; NextAuth v5 session is established with `user.role` and `accessToken`
- Visiting a protected Next.js route unauthenticated redirects to `/login` via Middleware
- Visiting `/login` while authenticated redirects to `/dashboard`
- SWR fetcher correctly attaches `session.accessToken` as `Authorization: Bearer` to all API requests
- Password reset email delivers a working reset link via Mailjet; token expires after 1 hour
- Swagger UI accessible at `/api/docs` with all auth endpoints documented
- `GET /health` returns 200
- Landing page renders at `/` with Google Sans + Nunito Sans fonts and Lucide icons
- GitHub Actions CI passes on a clean branch

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login, return JWT (consumed by NextAuth) |
| POST | `/api/v1/auth/logout` | Client-side session destruction via NextAuth `signOut()` (stateless) |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/verify-email` | Verify email with token |
| POST | `/api/v1/auth/forgot-password` | Request password reset email |
| POST | `/api/v1/auth/reset-password` | Set new password via reset token |
| GET | `/api/v1/users/me` | Get current user profile |
| PATCH | `/api/v1/users/me` | Update profile |
| GET | `/health` | API health check |
| GET | `/api/docs` | Swagger UI |

## Ticket Breakdown

| # | Title | Priority | Size | Hours | Day |
|---|-------|----------|------|-------|-----|
| 1.1 | Scaffold NestJS project with module structure and Docker Compose | P0 | M | 3h | Day 1 |
| 1.2 | Scaffold Next.js 14 App Router project with TypeScript, Tailwind, Redux Toolkit, SWR | P0 | M | 3h | Day 1 |
| 1.3 | Configure Prisma with PostgreSQL, define `User` and `Category` schema, run initial migration and seed | P0 | M | 3h | Day 2 |
| 1.4 | Implement NestJS AuthModule: register, login, logout, JWT issuance, Passport guards | P0 | L | 5h | Day 2 |
| 1.5 | Implement email verification and password reset flows with Mailjet (`node-mailjet`) | P0 | M | 3h | Day 3 |
| 1.6 | Implement UsersModule: profile get/update, RolesGuard, `/health` endpoint | P0 | S | 2h | Day 3 |
| 1.7 | Configure NextAuth.js v5 Credentials provider wired to NestJS login endpoint; extend session type | P0 | M | 4h | Day 4 |
| 1.8 | Configure Next.js Middleware for route protection and role-based redirects using NextAuth v5 `auth()` | P0 | M | 3h | Day 4 |
| 1.9 | Configure SWR global fetcher with session token injection and error handling | P0 | S | 2h | Day 5 |
| 1.10 | Configure Redux Toolkit store with `uiSlice` (modals, toasts, sidebar) | P0 | S | 2h | Day 5 |
| 1.11 | Configure versioned API routing, Swagger, and base response wrapper | P0 | S | 2h | Day 5 |
| 1.12 | Build Auth pages: Login, Register, Forgot Password, Verify Email | P0 | L | 5h | Day 6 |
| 1.13 | Configure GitHub Actions CI pipeline (lint, type-check, test on PR) | P0 | S | 2h | Day 6 |
| 1.14 | Write unit + integration tests for AuthService and UsersService (>85% coverage) | P0 | L | 5h | Day 7 |
