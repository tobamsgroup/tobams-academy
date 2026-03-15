# Epic 7: Learner Dashboard

**Status:** 🔴 Not Started
**Priority:** P1 — High
**Iteration:** 4 (Weeks 7–8)
**Total Estimate:** 30 hours
**Dependencies:** Epic 5 (Enrollments), Epic 6 (Progress), Epic 8 (Certificates)

## Overview

This epic delivers the personalised learner dashboard — the central hub after login. It covers the dashboard page, enrolled courses with progress, completed courses, a resume-course shortcut, recommended/featured courses, and the certificates list.

The dashboard is a **Client Component** page using multiple SWR hooks in parallel to fetch enrolled courses, progress summaries, certificates, and featured courses. Redux `uiSlice` manages dashboard-level UI state such as the active tab between "In Progress" and "Completed". The page is the first thing a learner sees after login and must load fast — SWR parallel fetching and skeleton loaders ensure perceived performance.

## Key Deliverables

- ✅ NestJS dashboard aggregation endpoint returning enrollments + progress + certificates in one call
- ✅ SWR hooks: `useDashboard()`, `useMyEnrollments()`, `useMyCertificates()`
- ✅ `/dashboard` page with welcome message, progress overview, and quick stats
- ✅ "My Courses" section: enrolled courses with progress bar and resume button
- ✅ "Completed" tab: courses with 100% progress and certificate download link
- ✅ "Resume Learning" shortcut card: last accessed course with direct lesson deep-link
- ✅ "Recommended Courses" section: featured published courses not yet enrolled
- ✅ "My Certificates" section with certificate cards and download buttons
- ✅ Empty states for each section (no enrollments, no completions, no certificates)
- ✅ Skeleton loaders for all SWR-loaded sections
- ✅ Redux `uiSlice` tab state for "In Progress" / "Completed" toggle

## Acceptance Criteria

- `/dashboard` redirects unauthenticated users to `/login` via NextAuth Middleware
- Dashboard loads enrolled courses with accurate progress percentages from SWR
- "Resume Learning" card links directly to the last incomplete lesson in the most recently accessed course
- Completed courses appear in "Completed" tab with a "Download Certificate" button
- "Recommended" section shows published courses the learner is not enrolled in
- All sections display correct empty states when no data exists
- Skeleton loaders appear during SWR loading and are replaced by content on resolve

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/dashboard/me` | Aggregated dashboard data (enrollments + progress + certificates) |
| GET | `/api/v1/enrollments/me` | My enrollments with progress summaries |
| GET | `/api/v1/certificates/me` | My earned certificates |

## Ticket Breakdown

| # | Title | Priority | Size | Hours | Day |
|---|-------|----------|------|-------|-----|
| 7.1 | Implement NestJS dashboard aggregation endpoint returning enrollments + progress + certificates | P1 | M | 4h | Day 1 |
| 7.2 | Implement last accessed lesson tracking on lesson page visits | P1 | S | 2h | Day 1 |
| 7.3 | Build SWR hooks: `useDashboard`, `useMyEnrollments`, `useMyCertificates` | P1 | S | 2h | Day 2 |
| 7.4 | Build `/dashboard` page layout with welcome message and quick stats | P1 | M | 3h | Day 2 |
| 7.5 | Build "My Courses" section with progress bars and resume buttons | P1 | M | 4h | Day 3 |
| 7.6 | Build "In Progress" / "Completed" tab toggle using Redux `uiSlice` | P1 | S | 2h | Day 3 |
| 7.7 | Build "Resume Learning" shortcut card with deep-link to last lesson | P1 | M | 3h | Day 4 |
| 7.8 | Build "Recommended Courses" section from featured published courses | P1 | S | 2h | Day 4 |
| 7.9 | Build "My Certificates" section with certificate cards and download links | P1 | S | 2h | Day 5 |
| 7.10 | Build empty states and skeleton loaders for all dashboard sections | P1 | M | 4h | Day 5 |
| 7.11 | Write component tests for dashboard sections | P1 | S | 2h | Day 6 |
