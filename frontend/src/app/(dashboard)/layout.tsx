import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { DashboardShell } from '@/components/dashboard/shell/DashboardShell'

export const metadata: Metadata = {
  title: 'Dashboard — Tobams Academy',
  description: 'Your learning dashboard',
}

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const userName =
    session?.user?.name ?? session?.user?.email ?? 'Guest'

  return <DashboardShell userName={userName}>{children}</DashboardShell>
}
