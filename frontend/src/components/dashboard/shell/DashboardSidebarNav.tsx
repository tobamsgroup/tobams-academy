'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { primaryNav, secondaryNav, type NavItem } from './nav-config'
import { LogoutButton } from './LogoutButton'
import { cn } from '@/lib/utils'

/** Nested link active: courses siblings don't both highlight; other parents use prefix match. */
function isNavChildActive(parentHref: string, childHref: string, pathname: string): boolean {
  if (parentHref === '/dashboard/courses') {
    if (childHref === '/dashboard/courses/explore') {
      return pathname === childHref || pathname.startsWith(`${childHref}/`)
    }
    if (childHref === '/dashboard/courses') {
      if (pathname.startsWith('/dashboard/courses/explore')) return false
      return pathname === '/dashboard/courses' || pathname.startsWith('/dashboard/courses/')
    }
  }
  return pathname === childHref || pathname.startsWith(`${childHref}/`)
}

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
          <div className="mt-1 flex flex-col gap-0.5 pl-4">
            {item.children.map((child) => {
              const childActive = isNavChildActive(item.href, child.href, currentPath)
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-lg py-2.5 pr-3 text-sm font-medium transition-colors',
                    childActive ? 'text-primary' : 'text-[#221D23] hover:text-primary',
                  )}
                >
                  <span className="flex h-5 w-4 shrink-0 items-center justify-start" aria-hidden>
                    <span
                      className={cn(
                        'h-5 w-[3px] shrink-0 rounded-full transition-colors',
                        childActive ? 'bg-primary' : 'bg-transparent opacity-0',
                      )}
                    />
                  </span>
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
