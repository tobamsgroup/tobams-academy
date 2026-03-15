'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data?.message ?? 'Registration failed')
    } else {
      router.push('/login?registered=1')
    }
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
