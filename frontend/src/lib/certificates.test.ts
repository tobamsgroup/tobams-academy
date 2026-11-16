import { prisma } from '@/lib/prisma'
import { notify } from '@/lib/notifications'
import { sendCertificateEmail } from '@/lib/mail'
import {
  certificateFileName,
  findCertificateByNumber,
  generateCertificateNumber,
  issueCertificate,
} from '@/lib/certificates'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    certificate: { findUnique: jest.fn(), findUniqueOrThrow: jest.fn(), create: jest.fn(), update: jest.fn() },
    enrollment: { findUniqueOrThrow: jest.fn() },
  },
}))
jest.mock('@/lib/notifications', () => ({ notify: jest.fn() }))
jest.mock('@/lib/mail', () => ({ sendCertificateEmail: jest.fn() }))
jest.mock('@/lib/certificate-pdf', () => ({ renderCertificatePdf: jest.fn().mockResolvedValue(new Uint8Array([37, 80, 68, 70])) }))
jest.mock('@/lib/logger', () => ({ logger: { info: jest.fn(), error: jest.fn() } }))

const db = prisma as unknown as {
  certificate: { findUnique: jest.Mock; findUniqueOrThrow: jest.Mock; create: jest.Mock; update: jest.Mock }
  enrollment: { findUniqueOrThrow: jest.Mock }
}

describe('certificates', () => {
  beforeEach(() => jest.clearAllMocks())

  it('generates readable, unambiguous certificate numbers', () => {
    const n = generateCertificateNumber(new Date('2026-11-16'))
    expect(n).toMatch(/^TGA-2026-[A-HJ-NP-Z2-9]{8}$/)
  })

  it('builds a safe PDF file name', () => {
    expect(certificateFileName('Time Intelligence: Masterclass!')).toBe('Certificate-Time-Intelligence-Masterclass.pdf')
  })

  it('issues, emails and notifies once for a completed enrollment', async () => {
    db.certificate.findUnique.mockResolvedValue(null)
    db.enrollment.findUniqueOrThrow.mockResolvedValue({
      userId: 'u1',
      courseId: 'c1',
      completedAt: new Date('2026-11-16'),
      user: { name: ' Ada Lovelace ' },
      course: { title: 'Time Intelligence Masterclass' },
    })
    db.certificate.create.mockResolvedValue({ id: 'cert1' })
    db.certificate.findUniqueOrThrow.mockResolvedValue({
      id: 'cert1',
      certificateNumber: 'TGA-2026-ABCDEFGH',
      learnerName: 'Ada Lovelace',
      courseTitle: 'Time Intelligence Masterclass',
      issuedAt: new Date('2026-11-16'),
      user: { email: 'ada@example.com', name: 'Ada Lovelace' },
    })
    ;(sendCertificateEmail as jest.Mock).mockResolvedValue(true)

    const result = await issueCertificate('e1')

    expect(result).toEqual({ id: 'cert1', created: true })
    expect(db.certificate.create.mock.calls[0][0].data).toMatchObject({
      userId: 'u1',
      courseId: 'c1',
      enrollmentId: 'e1',
      learnerName: 'Ada Lovelace',
      courseTitle: 'Time Intelligence Masterclass',
    })
    expect(sendCertificateEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'ada@example.com',
        certificateNumber: 'TGA-2026-ABCDEFGH',
        fileName: 'Certificate-Time-Intelligence-Masterclass.pdf',
        verifyUrl: expect.stringContaining('/certificates/verify/TGA-2026-ABCDEFGH'),
      }),
    )
    expect(db.certificate.update).toHaveBeenCalledWith({ where: { id: 'cert1' }, data: { emailedAt: expect.any(Date) } })
    expect(notify).toHaveBeenCalledWith('u1', expect.objectContaining({ category: 'certificationAlerts' }))
  })

  it('does nothing when the certificate already exists', async () => {
    db.certificate.findUnique.mockResolvedValue({ id: 'cert1' })
    expect(await issueCertificate('e1')).toEqual({ id: 'cert1', created: false })
    expect(db.certificate.create).not.toHaveBeenCalled()
    expect(sendCertificateEmail).not.toHaveBeenCalled()
  })

  it('never throws (a certificate problem must not fail lesson completion)', async () => {
    db.certificate.findUnique.mockRejectedValue(new Error('db down'))
    await expect(issueCertificate('e1')).resolves.toBeNull()
  })

  it('verifies only well-formed numbers', async () => {
    expect(await findCertificateByNumber('not-a-number')).toBeNull()
    expect(db.certificate.findUnique).not.toHaveBeenCalled()
    db.certificate.findUnique.mockResolvedValue({
      certificateNumber: 'TGA-2026-ABCDEFGH',
      learnerName: 'Ada',
      courseTitle: 'TI',
      issuedAt: new Date('2026-11-16T00:00:00Z'),
    })
    expect(await findCertificateByNumber(' tga-2026-abcdefgh ')).toMatchObject({ issuedAt: '2026-11-16T00:00:00.000Z' })
    expect(db.certificate.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { certificateNumber: 'TGA-2026-ABCDEFGH' } }),
    )
  })
})
