'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MailCheck } from 'lucide-react'
import axios from 'axios'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, form)
      setRegisteredEmail(form.email)
    } catch (e) {
      const message = axios.isAxiosError(e)
        ? (e.response?.data?.message ?? 'Registration failed')
        : 'Registration failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (registeredEmail) {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto mb-4 h-12 w-12 text-[#571244]" />
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Check your email</h1>
        <p className="mb-1 text-sm text-slate-500">We&apos;ve sent a verification link to</p>
        <p className="mb-4 break-all text-sm font-semibold text-slate-900">{registeredEmail}</p>
        <p className="mb-6 text-sm text-slate-500">
          Click the link in the email to verify your account, then sign in. The link expires in 24 hours.
          If you don&apos;t see it, check your spam folder.
        </p>
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#571244] to-[#EF4353] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[#EF4353]/40"
        >
          Go to sign in
        </Link>
        <p className="mt-5 text-sm text-slate-500">
          Wrong email?{' '}
          <button
            type="button"
            onClick={() => setRegisteredEmail(null)}
            className="font-semibold text-[#571244] hover:underline"
          >
            Go back
          </button>
        </p>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Create account</h1>
      <p className="mb-6 text-sm text-slate-500">Start your learning journey today</p>
      {error && <div className="mb-4 rounded-lg bg-[#EF4353]/10 p-3 text-sm text-[#EF4353]">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        <Button type="submit" loading={loading} className="w-full">Create Account</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#571244] hover:underline">Sign in</Link>
      </p>
    </>
  )
}
