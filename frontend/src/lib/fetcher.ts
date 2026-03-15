const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

/**
 * Build a SWR fetcher bound to a specific access token.
 * Usage: const { data } = useSWR('/courses', createFetcher(session?.accessToken))
 */
export function createFetcher(accessToken?: string) {
  return async function fetcher<T>(path: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    const res = await fetch(`${API_URL}${path}`, { headers })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const json = await res.json()
    return json.data
  }
}

/**
 * Unauthenticated fetcher for public endpoints (courses catalogue, etc.)
 */
export async function publicFetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  return json.data
}
