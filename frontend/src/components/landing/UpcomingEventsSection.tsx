const EVENT = {
  date: 'May 15, 2024 | 10:00 AM – 12:00 PM (UK Time)',
  title: 'Leadership Summit 2024',
  excerpt:
    'We are proud to announce that Tobams Group Academy has been recognized for its commitment to sustainable business practices. Learn more about our eco-friendly initiatives and the positive impact on our c...',
}

function SmallEventCard() {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="h-20 w-28 flex-shrink-0 rounded-lg bg-slate-200" />
      <div>
        <p className="mb-1 text-[10px] text-slate-400">{EVENT.date}</p>
        <h4 className="mb-1 text-sm font-bold text-slate-900">{EVENT.title}</h4>
        <p className="mb-2 line-clamp-2 text-xs text-slate-500">{EVENT.excerpt}</p>
        <a href="#" className="text-xs font-semibold text-[#EF4353] hover:underline">
          Register Now
        </a>
      </div>
    </div>
  )
}

export function UpcomingEventsSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Upcoming Events</h2>
          <a
            href="#"
            className="rounded-xl bg-[#1a1a5e] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            View All Events →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Featured large card */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="relative flex h-56 items-center justify-center bg-slate-200">
              <span className="text-sm text-slate-400">[Image Placeholder]</span>
              {/* Play button overlay */}
              <button
                type="button"
                aria-label="Play"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl text-slate-700 shadow">
                  ▶
                </div>
              </button>
            </div>
            <div className="p-5">
              <p className="mb-1 text-xs text-slate-400">{EVENT.date}</p>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{EVENT.title}</h3>
              <p className="mb-3 text-sm text-slate-500">{EVENT.excerpt}</p>
              <a href="#" className="text-sm font-semibold text-[#EF4353] hover:underline">
                Register Now
              </a>
            </div>
          </div>

          {/* Two stacked smaller cards */}
          <div className="flex flex-col gap-4">
            <SmallEventCard />
            <SmallEventCard />
          </div>
        </div>
      </div>
    </section>
  )
}
