'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EyeOff, MailCheck } from 'lucide-react'
import { ICONS } from '@/assets/icons'
import { IMAGES } from '@/assets/images'
import { PasswordRequirements } from '@/components/auth/PasswordRequirements'
import { isStrongPassword, passwordProblem } from '@/lib/password-rules'

const inputClassName =
  'h-10 w-full rounded-[8px] border border-[#474348] bg-[#FFFFFF00] px-3 text-sm text-heading outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', acceptedTerms: true })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const problem = passwordProblem(form.password)
    if (problem) {
      setError(problem)
      return
    }
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
      }),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data?.message ?? 'Registration failed')
    } else {
      setRegisteredEmail(form.email)
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-101px)] bg-[#fffbfb] lg:grid-cols-[51%_49%]">
      <section className="relative hidden overflow-hidden bg-heading lg:block">
        <Image src={IMAGES.SignInHero} alt="Students reviewing coursework" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <Image src={IMAGES.SignInBg} alt="" fill className="object-cover opacity-70" />

        <div className="relative z-10 flex min-h-[calc(100vh-101px)] flex-col justify-end px-14 pb-16 text-white xl:px-16">
          <ICONS.StarsIcon className="mb-8 h-20 w-20" aria-hidden="true" />
          <h1 className="max-w-[560px] text-[44px] font-bold leading-[1.25] tracking-[-0.02em] xl:text-[64px]">
            Transforming Your Career
          </h1>
          <p className="mt-4 max-w-[590px] text-lg font-medium leading-7">
            Make your next career move with our online courses and access over 50 world-class courses.
          </p>

          <div className="mt-7 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[IMAGES.Image1, IMAGES.Image2, IMAGES.Image3, IMAGES.Image4, IMAGES.Image5].map((image, index) => (
                <span key={index} className="h-10 w-10 rounded-full border-2 border-white bg-white/90 shadow-sm">
                  <Image src={image} alt="" className="h-full w-full rounded-full object-cover" />
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
          {registeredEmail ? (
            <CheckEmailPanel email={registeredEmail} onBack={() => setRegisteredEmail(null)} />
          ) : (
          <>
          <h1 className="text-[24px] lg:text-[40px] font-semibold leading-tight text-heading">Sign Up</h1>
          <p className="mt-4 text-sm md:text-lg text-heading">Create Your Account to Get Started on TG Nexus</p>

          {error && <div className="mt-5 rounded-lg bg-secondary/10 p-3 text-sm text-secondary">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6" autoComplete="off">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block md:text-lg text-heading">
                First Name
                <input
                  className={`${inputClassName} mt-2`}
                  name="register-first-name"
                  autoComplete="off"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </label>
              <label className="block md:text-lg text-heading">
                Last Name
                <input
                  className={`${inputClassName} mt-2`}
                  name="register-last-name"
                  autoComplete="off"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </label>
            </div>

            <label className="mt-5 block md:text-lg text-heading">
              Email Address
              <input
                className={`${inputClassName} mt-2`}
                type="email"
                name="register-email"
                autoComplete="new-email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>

            <label className="mt-5 block md:text-lg text-heading">
              Password
              <span className="relative mt-2 block">
                <input
                  className={`${inputClassName} pr-11`}
                  type={showPassword ? 'text' : 'password'}
                  name="register-password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              <PasswordRequirements password={form.password} />
            </label>

            <label className="mt-6 flex items-start gap-3 text-xs md:text-base text-heading">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[#7A747B] accent-primary"
                checked={form.acceptedTerms}
                onChange={(e) => setForm({ ...form, acceptedTerms: e.target.checked })}
                required
              />
              <span>
                By accepting, you agree to our{' '}
                <Link href="/terms-of-use" className="font-medium underline">
                  Terms & Conditions.
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !isStrongPassword(form.password)}
              className="mt-7 h-12 w-full rounded-md bg-primary font-medium text-white transition-colors hover:bg-[#252d5d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm md:text-base text-heading">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold underline">
              Sign In
            </Link>
          </p>

          </>
          )}
        </div>
      </section>
    </main>
  )
}

function CheckEmailPanel({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <div className="text-center">
      <MailCheck className="mx-auto mb-5 h-14 w-14 text-primary" aria-hidden="true" />
      <h1 className="text-[24px] font-semibold leading-tight text-heading lg:text-[40px]">Check your email</h1>
      <p className="mt-4 text-sm text-heading md:text-lg">We&apos;ve sent a verification link to</p>
      <p className="mt-1 break-all text-sm font-semibold text-heading md:text-lg">{email}</p>
      <p className="mt-4 text-sm text-[#474348] md:text-base">
        Click the link in the email to verify your account, then sign in. The link expires in 24 hours. If you
        don&apos;t see it, check your spam folder.
      </p>
      <Link
        href="/login"
        className="mt-7 flex h-12 w-full items-center justify-center rounded-md bg-primary font-medium text-white transition-colors hover:bg-[#252d5d]"
      >
        Go to Sign In
      </Link>
      <p className="mt-4 text-sm text-heading md:text-base">
        Wrong email?{' '}
        <button type="button" onClick={onBack} className="font-semibold underline">
          Go back
        </button>
      </p>
    </div>
  )
}
