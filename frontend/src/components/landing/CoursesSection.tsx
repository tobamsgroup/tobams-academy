'use client'

import { useState } from 'react'

const categories = ['All', 'Business', 'Leadership', 'Data', 'Technology', 'Design']

const courses = [
  { title: 'Product Management', meta: '12 lessons · 6 hours · Beginner', tag: 'Bestseller', progress: 70, gradient: 'from-[#571244] to-[#EF4353]' },
  { title: 'Data Analysis', meta: '8 lessons · 4 hours · Intermediate', tag: 'New', progress: 35, gradient: 'from-indigo-600 to-cyan-500' },
  { title: 'Leadership Essentials', meta: '10 lessons · 5 hours · All levels', tag: 'Popular', progress: 55, gradient: 'from-emerald-600 to-sky-500' },
]

export function CoursesSection() {
  const [active, setActive] = useState('All')

  return (
    <section className="bg-slate-50 px-5 py-10 md:px-12 md:py-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Featured Courses</h2>
        <button className="text-sm font-semibold text-[#EF4353] hover:underline">See all →</button>
      </div>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
              active === cat
                ? 'border-[#EF4353] bg-[#EF4353] text-white'
                : 'border-slate-200 text-slate-500 hover:border-[#571244] hover:text-[#571244]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course grid — 1 col on mobile, 2 on sm, 3 on lg */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div
            key={c.title}
            className="group overflow-hidden rounded-xl border border-purple-50 bg-white shadow-sm shadow-[#571244]/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#571244]/10"
          >
            <div className={`relative h-28 bg-gradient-to-br ${c.gradient}`}>
              <span className="absolute bottom-2 left-2 rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {c.tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="mb-1 text-sm font-bold text-slate-900">{c.title}</h3>
              <p className="text-xs text-slate-400">{c.meta}</p>
              <div className="mt-3">
                <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#571244] to-[#EF4353] transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">{c.progress}% complete</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
