import Link from 'next/link'

const BENEFITS = [
  {
    title: 'Comprehensive Training',
    body: 'Access engaging and thorough training materials, some aligned with TGA certification requirements and others focused on our exclusive curriculum.',
  },
  {
    title: 'Expert Guidance',
    body: 'Learn from industry experts and certified trainers committed to your success.',
  },
  {
    title: 'Interactive Learning',
    body: 'Participate in interactive learning experiences, group discussions, and practical exercises to reinforce your understanding.',
  },
  {
    title: 'Exam Preparation',
    body: 'For those seeking certification, receive targeted exam preparation to boost your confidence and readiness.',
  },
]

export function CertificationPathsSection() {
  return (
    <section className="bg-[#571244] px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
          Flexible Paths to Certification with Tobams Group Academy
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-white/80">
          At Tobams Group Academy, we offer a range of flexible options to cater to your learning
          preferences. Whether you choose to enrol in one of our comprehensive courses or aim for
          certification, we provide the right approach for you.
        </p>

        {/* White inset card */}
        <div className="rounded-2xl bg-white p-8">
          <h3 className="mb-2 text-xl font-bold text-[#EF4353]">Enrol in Our Programs</h3>
          <p className="mb-6 text-sm text-slate-500">
            Our expertly crafted courses are designed to cover a variety of key areas, some of which
            are TGA-certified. Gain the following benefits:
          </p>
          <ul className="mb-8 flex flex-col gap-4">
            {BENEFITS.map((b) => (
              <li key={b.title} className="text-sm text-slate-700">
                <strong className="text-slate-900">{b.title}:</strong> {b.body}
              </li>
            ))}
          </ul>
          <Link
            href="/courses"
            className="inline-block rounded-xl bg-[#1a1a5e] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            Explore All Courses →
          </Link>
        </div>
      </div>
    </section>
  )
}
