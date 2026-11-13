import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import { apiStatusToUiStatus } from '@/lib/payment-utils'
import type { Payment } from '@/components/dashboard/payment/payments-data'
import type {
  CreatePaymentPayload,
  CreatePaymentResult,
  PaymentDetail,
  PaymentListItem,
  PaymentListMeta,
} from '@/types/payment'

function extractApiError(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    return response?.data?.message
  }
  return undefined
}

function toUiPayment(row: PaymentListItem): Payment {
  const amount = row.amount <= 0 ? ('Free' as const) : row.amount
  return {
    id: row.id,
    courseName: row.course.title,
    courseId: row.course.id,
    amount,
    date: row.createdAt.slice(0, 10),
    status: apiStatusToUiStatus(row.status),
  }
}

type PaymentListResponse = {
  data: PaymentListItem[]
  meta?: PaymentListMeta
}

type PaymentFilters = {
  page?: number
  limit?: number
  courseName?: string
  status?: string
  range?: string
}

function buildPaymentsKey(filters: PaymentFilters, accessToken?: string) {
  if (!accessToken) return null
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.courseName) params.set('courseName', filters.courseName)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.range && filters.range !== 'all') params.set('range', filters.range)
  const query = params.toString()
  return query ? `/payments?${query}` : '/payments'
}

export function usePayments(filters: PaymentFilters = {}) {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken
  const swrKey = buildPaymentsKey(filters, accessToken)

  const { data, error, isLoading, mutate } = useSWR<PaymentListResponse>(
    swrKey,
    async (path: string) => {
      const client = createAuthedClient(accessToken)
      const res = await client.get<PaymentListResponse>(path)
      return res.data
    },
  )

  const purchaseCourse = useCallback(
    async (payload: CreatePaymentPayload): Promise<CreatePaymentResult> => {
      if (!accessToken) {
        const error = new Error('Not authenticated') as Error & {
          response?: { status: number; data: { message: string } }
        }
        error.response = { status: 401, data: { message: 'Unauthorized' } }
        throw error
      }
      const client = createAuthedClient(accessToken)
      const res = await client.post<{ data: CreatePaymentResult }>('/payments', payload)
      await mutate()
      return res.data.data
    },
    [accessToken, mutate],
  )

  const deletePayment = useCallback(
    async (paymentId: string) => {
      if (!accessToken) throw new Error('Not authenticated')
      const client = createAuthedClient(accessToken)
      await client.delete(`/payments/${paymentId}`)
      await mutate()
    },
    [accessToken, mutate],
  )

  return {
    payments: (data?.data ?? []).map(toUiPayment),
    meta: data?.meta,
    error,
    isLoading: isLoading || status === 'loading',
    purchaseCourse,
    deletePayment,
    mutate,
    getErrorMessage: extractApiError,
  }
}

export function usePaymentDetail(paymentId: string | null) {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken
  const swrKey =
    status === 'authenticated' && accessToken && paymentId ? `/payments/${paymentId}` : null

  const { data, error, isLoading } = useSWR<PaymentDetail>(
    swrKey,
    createFetcher(accessToken),
  )

  return {
    detail: data,
    error,
    isLoading: isLoading || status === 'loading',
    getErrorMessage: extractApiError,
  }
}
