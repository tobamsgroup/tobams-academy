/**
 * Issues (and emails) certificates for enrollments that were completed before certificates
 * existed. New completions get theirs automatically.
 *
 *   npx tsx scripts/issue-certificates.ts            # list who would get one
 *   npx tsx scripts/issue-certificates.ts --send     # issue and email them
 */
import './load-env'
import { prisma } from './prisma'
import { issueCertificate } from '../src/lib/certificates'

async function main() {
  const pending = await prisma.enrollment.findMany({
    where: { completedAt: { not: null }, certificate: null },
    select: { id: true, user: { select: { email: true } }, course: { select: { title: true } } },
  })
  console.log(`${pending.length} completed enrollment(s) without a certificate`)
  for (const e of pending) console.log(`  ${e.user.email} · ${e.course.title}`)
  if (!process.argv.includes('--send')) {
    if (pending.length) console.log('Dry run: re-run with --send to issue and email them.')
    return
  }
  for (const e of pending) {
    const result = await issueCertificate(e.id)
    console.log(`${result?.created ? 'issued' : 'FAILED'}  ${e.user.email} · ${e.course.title}`)
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
