'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-3 text-4xl">📬</div>
        <h2 className="mb-2 text-xl font-bold text-slate-900">Check your email</h2>
        <p className="text-sm text-slate-500">If that email exists, a reset link has been sent.</p>
        <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-[#571244] hover:underline">Back to login</Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Reset password</h1>
      <p className="mb-6 text-sm text-slate-500">We'll send a reset link to your email</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-[#571244] hover:underline">Back to login</Link>
      </p>
    </>
  )
}
