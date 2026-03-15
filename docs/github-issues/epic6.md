# Epic 6: Progress Tracking & Course Completion

**Status:** 🔴 Not Started
**Priority:** P1 — High
**Iteration:** 3 (Weeks 5–6)
**Total Estimate:** 36 hours
**Dependencies:** Epic 5 (EnrollmentsModule, `lesson_progress` rows exist)

## Overview

This epic delivers all progress tracking functionality — marking lessons complete, calculating progress percentages, detecting course completion, and triggering the completion confirmation flow. It covers the NestJS ProgressModule, progress calculation service, completion event handling, and all frontend progress UI components.

Progress state is managed with SWR, revalidating after each "Mark as Complete" action. The progress percentage is calculated server-side on each request to ensure accuracy. Redux `learnerSlice` stores optimistic completion state so the sidebar updates immediately on click without waiting for the API round-trip. When all lessons are marked complete, the backend emits a course completion event that triggers certificate generation (via a queue task) and the NestJS response includes a `courseCompleted: true` flag that the frontend uses to show the completion screen.

## Key Deliverables

- ✅ NestJS ProgressModule: mark lesson complete, get course progress, detect completion
- ✅ Progress calculation service returning `completedLessons`, `totalLessons`, `percentage`
- ✅ Course completion detection: when all `lesson_progress` rows are complete, mark enrollment `completed_at`
- ✅ Completion event triggering certificate generation task (async, non-blocking)
- ✅ SWR hook: `useCourseProgress(courseId)` revalidating on mutation
- ✅ Redux optimistic update in `learnerSlice` on lesson complete click
- ✅ "Mark as Complete" button on lesson page with loading and success state
- ✅ Progress bar component used in sidebar and dashboard
- ✅ Lesson completion checkmarks in course sidebar (optimistic + confirmed)
- ✅ Course completion screen: full-page congratulations with certificate CTA
- ✅ Unit tests for ProgressService and completion detection logic (>85% coverage)

## Acceptance Criteria

- `POST /api/v1/progress/lessons/:id/complete` sets `is_completed = true` on the `lesson_progress` row and returns updated progress
- Progress percentage recalculates correctly after each lesson completion
- Completing the final lesson sets `enrollment.completed_at` and returns `courseCompleted: true`
- Sidebar lesson checkmarks update immediately on click (optimistic) before API confirms
- Progress bar in the sidebar accurately reflects percentage from SWR data
- Course completion screen renders when `courseCompleted: true` is returned
- Revisiting a completed lesson shows it as already complete with no ability to un-complete

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/progress/lessons/:id/complete` | Mark lesson as complete |
| GET | `/api/v1/progress/courses/:courseId` | Get full progress for a course |
| GET | `/api/v1/progress/courses/:courseId/summary` | Get progress percentage summary |

## Ticket Breakdown

| # | Title | Priority | Size | Hours | Day |
|---|-------|----------|------|-------|-----|
| 6.1 | Implement NestJS ProgressModule: mark complete endpoint and service | P1 | M | 4h | Day 1 |
| 6.2 | Implement progress calculation service (completed, total, percentage) | P1 | M | 3h | Day 1 |
| 6.3 | Implement course completion detection and `enrollment.completed_at` update | P1 | M | 3h | Day 2 |
| 6.4 | Implement async completion event triggering certificate generation task | P1 | M | 3h | Day 2 |
| 6.5 | Build SWR hook `useCourseProgress` with revalidation on mark-complete mutation | P1 | S | 2h | Day 3 |
| 6.6 | Build Redux optimistic update for lesson completion in `learnerSlice` | P1 | S | 2h | Day 3 |
| 6.7 | Build "Mark as Complete" button with loading and confirmed states | P1 | S | 2h | Day 4 |
| 6.8 | Build progress bar component (used in sidebar, dashboard, my-courses) | P1 | S | 2h | Day 4 |
| 6.9 | Integrate completion checkmarks in course sidebar using optimistic state | P1 | S | 2h | Day 4 |
| 6.10 | Build course completion screen with congratulations message and certificate CTA | P1 | M | 4h | Day 5 |
| 6.11 | Write unit tests for ProgressService and completion detection (>85% coverage) | P1 | M | 4h | Day 6 |
| 6.12 | Integration test: full lesson-completion → course-completion flow | P1 | M | 3h | Day 6 |
