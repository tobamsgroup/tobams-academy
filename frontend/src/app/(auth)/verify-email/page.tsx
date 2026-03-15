import { Suspense } from 'react'
import { VerifyEmailContent } from './VerifyEmailContent'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-center text-slate-500">Verifying your email…</p>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
