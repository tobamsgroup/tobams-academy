# Epic 5: Enrollment & Course Learning Interface

**Status:** 🔴 Not Started
**Priority:** P1 — High
**Iteration:** 3 (Weeks 5–6)
**Total Estimate:** 46 hours
**Dependencies:** Epic 2 (CoursesModule), Epic 4 (MaterialsModule, Mux playback IDs)

## Overview

This epic delivers the core learner-facing course experience. It covers the EnrollmentsModule on NestJS, the full course learning environment in Next.js, the lesson viewer with video player, in-browser PDF viewer, slide viewer, and downloadable file list.

The enrollment flow is triggered from the course detail page and creates an `enrollments` record with associated `lesson_progress` rows (one per lesson, all initially incomplete). The learning environment at `/learn/[courseSlug]` is a client-heavy layout using Redux `learnerSlice` for sidebar state and SWR for lesson content fetching. The Mux Player component is integrated for adaptive video playback. PDF.js handles in-browser PDF rendering. Redux Toolkit manages the active lesson state and sidebar open/close on mobile.

## Key Deliverables

- ✅ NestJS EnrollmentsModule: enroll, unenroll, list my enrollments
- ✅ TypeORM migration for `enrollments` table and `lesson_progress` table
- ✅ Auto-creation of `lesson_progress` rows on enrollment (one per lesson in the course)
- ✅ Enrollment guard: lessons and materials only accessible to enrolled learners
- ✅ SWR hooks: `useEnrollments()`, `useEnrollment(courseId)`, `useLessonContent(lessonId)`
- ✅ Redux `learnerSlice`: active lesson ID, sidebar collapsed state, mobile menu
- ✅ `/learn/[courseSlug]` learning environment layout (sidebar + main content area)
- ✅ Course sidebar: module/lesson tree with completion indicators and active lesson highlight
- ✅ `/learn/[courseSlug]/[lessonSlug]` lesson page with all material types rendered
- ✅ Mux Player integration for video lessons (adaptive HLS, fullscreen, resume position)
- ✅ PDF.js viewer for in-browser PDF rendering
- ✅ Slide viewer for PPT/PDF slides
- ✅ Downloadable files list with signed URL fetch on demand
- ✅ External links list rendered within lesson page
- ✅ Mobile-responsive layout with collapsible sidebar

## Acceptance Criteria

- `POST /api/v1/enrollments` creates enrollment and `lesson_progress` rows for all lessons in the course
- Accessing `/learn/[courseSlug]` as an unenrolled learner redirects to the course detail page
- Course sidebar renders all modules and lessons with correct completion state from SWR
- Clicking a lesson in the sidebar navigates to the lesson page and updates `learnerSlice` active lesson
- Video lessons play via Mux Player with fullscreen and resume working correctly
- PDFs render inline via PDF.js without requiring download
- Download links generate fresh signed S3 URLs on click (not pre-baked at page load)
- Sidebar collapses correctly on mobile with toggle button

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/enrollments` | Enroll current user in a course |
| DELETE | `/api/v1/enrollments/:courseId` | Unenroll from a course |
| GET | `/api/v1/enrollments/me` | List current user's enrollments |
| GET | `/api/v1/enrollments/me/:courseId` | Get enrollment detail for one course |
| GET | `/api/v1/lessons/:id/content` | Get lesson with all materials (enrolled only) |

## Ticket Breakdown

| # | Title | Priority | Size | Hours | Day |
|---|-------|----------|------|-------|-----|
| 5.1 | Implement NestJS EnrollmentsModule: entity, migration, enroll/unenroll service | P1 | L | 5h | Day 1 |
| 5.2 | Implement auto-creation of `lesson_progress` rows on enrollment | P1 | M | 3h | Day 1 |
| 5.3 | Implement enrollment guard protecting lesson content endpoints | P1 | M | 3h | Day 2 |
| 5.4 | Implement lesson content endpoint returning lesson + all materials | P1 | M | 3h | Day 2 |
| 5.5 | Build SWR hooks: `useEnrollments`, `useEnrollment`, `useLessonContent` | P1 | S | 2h | Day 3 |
| 5.6 | Build Redux `learnerSlice` (active lesson, sidebar state, mobile menu) | P1 | S | 2h | Day 3 |
| 5.7 | Build `/learn/[courseSlug]` learning environment layout with sidebar | P1 | L | 5h | Day 3 |
| 5.8 | Build course sidebar component with module/lesson tree and completion indicators | P1 | L | 5h | Day 4 |
| 5.9 | Build `/learn/[courseSlug]/[lessonSlug]` lesson page shell | P1 | M | 3h | Day 4 |
| 5.10 | Integrate Mux Player for video lessons | P1 | M | 4h | Day 5 |
| 5.11 | Integrate PDF.js for in-browser PDF rendering | P1 | M | 3h | Day 5 |
| 5.12 | Build downloadable files list with on-demand signed URL generation | P1 | S | 2h | Day 6 |
| 5.13 | Build mobile-responsive sidebar with collapse toggle | P1 | S | 2h | Day 6 |
