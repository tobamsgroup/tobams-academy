import { useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import type { NotificationPreferenceField, NotificationPreferences } from '@/lib/notification-preferences'

function extractApiError(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    return response?.data?.message
  }
  return undefined
}

export function useNotificationPreferences() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken
  const [updateError, setUpdateError] = useState('')

  const swrKey =
    status === 'authenticated' && accessToken ? '/users/me/notification-preferences' : null

  const { data, error, isLoading, mutate } = useSWR<NotificationPreferences>(
    swrKey,
    createFetcher(accessToken),
  )

  const updatePreference = useCallback(
    async (field: NotificationPreferenceField, value: boolean) => {
      if (!accessToken || !data) throw new Error('Not authenticated')
      setUpdateError('')

      const optimistic = { ...data, [field]: value }
      await mutate(optimistic, { revalidate: false })

      try {
        const client = createAuthedClient(accessToken)
        const res = await client.patch<{ data: NotificationPreferences }>(
          '/users/me/notification-preferences',
          { [field]: value },
        )
        await mutate(res.data.data, { revalidate: false })
      } catch (e) {
        await mutate()
        const message = extractApiError(e) ?? 'Unable to update notification preference.'
        setUpdateError(message)
        throw e
      }
    },
    [accessToken, data, mutate],
  )

  return {
    preferences: data,
    error,
    updateError,
    isLoading: isLoading || status === 'loading',
    updatePreference,
  }
}
