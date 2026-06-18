import axios from 'axios'
import type { PaginatedResponse } from '@/types/course'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

type ApiListResponse<T> = {
  data: T
  meta?: PaginatedResponse<T>['meta']
}

export function createFetcher(accessToken?: string) {
  return async function fetcher<T>(path: string): Promise<T> {
    const headers: Record<string, string> = {}
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
    const { data } = await axios.get<{ data: T }>(`${API_URL}${path}`, { headers })
    return data.data
  }
}

export async function publicFetcher<T>(path: string): Promise<T> {
  const { data } = await axios.get<{ data: T }>(`${API_URL}${path}`)
  return data.data
}

export async function publicPaginatedFetcher<T>(path: string): Promise<PaginatedResponse<T>> {
  const { data } = await axios.get<ApiListResponse<T[]>>(`${API_URL}${path}`)
  return {
    data: data.data ?? [],
    meta: data.meta ?? { total: 0, page: 1, limit: 12, totalPages: 1 },
  }
}

export function createAuthedClient(accessToken?: string) {
  return axios.create({
    baseURL: API_URL,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  })
}
