'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { primaryNav, secondaryNav } from './nav-config'
import { LogoutButton } from './LogoutButton'
import { cn } from '@/lib/utils'

export function DashboardSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const currentPath = usePathname()

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pt-6 md:pt-8">
      {primaryNav.map((item) => {
        const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center justify-between gap-2 rounded-lg px-4 py-3 font-medium transition-colors',
              active ? 'bg-[#EEF0F6] text-primary' : 'text-[#221D23] hover:bg-[#F8F8FA]',
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </span>
            {item.hasChildren ? <ChevronDown className="h-4 w-4 opacity-60" /> : null}
          </Link>
        )
      })}

      <div className="mt-auto border-t border-[#C4C4C466] pt-6">
        {secondaryNav.map((item) => {
          const active = currentPath === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'mb-1 flex items-center justify-between gap-2 rounded-lg px-4 py-3 font-medium transition-colors',
                active ? 'bg-[#EEF0F6] text-primary' : 'text-[#221D23] hover:bg-[#F8F8FA]',
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </span>
              {item.hasChildren ? <ChevronDown className="h-4 w-4 opacity-60" /> : null}
            </Link>
          )
        })}
        <LogoutButton />
      </div>
    </nav>
  )
}
