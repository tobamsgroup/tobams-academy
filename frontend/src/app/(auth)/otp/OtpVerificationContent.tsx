'use client'

import { type ClipboardEvent, type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const OTP_LENGTH = 6
const RESEND_SECONDS = 30

export default function OtpVerificationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? 'your email address'
  const isResetFlow = searchParams.get('flow') === 'reset'
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const isComplete = code.every(Boolean)

  useEffect(() => {
    if (secondsLeft === 0) return

    const timer = window.setTimeout(() => {
      setSecondsLeft((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)

    setCode((current) => {
      const next = [...current]
      next[index] = digit
      return next
    })

    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      focusInput(index - 1)
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pastedDigits) return

    event.preventDefault()

    setCode((current) => {
      const next = [...current]
      pastedDigits.split('').forEach((digit, index) => {
        next[index] = digit
      })
      return next
    })

    focusInput(Math.min(pastedDigits.length, OTP_LENGTH - 1))
  }

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return

    setCode(Array(OTP_LENGTH).fill(''))
    setSecondsLeft(RESEND_SECONDS)
    focusInput(0)

    if (!isResetFlow || email === 'your email address') return

    setResending(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setResending(false)
  }

  const handleVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isComplete) return

    const otp = code.join('')
    setVerifying(true)

    window.setTimeout(() => {
      if (isResetFlow) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(otp)}`)
        return
      }

      router.push('/login?registered=1')
    }, 300)
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
            <ArrowLeft size={18} />
          </span>
          Back
        </button>

        <section className="mx-auto mt-12 flex w-full max-w-[552px] flex-1 items-start justify-center md:mt-14">
          <div className="w-full rounded-[6px] border border-[#D3D2D3] bg-white px-6 py-14 text-center md:px-12 md:py-16">
            <h1 className="text-[28px] font-bold leading-tight text-heading md:text-[32px]">
              {isResetFlow ? 'OTP Verification' : 'Email Verification'}
            </h1>
            <p className="mx-auto mt-4 max-w-[420px] text-sm leading-6 text-[#474348] md:text-base">
              A verification code has been sent to {email}, Please enter it below to continue.
            </p>

            <form onSubmit={handleVerify} className="mt-8">
              <div className="flex justify-center gap-3 md:gap-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    aria-label={`Verification code digit ${index + 1}`}
                    placeholder="0"
                    value={digit}
                    onChange={(event) => updateDigit(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    className="h-10 w-10 rounded-[5px] border border-[#474348] bg-white text-center text-lg text-heading outline-none transition-colors placeholder:text-[#C9C6C9] focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:border-[#D3D2D3] disabled:text-[#C9C6C9]"
                    disabled={verifying}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={!isComplete || verifying}
                className="mt-10 h-12 w-full rounded-[6px] bg-primary text-sm font-medium text-white transition-colors hover:bg-[#252d5d] disabled:cursor-not-allowed disabled:bg-[#A6ADC9]"
              >
                {verifying ? 'Verifying...' : 'Verify'}
              </button>
            </form>

            <p className="mt-6 text-sm text-heading">
              Didn&apos;t receive the OTP?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0 || resending}
                className="font-medium text-primary underline disabled:cursor-not-allowed disabled:opacity-100"
              >
                {resending ? 'Resending...' : secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend Now'}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
