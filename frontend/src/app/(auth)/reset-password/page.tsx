'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, EyeOff } from 'lucide-react'
import { ICONS } from '@/assets/icons'

const inputClassName =
  'h-10 w-full rounded-[8px] border border-[#474348] bg-[#FFFFFF00] px-3 text-sm text-heading outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const token = new URLSearchParams(window.location.search).get('token')

    if (!token) {
      setError('This reset link is invalid or has expired.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)

    if (!response.ok) {
      setError('Unable to reset password. Please request a new OTP and try again.')
      return
    }

    router.push('/login?reset=1')
  }

  return (
    <main className="min-h-[calc(100vh-101px)] bg-[#fffbfb] shadow-[inset_0_4px_14px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex min-h-[calc(100vh-101px)] w-full max-w-[980px] flex-col px-5 py-10 md:px-0 md:py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex w-fit items-center gap-5 text-base text-heading"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <ArrowLeft size={18} aria-hidden="true" />
          </span>
          Back
        </button>

        <section className="mx-auto mt-16 w-full max-w-[634px] md:mt-20">
          <div className="text-center">
            <h1 className="text-[32px] font-semibold leading-tight text-heading md:text-[48px]">Reset Password</h1>
            <p className="mt-3 text-sm text-heading md:text-base">Create your new password</p>
          </div>

          {error && <div className="mt-6 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-7">
            <label className="block text-heading md:text-lg">
              Password
              <span className="relative mt-2 block">
                <input
                  className={`${inputClassName} pr-11`}
                  type={showPassword ? 'text' : 'password'}
                  name="reset-password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <ICONS.EyeFill />}
                </button>
              </span>
            </label>

            <label className="mt-5 block text-heading md:text-lg">
              Confirm Password
              <span className="relative mt-2 block">
                <input
                  className={`${inputClassName} pr-11`}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="reset-confirm-password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <ICONS.EyeFill />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 h-12 w-full rounded-md bg-primary font-medium text-white transition-colors hover:bg-[#252d5d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
