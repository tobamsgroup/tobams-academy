'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      const messages: Record<string, string> = {
        email_not_verified: 'Please verify your email before logging in',
        invalid_credentials: 'Invalid email or password',
      }
      setError(messages[result.code ?? ''] ?? 'Invalid email or password')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-500">Sign in to continue learning</p>
      {error && <div className="mb-4 rounded-lg bg-[#EF4353]/10 p-3 text-sm text-[#EF4353]">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-[#571244] hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">Sign In</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        No account?{' '}
        <Link href="/register" className="font-semibold text-[#571244] hover:underline">Create one</Link>
      </p>
    </>
  )
}
