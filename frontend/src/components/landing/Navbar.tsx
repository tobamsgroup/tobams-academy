'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="text-xl font-bold text-[#571244]">
          Tobams<span className="text-[#EF4353]">.</span>Academy
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
          <Link href="/courses" className="transition-colors hover:text-[#571244]">Courses</Link>
          <Link href="#" className="transition-colors hover:text-[#571244]">Community</Link>
          <Link href="#" className="transition-colors hover:text-[#571244]">About</Link>
          <Link href="/login" className="font-semibold text-[#571244] transition-colors hover:text-[#571244]/80">Login</Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#571244] px-5 py-2 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#571244]/25"
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-3 pt-4 text-sm">
            <Link href="/courses" className="py-1 text-slate-600 hover:text-[#571244]" onClick={() => setOpen(false)}>Courses</Link>
            <Link href="#" className="py-1 text-slate-600 hover:text-[#571244]" onClick={() => setOpen(false)}>Community</Link>
            <Link href="#" className="py-1 text-slate-600 hover:text-[#571244]" onClick={() => setOpen(false)}>About</Link>
            <Link href="/login" className="py-1 font-semibold text-[#571244]" onClick={() => setOpen(false)}>Login</Link>
            <Link
              href="/register"
              className="mt-1 rounded-lg bg-[#571244] px-5 py-2.5 text-center font-bold text-white"
              onClick={() => setOpen(false)}
            >
              Get Started →
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
