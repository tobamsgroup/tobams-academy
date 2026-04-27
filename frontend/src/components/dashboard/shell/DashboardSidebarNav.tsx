'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { primaryNav, secondaryNav, type NavItem } from './nav-config'
import { LogoutButton } from './LogoutButton'
import { cn } from '@/lib/utils'

function NavItemRow({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate?: () => void
}) {
  const currentPath = usePathname()
  const isParentActive =
    currentPath === item.href || currentPath.startsWith(`${item.href}/`)
  const [open, setOpen] = useState(isParentActive && !!item.children)
  const Icon = item.icon

  useEffect(() => {
    if (isParentActive && item.children) setOpen(true)
  }, [currentPath, isParentActive, item.children])

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 font-medium transition-colors',
            isParentActive ? 'bg-[#EEF0F6] text-primary' : 'text-[#221D23] hover:bg-[#F8F8FA]',
          )}
        >
          <span className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" />
            {item.label}
          </span>
          <ChevronDown
            className={cn('h-4 w-4 opacity-60 transition-transform duration-200', open && 'rotate-180')}
          />
        </button>

        {open && (
          <div className="ml-[22px] mt-1 flex flex-col border-l-[3px] border-primary">
            {item.children.map((child) => {
              const childActive = currentPath === child.href
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    'py-2.5 pl-8 pr-4 text-sm font-medium transition-colors',
                    childActive ? 'text-primary' : 'text-[#221D23] hover:text-primary',
                  )}
                >
                  {child.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`)
  return (
    <Link
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
    </Link>
  )
}

export function DashboardSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pt-6 md:pt-8">
      {primaryNav.map((item) => (
        <NavItemRow key={item.href} item={item} onNavigate={onNavigate} />
      ))}

      <div className="mt-auto border-t border-[#C4C4C466] pt-6">
        {secondaryNav.map((item) => (
          <div key={item.href} className="mb-1">
            <NavItemRow item={item} onNavigate={onNavigate} />
          </div>
        ))}
        <LogoutButton />
      </div>
    </nav>
  )
}
