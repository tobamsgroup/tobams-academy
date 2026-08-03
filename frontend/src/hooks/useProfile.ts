import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import type {
  UpdateProfilePayload,
  UpdateSocialLinksPayload,
  UserProfile,
} from '@/types/profile'
import type { ChangePasswordPayload, DeactivateAccountPayload, TwoFactorPayload } from '@/types/settings'

export function useProfile() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const swrKey = status === 'authenticated' && accessToken ? '/users/me' : null

  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    swrKey,
    createFetcher(accessToken),
  )

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<UserProfile> => {
      if (!accessToken) throw new Error('Not authenticated')
      const client = createAuthedClient(accessToken)
      const res = await client.patch<{ data: UserProfile }>('/users/me', payload)
      const next = res.data.data
      await mutate(next, { revalidate: false })
      return next
    },
    [accessToken, mutate],
  )

  const updateSocialLinks = useCallback(
    async (payload: UpdateSocialLinksPayload): Promise<UserProfile> => {
      if (!accessToken) throw new Error('Not authenticated')
      const client = createAuthedClient(accessToken)
      const res = await client.patch<{ data: UserProfile }>('/users/me/social-links', payload)
      const next = res.data.data
      await mutate(next, { revalidate: false })
      return next
    },
    [accessToken, mutate],
  )

  const changePassword = useCallback(
    async (payload: ChangePasswordPayload): Promise<void> => {
      if (!accessToken) throw new Error('Not authenticated')
      const client = createAuthedClient(accessToken)
      await client.patch('/users/me/change-password', payload)
    },
    [accessToken],
  )

  const updateTwoFactor = useCallback(
    async (payload: TwoFactorPayload): Promise<UserProfile> => {
      if (!accessToken) throw new Error('Not authenticated')
      const client = createAuthedClient(accessToken)
      const res = await client.patch<{ data: UserProfile }>('/users/me/two-factor', payload)
      const next = res.data.data
      await mutate(next, { revalidate: false })
      return next
    },
    [accessToken, mutate],
  )

  const deactivateAccount = useCallback(
    async (payload: DeactivateAccountPayload): Promise<void> => {
      if (!accessToken) throw new Error('Not authenticated')
      const client = createAuthedClient(accessToken)
      await client.post('/users/me/deactivate', payload)
    },
    [accessToken],
  )

  return {
    profile: data,
    error,
    isLoading: isLoading || status === 'loading',
    isAuthenticated: status === 'authenticated',
    mutate,
    updateProfile,
    updateSocialLinks,
    changePassword,
    updateTwoFactor,
    deactivateAccount,
  }
}
