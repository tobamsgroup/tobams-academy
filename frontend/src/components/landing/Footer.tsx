import Link from 'next/link'

const links = {
  Platform: [
    { label: 'Courses', href: '/courses' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Community', href: '#' },
    { label: 'Certificates', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Support: [
    { label: 'Help Centre', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-14">
        {/* Top grid — stacks on mobile */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-white">
              Tobams<span className="text-[#EF4353]">.</span>Academy
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Empowering professionals with expert-designed courses to advance their careers.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Twitter', 'LinkedIn', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-[#571244] hover:text-white"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
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
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-slate-800 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Tobams Academy. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with ♥ for lifelong learners
          </p>
        </div>
      </div>
    </footer>
  )
}
