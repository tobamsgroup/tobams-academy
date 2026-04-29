'use client'

import { signOut } from 'next-auth/react'
import { ICONS } from '@/assets/icons'
import { cn } from '@/lib/utils'

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className={cn(
        'mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-[#221D23] transition-colors hover:bg-[#F8F8FA]',
        className,
      )}
    >
      <ICONS.DashboardLogout className="h-5 w-5 shrink-0" />
      Log out
    </button>
  )
}
