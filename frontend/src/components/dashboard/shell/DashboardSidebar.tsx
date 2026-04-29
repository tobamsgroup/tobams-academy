'use client'

import Image from 'next/image'
import Link from 'next/link'
import { IMAGES } from '@/assets/images'
import { DashboardSidebarNav } from './DashboardSidebarNav'

export function DashboardSidebar() {
  return (
    <aside className="hidden h-full min-h-0 w-[260px] shrink-0 flex-col border-r border-[#D3D2D366] bg-[#FAFDFF] md:flex md:flex-col">
      <div className="flex h-[73px] items-center border-b border-[#E5E7EB] px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src={IMAGES.newLogo}
            alt="Tobams Academy"
            className="h-[73px] w-[73px] max-w-[120px] object-contain"
            width={73}
            height={73}
          />
        </Link>
      </div>

      <DashboardSidebarNav />
    </aside>
  )
}
