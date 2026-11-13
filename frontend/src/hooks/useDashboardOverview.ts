import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createFetcher } from '@/lib/fetcher'
import type { DashboardOverview } from '@/types/dashboard'

/** Learner dashboard data (continue learning, insights, engagement). Shared by all sections. */
export function useDashboardOverview() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken
  const key = status === 'authenticated' && accessToken ? '/dashboard/overview' : null

  const { data, error, isLoading } = useSWR<DashboardOverview>(key, createFetcher(accessToken), {
    revalidateOnFocus: true,
  })

  return { overview: data, error, isLoading: isLoading || status === 'loading' }
}
