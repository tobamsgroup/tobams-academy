import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-100 bg-white/95 px-8 py-4 backdrop-blur-sm">
      <Link href="/" className="text-xl font-bold text-[#571244]">
        Tobams<span className="text-[#EF4353]">.</span>Academy
      </Link>
      <div className="flex items-center gap-6 text-sm text-slate-500">
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
    </nav>
  )
}
