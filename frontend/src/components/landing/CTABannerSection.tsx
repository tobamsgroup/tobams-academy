import Link from 'next/link'

export function CTABannerSection() {
  return (
    <section className="relative overflow-hidden bg-slate-800 px-5 py-20 text-center md:px-12">
      {/* Background placeholder */}
      <div className="absolute inset-0 bg-slate-700" aria-hidden="true" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1a1a5e]/70" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
          Ready to accelerate your career? We can&apos;t wait to have you, apply now.
        </h2>
        <Link
          href="/register"
          className="inline-block rounded-xl bg-[#EF4353] px-8 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:opacity-90"
        >
          Enrol Now →
        </Link>
      </div>
    </section>
  )
}
