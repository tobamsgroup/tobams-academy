import Link from 'next/link'

const PARTNERS = ['Tobams Group', 'Tobams Logic', 'Life Newton']

export function EducationalApproachSection() {
  return (
    <section className="bg-white">
      {/* Two-column panel */}
      <div className="flex flex-col md:flex-row">
        {/* Left — dark navy */}
        <div className="flex flex-1 flex-col justify-center bg-[#1a1a5e] px-8 py-16 md:px-12">
          <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
            Our Educational Approach
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-white/80">
            Our Educational Approach is centered on the highest standards of excellence and
            innovation, aligned with the prestigious TGA Certification. We integrate
            industry-specific knowledge with practical application, offering a dynamic learning
            experience tailored to match TGA-certified standards.
          </p>
          <p className="mb-8 text-sm leading-relaxed text-white/80">
            Our commitment to our certified courses ensures that learners acquire specialised skills,
            setting them on a path toward professional success and industry recognition.
          </p>
          <div>
            <Link
              href="#"
              className="inline-block rounded-xl border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#1a1a5e]"
            >
              Learn About Us
            </Link>
          </div>
        </div>

        {/* Right — image placeholder */}
        <div className="flex min-h-[300px] flex-1 items-center justify-center bg-slate-200 md:min-h-[400px]">
          <span className="text-sm text-slate-400">[Image Placeholder]</span>
        </div>
      </div>

      {/* Trusted partners */}
      <div className="flex flex-col items-center gap-6 border-t border-slate-100 px-5 py-10 sm:flex-row sm:justify-between md:px-12">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          OUR TRUSTED PARTNERS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {PARTNERS.map((name) => (
            <div
              key={name}
              className="flex h-10 w-32 items-center justify-center rounded-lg border border-slate-200 bg-slate-50"
            >
              <span className="text-xs text-slate-400">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
