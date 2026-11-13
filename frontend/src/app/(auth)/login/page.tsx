import { Suspense } from 'react'
import LoginContent from './LoginContent'

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-[calc(100vh-101px)] bg-[#fffbfb]" />}>
      <LoginContent />
    </Suspense>
  )
}
