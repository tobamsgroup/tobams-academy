'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { IMAGES } from '@/assets/images'
import { ICONS } from '@/assets/icons'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAVBAR_DROP_SHADOW = 'shadow-[0px_4px_15px_0px_#00000033]'

export type NavbarProps = {
  shadow?: boolean
}

export function Navbar({ shadow = true }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm',
        shadow && NAVBAR_DROP_SHADOW,
      )}
    >
      <div className="flex items-center justify-between pl-0 pr-5 lg:px-16">
        <Link href="/" className="text-xl font-bold text-primary">
          <Image src={IMAGES.newLogo} alt='logo' className='h-[100px] w-[149px] object-contain'/>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 text-lg text-[#221D23] md:flex">
          <Link href="/about-us" className="transition-colors hover:text-primary">About</Link>
          <Link href="/courses" className="transition-colors hover:text-primary">Courses</Link>
          <Link href="/corporate-training" className="transition-colors hover:text-primary">Corporate Training</Link>
          {/* <Link href="#" className="transition-colors hover:text-primary">Exams</Link>
          <Link href="#" className="transition-colors hover:text-primary">Membership</Link>
          <Link href="#" className="transition-colors hover:text-primary">Events</Link>
          <Link href="#" className="transition-colors hover:text-primary">Contact Us</Link> */}
          {/* <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">Login</Link> */}
        </div>

        <div className='flex items-center gap-10 hidden md:flex'>
          <Link href="/cart" className="transition-colors hover:text-primary">  
          <ICONS.Cart width={24} height={24} />
          </Link>

          <Button
            type="button"
            variant="primary"
            className="rounded-lg bg-gradient-to-r from-[#303869] to-[#303869] px-6 py-3 text-sm font-bold shadow-none hover:shadow-lg hover:shadow-primary/25"
            onClick={() => router.push('/register')}
          >
            Login
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className='md:hidden flex items-center gap-6'>
        <ICONS.Cart width={24} height={24} />
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-[#FFFAFA] px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-5 pt-4">
          <Link href="/about-us" className="py-1 text-slate-600 hover:text-primary" onClick={() => setOpen(false)}>About Us</Link>
            <Link href="/courses" className="py-1 text-slate-600 hover:text-primary" onClick={() => setOpen(false)}>Courses</Link>
            <Link href="/corporate-training" className="py-1 text-slate-600 hover:text-primary" onClick={() => setOpen(false)}>Corporate Training</Link>
            <hr className="border-[#E5E7EB]" />
            <Link
              href="/register"
              className="mt-12 rounded-lg bg-primary px-5 py-2.5 text-center font-bold text-white"
              onClick={() => setOpen(false)}
            >
            Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
