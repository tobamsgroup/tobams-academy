# Epic 2: Course Catalogue & Discovery

**Status:** 🔴 Not Started
**Priority:** P1 — High
**Iteration:** 1 (Weeks 1–2)
**Total Estimate:** 34 hours
**Dependencies:** Epic 1 (Auth, database, SWR fetcher, NextAuth session)

## Overview

This epic delivers all functionality allowing visitors and learners to browse, search, filter, and discover courses. It covers the NestJS CoursesModule and CategoriesModule, the public course catalogue page, individual course detail pages, and the homepage with featured courses.

Course catalogue pages are built as Next.js **Server Components** using `fetch` with `cache: 'revalidate'` for SEO-optimised HTML output. Client-side search and filter interactions use SWR with dynamic query params for instant results without full page reloads. The course detail page is fully server-rendered with the course outline, instructor info, and enroll CTA.

## Key Deliverables

- ✅ NestJS CoursesModule and CategoriesModule with service and repository layers
- ✅ TypeORM migrations for `courses` and `categories` tables
- ✅ Paginated course listing endpoint with keyword search and category filter
- ✅ Course detail endpoint returning full outline (modules + lessons)
- ✅ SWR hooks: `useCourses(filters)`, `useCourse(slug)`, `useCategories()`
- ✅ Next.js `/courses` catalogue page (Server Component with ISR)
- ✅ Client-side search bar and category filter using SWR revalidation
- ✅ Next.js `/courses/[slug]` detail page (Server Component, SSR)
- ✅ Homepage `/` with featured courses grid and category quick-filters
- ✅ `CourseCard` component, `CategoryPill` component, `CourseOutline` component
- ✅ Empty state and loading skeleton components for catalogue

## Acceptance Criteria

- `GET /api/v1/courses` returns paginated list with `data`, `meta.total`, `meta.page`
- `GET /api/v1/courses?search=strategy` returns filtered results matching title/description
- `GET /api/v1/courses?categoryId=1` returns courses filtered by category
- `GET /api/v1/courses/:slug` returns full course with nested modules and lessons
- `/courses` page renders correctly with JavaScript disabled (SSR confirmed)
- Searching in the search bar triggers SWR revalidation and updates results without full page reload
- Course detail page displays full module/lesson outline, instructor name, and enroll button
- Category filter pills update the course listing correctly

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/courses` | List published courses (paginated, filterable) |
| GET | `/api/v1/courses/:slug` | Get course detail with full outline |
| GET | `/api/v1/categories` | List all categories |
| GET | `/api/v1/courses/featured` | Get featured courses for homepage |

## Ticket Breakdown

| # | Title | Priority | Size | Hours | Day |
|---|-------|----------|------|-------|-----|
| 2.1 | Implement NestJS CategoriesModule: CRUD, seeder, migration | P1 | S | 2h | Day 1 |
| 2.2 | Implement NestJS CoursesModule: entity, migration, service, repository | P1 | L | 5h | Day 1 |
| 2.3 | Implement course listing endpoint with pagination, search, and category filter | P1 | M | 4h | Day 2 |
| 2.4 | Implement course detail endpoint with nested modules and lessons | P1 | M | 3h | Day 2 |
| 2.5 | Build SWR hooks: `useCourses`, `useCourse`, `useCategories` | P1 | S | 2h | Day 3 |
| 2.6 | Build `/courses` catalogue page as Server Component with ISR | P1 | M | 3h | Day 3 |
| 2.7 | Build client-side search bar and category filter with SWR revalidation | P1 | M | 3h | Day 4 |
| 2.8 | Build `/courses/[slug]` course detail page as Server Component | P1 | M | 4h | Day 4 |
| 2.9 | Build homepage `/` with featured courses and hero section | P1 | M | 4h | Day 5 |
| 2.10 | Build `CourseCard`, `CategoryPill`, `CourseOutline`, skeleton loading components | P1 | M | 4h | Day 5 |
