import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { err } from '@/lib/api-utils'
import { EXPIRED_MESSAGE, isAccessActive } from '@/lib/enrollment-access'
import { LOCKED_LESSON_MESSAGE, isLessonLocked } from '@/lib/week-locks'

export const MAX_SUBMISSION_BYTES = 10 * 1024 * 1024 // 10 MB

/** File types learners may upload, by extension → the type we store and serve them as. */
export const SUBMISSION_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
}

export const SUBMISSION_EXTENSIONS = Object.keys(SUBMISSION_TYPES)

export type SubmissionMeta = {
  id: string
  fileName: string
  mimeType: string
  size: number
  submittedAt: string
  updatedAt: string
}

export const submissionMetaSelect = {
  id: true,
  fileName: true,
  mimeType: true,
  size: true,
  submittedAt: true,
  updatedAt: true,
} as const

export function toSubmissionMeta(row: {
  id: string
  fileName: string
  mimeType: string
  size: number
  submittedAt: Date
  updatedAt: Date
}): SubmissionMeta {
  return {
    id: row.id,
    fileName: row.fileName,
    mimeType: row.mimeType,
    size: row.size,
    submittedAt: row.submittedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

/** Keep the learner's file name readable but safe for storage and a Content-Disposition header. */
export function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? ''
  const cleaned = base
    .replace(/[\u0000-\u001f\u007f"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return 'submission'
  if (cleaned.length <= 150) return cleaned
  const dot = cleaned.lastIndexOf('.')
  const ext = dot > 0 ? cleaned.slice(dot) : ''
  return cleaned.slice(0, 150 - ext.length) + ext
}

export function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
}

/** `attachment` header with an ASCII fallback and the UTF-8 name (RFC 6266). */
export function attachmentDisposition(fileName: string): string {
  const ascii = fileName.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_')
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
}

type AssignmentContext =
  | { error: NextResponse }
  | {
      error?: undefined
      lesson: { id: string; title: string; courseId: string; courseTitle: string }
      enrollment: { id: string; completedAt: Date | null; course: { title: string } }
    }

/** The assignment lesson plus the learner's active enrollment, or the error to return. */
export async function loadAssignmentForLearner(userId: string, lessonId: string): Promise<AssignmentContext> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      kind: true,
      module: { select: { courseId: true, course: { select: { title: true } } } },
    },
  })
  if (!lesson || lesson.kind !== 'ASSIGNMENT') return { error: err('Assignment not found', 404) }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.module.courseId } },
    select: { id: true, completedAt: true, expiresAt: true },
  })
  if (!enrollment) return { error: err('Not enrolled in this course', 403) }
  if (!isAccessActive(enrollment)) return { error: err(EXPIRED_MESSAGE, 403) }
  if (await isLessonLocked(userId, lessonId)) return { error: err(LOCKED_LESSON_MESSAGE, 403) }

  const courseTitle = lesson.module.course.title
  return {
    lesson: { id: lesson.id, title: lesson.title, courseId: lesson.module.courseId, courseTitle },
    enrollment: { id: enrollment.id, completedAt: enrollment.completedAt, course: { title: courseTitle } },
  }
}
