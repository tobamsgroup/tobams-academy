'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { IMAGES } from '@/assets/images'
import { cn } from '@/lib/utils'
import { DashboardSidebarNav } from './DashboardSidebarNav'

export function DashboardMobileDrawer({
  open,
  onClose,
  userName,
}: {
  open: boolean
  onClose: () => void
  userName: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={cn('fixed inset-0 z-50 md:hidden', !open && 'pointer-events-none')}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
      />
      <div
        className={cn(
          'absolute left-0 top-0 flex h-full w-[min(280px,88vw)] flex-col border-r border-[#D3D2D366] bg-[#FAFDFF] shadow-xl transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard menu"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#E5E7EB] px-3">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2 py-1"
          >
            <Image
              src={IMAGES.newLogo}
              alt="Tobams Academy"
              className="h-11 w-11 object-contain"
              width={44}
              height={44}
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#474348] transition-colors hover:bg-[#F0F0F4]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <DashboardSidebarNav onNavigate={onClose} />
        </div>

        <div className="shrink-0 border-t border-[#C4C4C466] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {userName.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate text-sm font-medium text-heading">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
