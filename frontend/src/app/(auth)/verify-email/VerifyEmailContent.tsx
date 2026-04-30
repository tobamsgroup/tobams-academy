'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'

export function VerifyEmailContent() {
  const params = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const verify = async () => {
      if (!token) { setStatus('error'); return }
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`)
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }
    void verify()
  }, [token])

  return (
    <div className="text-center">
      {status === 'loading' && <p className="text-slate-500">Verifying your email…</p>}
      {status === 'success' && (
        <>
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
          <h2 className="mb-2 text-xl font-bold text-slate-900">Email verified!</h2>
          <p className="mb-6 text-sm text-slate-500">Your account is ready. Sign in to start learning.</p>
          <Link href="/login" className="font-semibold text-[#571244] hover:underline">Go to login</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle className="mx-auto mb-3 h-12 w-12 text-[#EF4353]" />
          <h2 className="mb-2 text-xl font-bold text-slate-900">Verification failed</h2>
          <p className="text-sm text-slate-500">This link is invalid or has expired.</p>
        </>
      )}
    </div>
  )
}
