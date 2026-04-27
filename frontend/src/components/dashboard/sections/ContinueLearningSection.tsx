import { CourseProgressCard } from '../cards/CourseProgressCard'

const mockCourses = [
  {
    id: '1',
    accentClass: 'bg-[#303869]',
    dateLabel: 'July 12, 2025',
    durationLabel: '50 mins',
    title: 'Mastering Study Skills for Academic Success',
    moduleLabel: 'Module 3',
    resumeHref: '/courses',
  },
  {
    id: '2',
    accentClass: 'bg-[#800099]',
    dateLabel: 'July 10, 2025',
    durationLabel: '40 mins',
    title: 'Design Thinking Fundamentals',
    moduleLabel: 'Module 1',
    resumeHref: '/courses',
  },
  {
    id: '3',
    accentClass: 'bg-[#009999]',
    dateLabel: 'July 8, 2025',
    durationLabel: '55 mins',
    title: 'Leadership Essentials for Teams',
    moduleLabel: 'Module 2',
    resumeHref: '/courses',
  },
  {
    id: '4',
    accentClass: 'bg-[#4D9900]',
    dateLabel: 'July 8, 2025',
    durationLabel: '55 mins',
    title: 'Leadership Essentials for Teams',
    moduleLabel: 'Module 2',
    resumeHref: '/courses',
  },
]

export function ContinueLearningSection() {
  return (
    <section className="mb-10 py-8 px-4 md:px-8 md:py-8">
      <h2 className="font-semibold text-heading">Continue Learning</h2>
      <p className="mt-1 text-[#474348] md:text-base">
        Pick up right where you stopped — one click away.
      </p>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-3 md:overflow-x-auto md:pb-2">
        {mockCourses.map((c) => (
          <CourseProgressCard key={c.id} {...c} />
        ))}
      </div>
    </section>
  )
}
