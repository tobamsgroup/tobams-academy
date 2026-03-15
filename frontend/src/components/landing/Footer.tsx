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
      <div className="mx-auto max-w-7xl px-8 py-14">
        <div className="grid grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              Tobams<span className="text-[#EF4353]">.</span>Academy
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Empowering professionals with expert-designed courses to advance their careers.
            </p>
            <div className="mt-5 flex gap-3">
              {/* Social icons as simple text links */}
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

        <div className="mt-12 flex items-center justify-between border-t border-slate-800 pt-6">
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
