'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MailCheck } from 'lucide-react'

const inputClassName =
  'h-10 w-full rounded-[8px] border border-[#474348] bg-[#FFFFFF00] px-3 text-sm text-heading outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) throw new Error('request failed')
      // The email contains a reset link (with a secure token); there is no OTP to enter.
      setSentTo(email.trim())
    } catch {
      setError('Unable to send the reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-101px)] bg-[#fffbfb] px-5 py-10 md:px-14">
      <Link href="/login" className="inline-flex items-center gap-4 text-sm font-medium text-heading">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
          <ArrowLeft size={18} aria-hidden="true" />
        </span>
        Back
      </Link>

      <section className="mx-auto mt-20 w-full max-w-[634px]">
        <div className="text-center">
          <h1 className="text-[32px] font-semibold leading-tight text-heading md:text-[56px]">Forgot Password?</h1>
          <p className="mt-3 text-sm text-heading md:text-base">Enter your email and we&apos;ll send you a link to reset your password</p>
        </div>

        {sentTo ? (
          <div className="mt-10 rounded-[12px] border border-[#E5E7EB] bg-white p-8 text-center">
            <MailCheck className="mx-auto h-12 w-12 text-primary" aria-hidden />
            <h2 className="mt-4 text-xl font-semibold text-heading">Check your email</h2>
            <p className="mt-2 text-sm text-[#474348] md:text-base">
              If an account exists for <span className="font-semibold text-heading">{sentTo}</span>, we&apos;ve sent a
              link to reset your password. It expires in 1 hour. Check your spam folder if you don&apos;t see it.
            </p>
            <button
              type="button"
              onClick={() => setSentTo(null)}
              className="mt-6 text-sm font-semibold text-primary underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
        <>
        {error && <div className="mt-6 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-7">
          <label className="block text-heading md:text-lg">
            Email Address
            <input
              className={`${inputClassName} mt-2`}
              type="email"
              name="forgot-password-email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 h-12 w-full rounded-[8px] bg-primary font-medium text-white transition-colors hover:bg-[#252d5d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>
        </>
        )}
      </section>
    </main>
  )
}
