import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardShell } from '@/components/dashboard/shell/DashboardShell'

export const metadata: Metadata = {
  title: 'Dashboard — Tobams Academy',
  description: 'Your learning dashboard',
}

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || !session.accessToken || session.error === 'RefreshAccessTokenError') {
    redirect('/login?callbackUrl=/dashboard')
  }

  const userName = session.user.name ?? session.user.email ?? 'Learner'

  return <DashboardShell userName={userName}>{children}</DashboardShell>
}
