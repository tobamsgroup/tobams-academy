'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'
import { DashboardMobileDrawer } from './DashboardMobileDrawer'
import { getDashboardMeta } from './dashboard-titles'

export function DashboardShell({
  userName,
  children,
}: {
  userName: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  return (
    <div className="flex h-screen min-h-0 overflow-hidden">
      <DashboardSidebar />
      <DashboardMobileDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        userName={userName}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader
          userName={userName}
          onMobileMenuClick={() => setMobileNavOpen((o) => !o)}
          mobileMenuOpen={mobileNavOpen}
        />
        <main className="min-h-0 flex-1 overflow-y-auto ">
          <div className="px-4 py-4 md:hidden">
            {(() => {
              const { title, subtitle } = getDashboardMeta(pathname)
              return (
                <>
                  <h2 className="text-lg font-bold text-heading">{title}</h2>
                  {subtitle && <p className="mt-0.5 text-sm text-[#696969]">{subtitle}</p>}
                </>
              )
            })()}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
