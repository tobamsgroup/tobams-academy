'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="flex min-h-[520px] flex-col md:flex-row">
      {/* Left */}
      <div
        className={`flex flex-1 flex-col justify-center px-5 py-12 transition-all duration-700 md:px-12 md:py-16 ${
          mounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
        }`}
      >
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[2px] text-[#EF4353]">
          ✦ Professional Training Platform
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
          Grow Faster.<br />
          Learn <span className="text-[#EF4353]">Smarter.</span>
        </h1>
        <p className="mb-8 max-w-md text-base leading-relaxed text-slate-500">
          Gain industry-recognised skills with expert-led courses, flexible learning, and TGA-certified programmes.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-[#571244] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:opacity-90"
          >
            Start Free Trial →
          </Link>
          <Link
            href="/courses"
            className="rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:border-[#571244] hover:text-[#571244]"
          >
            Browse Courses
          </Link>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <div className="flex">
            {['👩', '👨', '👩🏿', '👨🏽'].map((emoji, i) => (
              <span
                key={i}
                className={`flex h-8 w-8 ${i > 0 ? '-ml-2' : ''} items-center justify-center rounded-full border-2 border-white bg-[#571244] text-sm shadow-sm`}
              >
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            <strong className="text-slate-700">5,000+</strong> learners already enrolled
          </p>
        </div>
      </div>

      {/* Right — image placeholder */}
      <div className="relative hidden flex-shrink-0 md:block md:w-1/2">
        <div className="flex h-full min-h-[520px] w-full items-center justify-center bg-slate-200">
          <span className="text-sm text-slate-400">[Image Placeholder]</span>
        </div>
      </div>
    </section>
  )
}
