import useSWR from 'swr'
import { publicFetcher } from '@/lib/fetcher'
import type { Category } from '@/types/course'

export function useCategories() {
  const { data, error, isLoading } = useSWR<Category[]>(
    '/categories',
    publicFetcher,
    { revalidateOnFocus: false },
  )
  return { categories: data ?? [], error, isLoading }
}
