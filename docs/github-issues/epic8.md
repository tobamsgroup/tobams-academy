# Epic 8: Certificates & Completion Recognition

**Status:** 🔴 Not Started
**Priority:** P2 — Medium
**Iteration:** 4 (Weeks 7–8)
**Total Estimate:** 28 hours
**Dependencies:** Epic 6 (Completion detection and trigger event)

## Overview

This epic delivers certificate generation and delivery when a learner completes all lessons in a course. It covers the NestJS CertificatesModule, PDF generation using `pdf-lib`, S3 storage of generated certificate PDFs, and the certificate download and viewing experience on the frontend.

When course completion is detected in Epic 6, an async BullMQ task triggers certificate generation. The certificate is rendered as a styled PDF with the learner's name, course title, completion date, and instructor name, then uploaded to S3. The `certificates` record is created with the S3 URL. On the frontend, certificates are accessible from the dashboard and a dedicated `/certificates` page, with one-click PDF download via a signed S3 URL.

## Key Deliverables

- ✅ NestJS CertificatesModule: generate, store, retrieve certificates
- ✅ TypeORM migration for `certificates` table
- ✅ Certificate PDF generation using `pdf-lib` with styled template (name, course, date, instructor)
- ✅ Async certificate generation triggered by course completion event (BullMQ queue task)
- ✅ S3 upload of generated certificate PDF with unique path
- ✅ Signed S3 URL generation for secure certificate download
- ✅ SWR hooks: `useCertificate(courseId)`, `useMyCertificates()`
- ✅ `/certificates` page listing all earned certificates
- ✅ Certificate card component with preview and download button
- ✅ Certificate download triggering signed URL fetch and browser download
- ✅ Completion screen (from Epic 6) updated to show certificate download CTA

## Acceptance Criteria

- Completing a course triggers async certificate generation within 30 seconds
- Generated PDF includes learner name, course title, completion date, and instructor name
- Certificate PDF is stored in S3 under a unique, non-guessable path
- `GET /api/v1/certificates/me` returns all certificates for the current user
- `GET /api/v1/certificates/:id/download` returns a signed S3 URL expiring in 1 hour
- Certificate download link on the dashboard successfully downloads the PDF
- `/certificates` page shows all earned certificates with correct course and date info

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/certificates/me` | List current user's certificates |
| GET | `/api/v1/certificates/:id` | Get certificate detail |
| GET | `/api/v1/certificates/:id/download` | Get signed S3 download URL |

## Ticket Breakdown

| # | Title | Priority | Size | Hours | Day |
|---|-------|----------|------|-------|-----|
| 8.1 | Implement NestJS CertificatesModule: entity, migration, service | P2 | M | 4h | Day 1 |
| 8.2 | Implement PDF generation with `pdf-lib`: styled certificate template | P2 | L | 5h | Day 1 |
| 8.3 | Implement BullMQ certificate generation queue task triggered on course completion | P2 | M | 4h | Day 2 |
| 8.4 | Implement S3 upload of generated certificate and signed URL download endpoint | P2 | S | 2h | Day 2 |
| 8.5 | Build SWR hooks: `useCertificate`, `useMyCertificates` | P2 | S | 2h | Day 3 |
| 8.6 | Build `/certificates` page with certificate card components | P2 | M | 3h | Day 3 |
| 8.7 | Build certificate download flow (signed URL → browser download trigger) | P2 | S | 2h | Day 4 |
| 8.8 | Update course completion screen (Epic 6) with certificate download CTA | P2 | S | 2h | Day 4 |
| 8.9 | Write unit tests for CertificatesService and PDF generation | P2 | M | 4h | Day 5 |
