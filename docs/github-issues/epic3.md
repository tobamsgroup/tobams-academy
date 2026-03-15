# Epic 3: Course Structure Management (Admin)

**Status:** 🔴 Not Started
**Priority:** P1 — High
**Iteration:** 2 (Weeks 3–4)
**Total Estimate:** 44 hours
**Dependencies:** Epic 1 (Auth, RolesGuard), Epic 2 (CoursesModule base)

## Overview

This epic delivers the admin-facing course builder — all functionality for creating and managing courses, modules, and lessons. It covers the NestJS ModulesModule and LessonsModule, the protected admin section of the Next.js app, and the course builder UI with drag-and-drop reordering.

The admin section lives under `/admin` in the Next.js App Router and is protected at the Middleware level to `admin` role only. Course creation, module management, and lesson management are all handled via SWR mutations (`mutate`) paired with REST calls. Redux Toolkit `adminSlice` tracks unsaved builder state (drag-and-drop order changes) before they are committed to the API.

## Key Deliverables

- ✅ NestJS ModulesModule: create, update, delete, reorder modules within a course
- ✅ NestJS LessonsModule: create, update, delete, reorder lessons within a module
- ✅ TypeORM migrations for `modules` and `lessons` tables with `order_index` column
- ✅ Reorder endpoint accepting ordered array of IDs and updating `order_index` in bulk
- ✅ Admin layout: `/admin` route group with sidebar navigation, protected by NextAuth role
- ✅ `/admin/courses` — courses list with publish/unpublish toggle and create button
- ✅ `/admin/courses/new` — course creation form
- ✅ `/admin/courses/[id]/edit` — course builder with module/lesson tree
- ✅ Drag-and-drop reorder for modules and lessons (using `@dnd-kit/core`)
- ✅ Inline editing for module and lesson titles
- ✅ Publish/unpublish toggle updating course visibility
- ✅ Redux `adminSlice` managing builder dirty state and pending reorder operations
- ✅ Course preview mode showing learner view before publishing

## Acceptance Criteria

- `POST /api/v1/admin/courses` creates a course and returns 201 with the new course object
- `POST /api/v1/admin/courses/:id/modules` creates a module with correct `order_index`
- `PATCH /api/v1/admin/modules/:id/reorder` updates `order_index` for all affected modules atomically
- Visiting `/admin` as a `learner` role redirects to `/dashboard`
- Dragging a module in the builder updates the visual order immediately (optimistic) and persists on drop
- Publish toggle changes `is_published` and the course immediately appears/disappears in the public catalogue
- Course preview at `/admin/courses/[id]/preview` renders the learner course detail view accurately

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/admin/courses` | Create new course |
| PATCH | `/api/v1/admin/courses/:id` | Update course details |
| DELETE | `/api/v1/admin/courses/:id` | Delete course |
| PATCH | `/api/v1/admin/courses/:id/publish` | Toggle publish status |
| POST | `/api/v1/admin/courses/:id/modules` | Add module to course |
| PATCH | `/api/v1/admin/modules/:id` | Update module |
| DELETE | `/api/v1/admin/modules/:id` | Delete module |
| PATCH | `/api/v1/admin/modules/reorder` | Bulk reorder modules |
| POST | `/api/v1/admin/modules/:id/lessons` | Add lesson to module |
| PATCH | `/api/v1/admin/lessons/:id` | Update lesson |
| DELETE | `/api/v1/admin/lessons/:id` | Delete lesson |
| PATCH | `/api/v1/admin/lessons/reorder` | Bulk reorder lessons |

## Ticket Breakdown

| # | Title | Priority | Size | Hours | Day |
|---|-------|----------|------|-------|-----|
| 3.1 | Implement NestJS ModulesModule: entity, migration, CRUD service | P1 | M | 4h | Day 1 |
| 3.2 | Implement NestJS LessonsModule: entity, migration, CRUD service | P1 | M | 4h | Day 1 |
| 3.3 | Implement bulk reorder endpoints for modules and lessons | P1 | M | 3h | Day 2 |
| 3.4 | Implement admin-scoped course CRUD endpoints with RolesGuard | P1 | M | 3h | Day 2 |
| 3.5 | Build Next.js `/admin` route group with layout, sidebar, and role-protected Middleware | P1 | M | 3h | Day 3 |
| 3.6 | Build `/admin/courses` list page with SWR, publish toggle, and create button | P1 | M | 3h | Day 3 |
| 3.7 | Build `/admin/courses/new` course creation form | P1 | M | 3h | Day 4 |
| 3.8 | Build `/admin/courses/[id]/edit` course builder layout with module/lesson tree | P1 | L | 5h | Day 4 |
| 3.9 | Implement drag-and-drop reorder with `@dnd-kit/core` and Redux optimistic updates | P1 | L | 5h | Day 5 |
| 3.10 | Build inline module/lesson title editing with SWR mutation | P1 | S | 2h | Day 5 |
| 3.11 | Build course preview mode rendering learner view | P1 | M | 3h | Day 6 |
| 3.12 | Write unit tests for ModulesService, LessonsService, and reorder logic | P1 | M | 4h | Day 6 |
