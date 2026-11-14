'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { EyeOff, ShieldCheck } from 'lucide-react'
import { ICONS } from '@/assets/icons'
import { IMAGES } from '@/assets/images'

const inputClassName =
  'h-10 w-full rounded-[8px] border border-[#474348] bg-[#FFFFFF00] px-3 text-sm text-heading outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15'

export default function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // Two-factor step: shown after the password is accepted for an account with 2FA on.
  const [needsCode, setNeedsCode] = useState(false)
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState('')

  const attemptSignIn = async (otp?: string) => {
    setError('')
    setNotice('')
    setLoading(true)
    const result = await signIn('credentials', { email, password, otp: otp ?? '', redirect: false })
    setLoading(false)
    if (!result?.error) {
      router.push(callbackUrl)
      return
    }
    // Anything other than a credentials rejection (e.g. "Configuration") is a server problem;
    // don't tell the user their password is wrong when it may not be.
    if (result.error !== 'CredentialsSignin') {
      setError("We couldn't sign you in because of a problem on our side. Please try again shortly.")
      return
    }
    switch (result.code) {
      case 'two_factor_required':
        setNeedsCode(true)
        setCode('')
        setNotice(`We emailed a 6-digit code to ${email.trim()}. It expires in 10 minutes.`)
        return
      case 'invalid_otp':
        setError('That code is incorrect. Check the email and try again.')
        return
      case 'otp_expired':
        setCode('')
        setError('That code has expired or was entered wrongly too many times. Request a new code.')
        return
      case 'email_not_verified':
        setError('Please verify your email before logging in')
        return
      default:
        setNeedsCode(false)
        setError('Invalid email or password')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void attemptSignIn(needsCode ? code : undefined)
  }

  return (
    <main className="grid min-h-[calc(100vh-101px)] bg-[#fffbfb] lg:grid-cols-[51%_49%]">
      <section className="relative hidden overflow-hidden bg-heading lg:block">
        <Image src={IMAGES.LoginBg} alt="Students reviewing coursework" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <Image src={IMAGES.SignInBg} alt="" fill className="object-cover opacity-70" />

        <div className="relative z-10 flex min-h-[calc(100vh-101px)] flex-col justify-end px-14 pb-16 text-white xl:px-16">
          <ICONS.StarsIcon  aria-hidden="true" />
          <h1 className="max-w-[560px] text-[44px] font-bold leading-[1.25] tracking-[-0.02em] xl:text-[64px]">
            Transforming Your Career
          </h1>
          <p className="mt-4 max-w-[590px] text-lg font-medium leading-7">
            Make your next career move with our online courses and access over 50 world-class courses.
          </p>

          <div className="mt-7 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[0, 1, 2, 3, 4].map((item) => (
                <span key={item} className="h-10 w-10 rounded-full border-2 border-white bg-white/90 shadow-sm">
                  <Image src={IMAGES.profile} alt="" className="h-full w-full rounded-full object-cover" />
                </span>
              ))}
            </div>
            <div className="font-medium leading-5">
              <div className="flex items-center gap-1 text-[#FFE140]" aria-label="5 star rating">
                {'★★★★★'}
                <span className="ml-1 text-white">5.0</span>
              </div>
              <p>from 200+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12 lg:px-12">
        <div className="w-full max-w-[486px]">
          <h1 className="text-[24px] font-semibold leading-tight text-heading lg:text-[40px]">Welcome Back</h1>
          <p className="mt-4 text-sm text-heading md:text-lg">Enter your details below</p>

          {error && <div className="mt-5 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</div>}
          {notice && <div className="mt-5 rounded-lg bg-[#EEF0F6] p-3 text-sm text-primary">{notice}</div>}

          {needsCode ? (
            <form onSubmit={handleSubmit} className="mt-6" autoComplete="off">
              <div className="mb-4 flex items-center gap-2 text-heading">
                <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
                <span className="font-medium">Two-factor verification</span>
              </div>
              <label className="block text-heading md:text-lg">
                Verification code
                <input
                  className={`${inputClassName} mt-2 tracking-[0.4em]`}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="mt-7 h-12 w-full rounded-md bg-primary font-medium text-white transition-colors hover:bg-[#252d5d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify and log in'}
              </button>
              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void attemptSignIn()}
                  className="font-medium text-primary underline disabled:opacity-50"
                >
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNeedsCode(false)
                    setCode('')
                    setNotice('')
                    setError('')
                  }}
                  className="text-heading underline"
                >
                  Use a different account
                </button>
              </div>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="mt-6" autoComplete="off">
            <label className="block text-heading md:text-lg">
              Email Address
              <input
                className={`${inputClassName} mt-2`}
                type="email"
                name="login-email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="mt-5 block text-heading md:text-lg">
              Password
              <span className="relative mt-2 block">
                <input
                  className={`${inputClassName} pr-11`}
                  type={showPassword ? 'text' : 'password'}
                  name="login-password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <div className="mt-3 text-right">
              <Link href="/forgot-password" className="text-sm font-medium text-primary underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 h-12 w-full rounded-md bg-primary font-medium text-white transition-colors hover:bg-[#252d5d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          )}

          <p className="mt-4 text-center text-sm text-heading md:text-base">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold underline">
              Sign Up
            </Link>
          </p>

        </div>
      </section>
    </main>
  )
}
