import { randomInt } from 'node:crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { notify } from '@/lib/notifications'
import { sendCertificateEmail } from '@/lib/mail'
import { renderCertificatePdf } from '@/lib/certificate-pdf'

const NUMBER_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no look-alikes (I, O, 0, 1)

/** e.g. TGA-2026-7K3QX9PD */
export function generateCertificateNumber(now = new Date()): string {
  const suffix = Array.from({ length: 8 }, () => NUMBER_ALPHABET[randomInt(0, NUMBER_ALPHABET.length)]).join('')
  return `TGA-${now.getUTCFullYear()}-${suffix}`
}

export function certificateVerifyUrl(certificateNumber: string): string {
  const base = (process.env.CLIENT_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  return `${base}/certificates/verify/${certificateNumber}`
}

export function certificateFileName(courseTitle: string): string {
  const safe = courseTitle.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'Course'
  return `Certificate-${safe}.pdf`
}

type CertificateRow = {
  id: string
  certificateNumber: string
  learnerName: string
  courseTitle: string
  issuedAt: Date
}

export function renderCertificate(row: CertificateRow) {
  return renderCertificatePdf({
    learnerName: row.learnerName,
    courseTitle: row.courseTitle,
    certificateNumber: row.certificateNumber,
    issuedAt: row.issuedAt,
    verifyUrl: certificateVerifyUrl(row.certificateNumber),
  })
}

/** Emails the certificate PDF to its owner and records when it was sent. */
export async function emailCertificate(certificateId: string): Promise<boolean> {
  const cert = await prisma.certificate.findUniqueOrThrow({
    where: { id: certificateId },
    include: { user: { select: { email: true, name: true } } },
  })
  const pdf = await renderCertificate(cert)
  const sent = await sendCertificateEmail({
    to: cert.user.email,
    name: cert.learnerName,
    courseTitle: cert.courseTitle,
    certificateNumber: cert.certificateNumber,
    verifyUrl: certificateVerifyUrl(cert.certificateNumber),
    pdf,
    fileName: certificateFileName(cert.courseTitle),
  })
  if (sent) await prisma.certificate.update({ where: { id: cert.id }, data: { emailedAt: new Date() } })
  return sent
}

/**
 * Issues the certificate for a completed enrollment (once), emails it with the PDF attached
 * and notifies the learner. Safe to call repeatedly: an existing certificate is returned as is.
 * Never throws, so a certificate problem can't fail the lesson completion that triggered it.
 */
export async function issueCertificate(enrollmentId: string): Promise<{ id: string; created: boolean } | null> {
  try {
    const existing = await prisma.certificate.findUnique({ where: { enrollmentId }, select: { id: true } })
    if (existing) return { id: existing.id, created: false }

    const enrollment = await prisma.enrollment.findUniqueOrThrow({
      where: { id: enrollmentId },
      select: {
        userId: true,
        courseId: true,
        completedAt: true,
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    })

    let cert: { id: string } | null = null
    for (let attempt = 0; attempt < 5 && !cert; attempt++) {
      try {
        cert = await prisma.certificate.create({
          data: {
            certificateNumber: generateCertificateNumber(),
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            enrollmentId,
            learnerName: enrollment.user.name.trim(),
            courseTitle: enrollment.course.title,
            issuedAt: enrollment.completedAt ?? new Date(),
          },
          select: { id: true },
        })
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') throw error
        // Unique clash: either a parallel request issued it already, or the number collided.
        const raced = await prisma.certificate.findUnique({ where: { enrollmentId }, select: { id: true } })
        if (raced) return { id: raced.id, created: false }
      }
    }
    if (!cert) throw new Error('Could not allocate a certificate number')

    const emailed = await emailCertificate(cert.id)
    await notify(enrollment.userId, {
      type: 'COURSE_UPDATE',
      title: 'Your certificate is ready',
      message: emailed
        ? `Your certificate for "${enrollment.course.title}" has been emailed to you. You can also download it from My Courses.`
        : `Your certificate for "${enrollment.course.title}" is ready to download from My Courses.`,
      category: 'certificationAlerts',
    })
    logger.info('Certificate issued', { enrollmentId, certificateId: cert.id, emailed })
    return { id: cert.id, created: true }
  } catch (error) {
    logger.error('Failed to issue certificate', {
      enrollmentId,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

/** Public details of a certificate (only what is printed on it), or null if unknown. */
export async function findCertificateByNumber(number: string) {
  const normalized = number.trim().toUpperCase()
  if (!/^TGA-\d{4}-[A-Z0-9]{8}$/.test(normalized)) return null
  const cert = await prisma.certificate.findUnique({
    where: { certificateNumber: normalized },
    select: { certificateNumber: true, learnerName: true, courseTitle: true, issuedAt: true },
  })
  return cert ? { ...cert, issuedAt: cert.issuedAt.toISOString() } : null
}
