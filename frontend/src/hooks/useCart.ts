import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { useSession } from 'next-auth/react'
import useSWR, { useSWRConfig } from 'swr'
import axios from 'axios'
import { createAuthedClient, createFetcher } from '@/lib/fetcher'
import type { CartView } from '@/types/cart'

const STORAGE_KEY = 'tga-cart'
const CHANGE_EVENT = 'tga-cart-change'
const EMPTY: CartView = { items: [], total: 0 }
const NO_IDS: string[] = []
export const ACCOUNT_CART_KEY = '/cart'

// ── Guest cart: course ids in localStorage ──────────────────────────────────────

let cachedRaw: string | null = null
let cachedIds: string[] = NO_IDS

function readGuestIds(): string[] {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return NO_IDS // storage blocked (private mode etc.): behave as an empty cart
  }
  if (raw === cachedRaw) return cachedIds
  cachedRaw = raw
  try {
    const parsed = raw ? JSON.parse(raw) : []
    cachedIds = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : NO_IDS
  } catch {
    cachedIds = NO_IDS
  }
  return cachedIds
}

export function writeGuestIds(ids: string[]) {
  try {
    if (ids.length === 0) window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]))
  } catch {
    // ignore: the guest cart just won't persist
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

export function useGuestCartIds(): string[] {
  return useSyncExternalStore(subscribe, readGuestIds, () => NO_IDS)
}

async function previewGuestCart([, ids]: [string, string[]]): Promise<CartView> {
  const { data } = await axios.post<{ data: CartView }>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/preview`,
    { courseIds: ids },
  )
  return data.data
}

function apiMessage(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message ?? 'Something went wrong'
  return 'Something went wrong'
}

// ── Public hook ────────────────────────────────────────────────────────────────

/**
 * The learner's cart. Signed-in users use their account cart; guests keep course ids in the
 * browser (merged into the account on sign-in by <CartSync />). Prices always come from the server.
 */
export function useCart() {
  const { data: session, status } = useSession()
  const token = session?.accessToken
  const isAuthed = status === 'authenticated' && Boolean(token)
  const guestIds = useGuestCartIds()

  const account = useSWR<CartView>(isAuthed ? ACCOUNT_CART_KEY : null, createFetcher(token))
  const guest = useSWR<CartView>(
    !isAuthed && status !== 'loading' && guestIds.length > 0 ? ['cart-preview', guestIds] : null,
    previewGuestCart,
    { keepPreviousData: true },
  )

  const cart = isAuthed ? (account.data ?? EMPTY) : guestIds.length > 0 ? (guest.data ?? EMPTY) : EMPTY

  const add = useCallback(
    async (courseId: string) => {
      if (isAuthed) {
        try {
          const { data } = await createAuthedClient(token).post<{ data: CartView }>('/cart/items', { courseId })
          await account.mutate(data.data, { revalidate: false })
        } catch (error) {
          throw new Error(apiMessage(error))
        }
      } else {
        writeGuestIds([...readGuestIds(), courseId])
      }
    },
    [isAuthed, token, account],
  )

  const remove = useCallback(
    async (courseId: string) => {
      if (isAuthed) {
        try {
          const { data } = await createAuthedClient(token).delete<{ data: CartView }>(
            `/cart/items/${encodeURIComponent(courseId)}`,
          )
          await account.mutate(data.data, { revalidate: false })
        } catch (error) {
          throw new Error(apiMessage(error))
        }
      } else {
        writeGuestIds(readGuestIds().filter((id) => id !== courseId))
      }
    },
    [isAuthed, token, account],
  )

  return {
    items: cart.items,
    total: cart.total,
    count: isAuthed ? cart.items.length : guestIds.length,
    contains: (courseId: string) =>
      isAuthed ? cart.items.some((i) => i.id === courseId) : guestIds.includes(courseId),
    isLoading:
      status === 'loading' || (isAuthed ? account.isLoading : guestIds.length > 0 && !guest.data && !guest.error),
    error: isAuthed ? account.error : guest.error,
    isAuthed,
    add,
    remove,
    refresh: () => (isAuthed ? account.mutate() : guest.mutate()),
  }
}

/** Moves a guest cart into the account cart once the user signs in. Mount once, app-wide. */
export function CartSyncEffect() {
  const { data: session, status } = useSession()
  const token = session?.accessToken
  const guestIds = useGuestCartIds()
  const { mutate } = useSWRConfig()

  useEffect(() => {
    if (status !== 'authenticated' || !token || guestIds.length === 0) return
    let cancelled = false
    createAuthedClient(token)
      .post<{ data: CartView }>('/cart/merge', { courseIds: guestIds })
      .then(({ data }) => {
        if (cancelled) return
        writeGuestIds([])
        void mutate(ACCOUNT_CART_KEY, data.data, { revalidate: false })
      })
      .catch(() => {
        // Keep the guest cart and try again on the next change or page load.
      })
    return () => {
      cancelled = true
    }
  }, [status, token, guestIds, mutate])

  return null
}
