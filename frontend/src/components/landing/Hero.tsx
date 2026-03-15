'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Trophy, Lightbulb, GraduationCap } from 'lucide-react'

const floatingIcons = [BookOpen, Trophy, Lightbulb]

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="flex min-h-[520px] flex-col md:flex-row">
      {/* Left */}
      <div className={`flex flex-1 flex-col justify-center px-5 py-12 transition-all duration-700 md:px-12 md:py-16 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[2px] text-[#EF4353]">
          ✦ Professional Training Platform
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
          Grow Faster.<br />
          Learn <span className="text-[#EF4353]">Smarter.</span>
        </h1>
        <p className="mb-8 max-w-md text-base leading-relaxed text-slate-500">
          Join thousands of professionals mastering in-demand skills with structured, expert-designed courses. Progress at your pace, earn recognised certificates.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-[#571244] to-[#EF4353] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#EF4353]/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EF4353]/40"
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
        {/* Social proof */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex">
            {['👩', '👨', '👩🏿', '👨🏽'].map((emoji, i) => (
              <span
                key={i}
                className={`flex h-8 w-8 ${i > 0 ? '-ml-2' : ''} items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#571244] to-[#EF4353] text-sm shadow-sm`}
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

      {/* Right — gradient panel (hidden on small screens) */}
      <div className="relative hidden w-72 flex-shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#571244] via-[#8b2252] to-[#EF4353] md:flex lg:w-80">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/[0.06]" />
        <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-white/[0.05]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 animate-[spin_12s_linear_infinite] rounded-full border border-white/10" />
        </div>

        {/* Certificate toast */}
        <div className="absolute top-5 left-5 flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-2 backdrop-blur-sm animate-[fadeUp_0.6s_ease_0.4s_both]">
          <Trophy className="h-5 w-5 text-yellow-300" />
          <div>
            <p className="text-xs font-bold text-white">Certificate Earned!</p>
            <p className="text-[10px] text-white/60">Product Management · just now</p>
          </div>
        </div>

        {/* Main icon */}
        <GraduationCap className="relative z-10 h-16 w-16 animate-[float_3s_ease-in-out_infinite] text-white drop-shadow-lg" />

        {/* Mini icons */}
        <div className="relative z-10 mt-4 flex gap-3">
          {floatingIcons.map((Icon, i) => (
            <div
              key={i}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm"
              style={{ animation: `float 3s ease-in-out ${i * 0.4}s infinite` }}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
