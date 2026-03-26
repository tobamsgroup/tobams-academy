'use client'

import Link from 'next/link'

const COLUMNS = {
  Academy: [
    { label: 'About', href: '#' },
    { label: 'Courses', href: '/courses' },
    { label: 'Corporate Training', href: '#' },
  ],
  'Quick Links': [
    { label: 'Tobams Group', href: '#' },
    { label: 'Events', href: '#' },
    { label: 'FAQs', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer>
      {/* Newsletter bar */}
      <div className="bg-[#1a1a5e] px-5 py-8 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold text-white">Subscribe To Get Updates Regarding New Courses</p>
            <p className="mt-1 text-sm text-white/60">Stay informed with the latest updates from our academy</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm overflow-hidden rounded-xl border border-white/20"
          >
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-[#EF4353] px-4 text-white transition-opacity hover:opacity-90"
              aria-label="Subscribe"
            >
              →
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-slate-900 px-5 py-12 text-slate-400 md:px-12 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <Link href="/" className="text-xl font-bold text-white">
                TG<span className="text-[#EF4353]">.</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Empower your knowledge journey with Tobams Group Academy — Your Gateway to
                Professional Excellence.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(COLUMNS).map(([title, items]) => (
              <div key={title}>
                <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  {title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-500">
                Contact
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>64 Nile Street, International House, London N1 7SR</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉</span>
                  <a href="mailto:theteam@tobamsgroup.com" className="transition-colors hover:text-white">
                    theteam@tobamsgroup.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>[Phone Placeholder]</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Tobams Group Academy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
