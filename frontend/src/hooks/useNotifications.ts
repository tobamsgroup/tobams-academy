import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import type { ApiNotification } from '@/types/notifications'

export function useNotifications() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const swrKey = status === 'authenticated' && accessToken ? '/notifications' : null

  const { data, error, isLoading, mutate } = useSWR<ApiNotification[]>(
    swrKey,
    createFetcher(accessToken),
  )

  const markAllRead = useCallback(async () => {
    if (!accessToken) throw new Error('Not authenticated')
    const client = createAuthedClient(accessToken)
    await client.patch('/notifications/mark-all-read')
    await mutate(
      (current) => current?.map((n) => (n.isRead ? n : { ...n, isRead: true })),
      { revalidate: false },
    )
  }, [accessToken, mutate])

  const deleteMany = useCallback(
    async (ids: string[]) => {
      if (!accessToken) throw new Error('Not authenticated')
      if (ids.length === 0) return
      const client = createAuthedClient(accessToken)
      await client.delete('/notifications', { data: { ids } })
      const idSet = new Set(ids)
      await mutate(
        (current) => current?.filter((n) => !idSet.has(n.id)),
        { revalidate: false },
      )
    },
    [accessToken, mutate],
  )

  return {
    notifications: data ?? [],
    error,
    isLoading: isLoading || status === 'loading',
    mutate,
    markAllRead,
    deleteMany,
  }
}
