import Link from 'next/link'

const BENEFITS = [
  {
    title: 'Skill Enhancement',
    body: 'Hands-on projects provide practical application, refining your business analysis skills for real-world success.',
  },
  {
    title: 'Global Team Collaboration',
    body: 'Work alongside professionals from around the world, experiencing the dynamics of a global team and enhancing your cross-cultural communication abilities.',
  },
  {
    title: 'Networking Opportunities',
    body: 'Build connections within your industry, expanding your professional network for future career opportunities.',
  },
  {
    title: 'Additional Training',
    body: "Access specialised workshops in agile methodologies and leadership, ensuring you're equipped with the skills needed for success in the dynamic field of business analysis.",
  },
]

export function InternshipSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-12 md:py-20">
      <div className="">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
          Internship Opportunities at TGA: Empowering Future Professionals
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">
          The TGA certified courses offers exclusive internship opportunities that provide hands-on
          experience, global exposure, and additional training to shape you into a well-rounded
          professional.
        </p>
        <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-[#B82B91]">
          Key Benefits
        </p>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-xl bg-slate-50 p-6">
              <h4 className="mb-2 font-bold text-slate-900">{b.title}</h4>
              <p className="text-sm leading-relaxed text-slate-500">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/courses"
            className="rounded-xl bg-[#1a1a5e] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#571244]"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  )
}
