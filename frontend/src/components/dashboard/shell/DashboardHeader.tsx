'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu } from 'lucide-react'
import { IMAGES } from '@/assets/images'
import { ICONS } from '@/assets/icons'
import { getDashboardMeta } from './dashboard-titles'

const iconBtn =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D3D2D333] text-[#474348] transition-colors hover:bg-[#F0F0F4] md:h-12 md:w-12'

export function DashboardHeader({
  userName,
  onMobileMenuClick,
  mobileMenuOpen,
}: {
  userName: string
  onMobileMenuClick?: () => void
  mobileMenuOpen?: boolean
}) {
  const pathname = usePathname()
  const { title, subtitle } = getDashboardMeta(pathname)

  return (
    <header className="shrink-0 border-b border-[#E5E7EB] bg-white">
      <div className="flex h-14 items-center justify-between pr-4 md:h-[108px] md:px-6">
        <Link href="/dashboard" className="flex shrink-0 items-center md:hidden" aria-label="Home">
          <Image
            src={IMAGES.newLogo}
            alt=""
            className="h-[74px] w-[74px] object-cover"
            width={74}
            height={74}
          />
        </Link>

        <div className="hidden flex-col md:flex">
          <h1 className="text-[20px] font-semibold text-heading">{title}</h1>
          {subtitle && (
            <p className="mt-4 text-[#474348] font-medium">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button type="button" className={iconBtn} aria-label="Notifications">
            <ICONS.DashboardBell />
          </button>
          <button type="button" className={iconBtn} aria-label="Help">
            <ICONS.DashboardQuestion />
          </button>
          <button
            type="button"
            className={`md:hidden`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen ?? false}
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href="/dashboard/profile"
            className="hidden items-center gap-2 py-1.5 pl-1.5 pr-3 text-sm font-medium text-heading transition-colors hover:bg-[#F8F8FA] md:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {userName.slice(0, 1).toUpperCase()}
            </span>
            <ChevronDown className="h-4 w-4 text-[#696969]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
