import Link from 'next/link'

const TESTIMONIALS = [
  {
    name: 'Damilare Ismaila',
    role: 'Employed',
    stars: 4,
    quote:
      'Learning about sustainability is an eye-opener to a lot of other important topics that are related to life on the planet. Wonderful Training!',
  },
  {
    name: 'Precious Aderibigbe',
    role: 'Employed',
    stars: 5,
    quote:
      'My Experience with Sustainability Fundamentals is great and challenging, as the challenging part has helped me to improve on my knowledge about things.',
  },
  {
    name: 'Lovely Agbonlahor',
    role: 'Employed',
    stars: 4,
    quote:
      'It was a wonderful experience. It was very informative and I had a deeper knowledge of real life impacts in a global scale.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-slate-50 px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-widest text-[#EF4353]">
              TESTIMONIALS
            </p>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Reviews From Our Students
            </h2>
          </div>
          <Link
            href="#"
            className="flex-shrink-0 rounded-xl border-2 border-[#1a1a5e] px-5 py-2.5 text-sm font-semibold text-[#1a1a5e] transition-colors hover:bg-[#1a1a5e] hover:text-white"
          >
            See All Testimonials →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#571244] text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
              <div className="mb-3 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${star <= t.stars ? 'text-yellow-400' : 'text-slate-200'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-500">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
