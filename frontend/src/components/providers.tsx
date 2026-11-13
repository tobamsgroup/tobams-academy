'use client'

import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { store } from '@/store'
import { AuthSessionGuard } from '@/components/auth/AuthSessionGuard'
import { CartSyncEffect } from '@/hooks/useCart'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <AuthSessionGuard />
      <CartSyncEffect />
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  )
}
