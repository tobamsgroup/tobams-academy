import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

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
