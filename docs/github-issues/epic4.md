# Epic 4: Learning Materials & Content Upload

**Status:** 🔴 Not Started
**Priority:** P1 — High
**Iteration:** 2 (Weeks 3–4)
**Total Estimate:** 42 hours
**Dependencies:** Epic 1 (S3 config), Epic 3 (LessonsModule exists)

## Overview

This epic delivers all functionality for uploading, storing, and delivering learning content within lessons — including videos, PDFs, presentation slides, external links, and downloadable files. It covers the NestJS MaterialsModule, AWS S3 integration, Mux video processing, and the admin material management UI.

The NestJS `MaterialsModule` handles multipart file uploads via Multer, validates MIME types and file sizes, uploads files to S3 with AES-256 server-side encryption, and creates `materials` records linked to lessons. Video uploads are forwarded to Mux for processing into adaptive HLS streams. The admin UI provides a per-lesson material management panel built with SWR for real-time material listing and React Hook Form for upload forms.

## Key Deliverables

- ✅ NestJS MaterialsModule with Multer, S3 upload service, and MIME/size validation
- ✅ TypeORM migration for `materials` table (`type`, `title`, `url`, `file_size`, `order_index`)
- ✅ S3 upload service with AES-256 SSE, organised bucket paths per course/lesson
- ✅ Mux integration: video upload → Mux asset creation → webhook updating material with playback ID
- ✅ Signed S3 URL generation for secure PDF and file downloads
- ✅ Support for material types: `video`, `pdf`, `slides`, `file`, `link`
- ✅ External link material type (no upload, just URL + title)
- ✅ SWR hook: `useLessonMaterials(lessonId)`
- ✅ Admin lesson material panel: list, upload, reorder, delete materials
- ✅ File upload component with drag-and-drop, progress bar, and type validation
- ✅ Video upload flow with Mux processing status indicator
- ✅ Unit tests for MaterialsService, S3 upload, and MIME validation (>85% coverage)

## Acceptance Criteria

- `POST /api/v1/admin/lessons/:id/materials` with a PDF file uploads to S3 and returns material record with signed URL
- `POST /api/v1/admin/lessons/:id/materials` with a video file creates a Mux asset and stores `mux_asset_id` and `mux_playback_id`
- S3 objects are created with `ServerSideEncryption: AES256` (verifiable in AWS console)
- Files with disallowed MIME types (e.g. `.exe`) are rejected with 400
- Files exceeding 500MB are rejected with 400
- Signed URLs for PDFs expire after 1 hour
- Mux webhook `video.asset.ready` updates the material record status to `ready`
- Admin material panel lists all materials for a lesson and allows delete/reorder

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/admin/lessons/:id/materials` | Upload material to lesson |
| GET | `/api/v1/admin/lessons/:id/materials` | List materials for a lesson |
| PATCH | `/api/v1/admin/materials/:id` | Update material metadata |
| DELETE | `/api/v1/admin/materials/:id` | Delete material and S3 object |
| PATCH | `/api/v1/admin/materials/reorder` | Reorder materials within a lesson |
| POST | `/api/v1/webhooks/mux` | Mux webhook receiver |
| GET | `/api/v1/materials/:id/download` | Generate signed S3 download URL |

## Ticket Breakdown

| # | Title | Priority | Size | Hours | Day |
|---|-------|----------|------|-------|-----|
| 4.1 | Implement NestJS MaterialsModule: entity, migration, CRUD service | P1 | M | 4h | Day 1 |
| 4.2 | Implement S3 upload service with Multer, MIME validation, size limits, and SSE | P1 | L | 5h | Day 1 |
| 4.3 | Implement Mux integration: upload forwarding, asset creation, playback ID storage | P1 | L | 5h | Day 2 |
| 4.4 | Implement Mux webhook receiver updating material status on `video.asset.ready` | P1 | M | 3h | Day 2 |
| 4.5 | Implement signed S3 URL generation for secure file downloads | P1 | S | 2h | Day 3 |
| 4.6 | Implement external link material type endpoint | P1 | S | 2h | Day 3 |
| 4.7 | Build SWR hook `useLessonMaterials` and admin lesson material panel UI | P1 | M | 4h | Day 4 |
| 4.8 | Build file upload component with drag-and-drop, progress bar, and type validation | P1 | L | 5h | Day 4 |
| 4.9 | Build video upload flow with Mux processing status polling | P1 | M | 3h | Day 5 |
| 4.10 | Build external link add form in material panel | P1 | S | 2h | Day 5 |
| 4.11 | Write unit tests for MaterialsService, S3 service, MIME validation (>85% coverage) | P1 | L | 5h | Day 6 |
