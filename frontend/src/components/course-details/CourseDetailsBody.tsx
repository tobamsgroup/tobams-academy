'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronDown } from 'lucide-react'
import { IMAGES } from '@/assets/images'
import type { LocalCourse } from '@/types/course'

interface Props {
  course: LocalCourse
  relatedCourses: LocalCourse[]
}

const TABS = [
  { id: 'learn', label: "What You'll Learn" },
  { id: 'content', label: 'Course Content' },
  { id: 'description', label: 'Description' },
  { id: 'feedbacks', label: 'Feedbacks' },
] as const

const RELATED_IMAGES = [IMAGES.course1, IMAGES.course2, IMAGES.course3, IMAGES.course4]

type TabId = (typeof TABS)[number]['id']

export function CourseDetailsBody({ course, relatedCourses }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('learn')
  const [openWeek, setOpenWeek] = useState<number | null>(course.curriculum[0]?.week ?? null)
  const [expandAll, setExpandAll] = useState(false)

  const feedbackBars = useMemo(
    () => [
      { label: '5%', width: '84%' },
      { label: '4%', width: '62%' },
      { label: '3%', width: '34%' },
      { label: '2%', width: '22%' },
      { label: '1%', width: '14%' },
    ],
    [],
  )

  const jumpTo = (id: TabId) => {
    setActiveTab(id)
    document.getElementById(`course-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-[1312px] px-6 py-10  ">
       <div className="mb-5 grid grid-cols-2 rounded-[12px] border-[2px] border-[#E5E7EB] bg-white p-2 md:grid-cols-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => jumpTo(tab.id)}
                className={`rounded-lg px-3 py-2.5 text-lg transition-colors ${
                  activeTab === tab.id ? 'bg-[#EEF0F6] text-primary' : 'text-[#221D23]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.45fr_0.85fr]">
        <div>        
          <section id="course-learn" className="mb-8 rounded-[12px] border border-[#D3D2D3] bg-white p-6">
            <h2 className="mb-[31px] text-2xl md:text-[28px] font-medium text-heading">What You&apos;ll Learn</h2>
            <div className="">
              <div className="grid grid-cols-1 gap-3 text-lg text-[#474348] md:grid-cols-2">
                {course.keyLearningOutcomes.slice(0, 6).map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </div>
          </section>

          <section id="course-content" className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[24px] font-medium text-heading">Course Content</h2>
              <button
                type="button"
                onClick={() => setExpandAll((v) => !v)}
                className="text-sm  text-primary hover:underline"
              >
                {expandAll ? 'Collapse all sections' : 'Expand all sections'}
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#D3D2D3] bg-white">
              {course.curriculum.map((week) => {
                const isOpen = expandAll || openWeek === week.week
                return (
                  <div key={week.week} className="border-b border-[#E5E7EB] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenWeek(isOpen ? null : week.week)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#F8F8FA]"
                    >
                        <p className="text-lg font-medium text-heading">{week.title}</p>
                      <div className="flex items-center gap-2">
                      <p className="text-sm text-heading">
                          {week.topics.length} lectures • {course.duration}
                        </p>
                      <ChevronDown className={`h-4 w-4 text-[#696969] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {isOpen ? (
                      <ul className="space-y-1 px-4 ">
                        {week.topics.map((topic, idx) => (
                          <li key={idx} className="text-primary py-3 border-b border-[#E5E7EB]">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setExpandAll(true)}
              className="mt-4 w-full rounded-md border border-primary text-primary  py-2 text-lg font-medium text-heading hover:bg-[#F7F7FA]"
            >
              View All Modules
            </button>
          </section>

          <section id="course-description" className="mb-10">
            <h2 className="mb-3 text-[24px] font-medium text-heading">Description</h2>
            <div className="space-y-4 text-lg leading-relaxed text-[#474348] font-medium">
              <p>{course.description}</p>
              <p>{course.objective}</p>
              <p>
                We take you step-by-step through engaging video tutorials and practical activities so
                you can apply what you learn immediately.
              </p>
            </div>
          </section>

          <section id="course-feedbacks">
            <h2 className="mb-3 text-2xl font-medium text-heading">Student Feedback</h2>
            <div className="mb-6">
              <div className="grid grid-cols-[100px_1fr_88px] items-center gap-x-3 gap-y-2">
                <div className="row-span-5 text-[48px] font-bold text-heading">{course.rating}</div>
                {feedbackBars.map((bar) => (
                  <>
                    <div key={`line-${bar.label}`} className="h-2 overflow-hidden rounded-full bg-[#D3D2D3]">
                      <div className="h-full rounded bg-primary" style={{ width: bar.width }} />
                    </div>
                    <span key={`label-${bar.label}`} className="text-sm flex justify-end items-end text-[#696969]">
                      {bar.label}
                    </span>
                  </>
                ))}
              </div>
              <p className="-mt-4 text-sm text-[#474348]">Course Rating</p>
            </div>

            {[1, 2].map((idx) => (
              <article key={idx} className="mb-4  border-t border-[#E5E7EB]  p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    MJ
                  </div>
                  <div>
                    <p className="text-lg text-heading">Michael J.</p>
                    <p className="text-xs text-[#474348]">2 weeks ago</p>
                  </div>
                </div>
                <p className="text-lg text-[#474348]">
                This course is absolutely amazing. The instructor explains everything clearly and the projects are very practical. I went from knowing nothing to building full-stack apps in just a few months. Highly recommended!
                </p>
              </article>
            ))}

            <button
              type="button"
              className="rounded-md border-[2px] border-[#E5E7EB]  px-5 py-2 text-sm font-medium text-heading hover:bg-[#F7F7FA]"
            >
              See all reviews
            </button>
          </section>
        </div>

        <aside>
          <div className="sticky top-24 overflow-hidden rounded-lg border-[2px] border-[#E5E7EB]">
            <div className="relative aspect-[16/10]">
              <Image src={IMAGES.course2} alt={course.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <p className="text-[32px] font-bold text-primary mb-4">{course.price}</p>
              <p className="mb-4 text-sm text-[#B83092]">2 days left at this price!</p>
              <button className="mb-2 w-full rounded-md bg-primary py-3 text-lg font-medium text-white hover:bg-[#232A59]">
                Add to Cart
              </button>
              <button className="mb-4 w-full rounded-md border border-primary py-3 text-sm font-semibold text-primary hover:bg-[#F8F8FA]">
                Buy Now
              </button>

              <p className="mb-2 text-sm font-semibold text-heading">This course includes</p>
              <ul className="space-y-2 text-sm text-[#474348]">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> 65.5 hours on-demand video</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> 48 downloadable resources</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Access on mobile and TV</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Full lifetime access</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Certificate of completion</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold text-heading">People Also View</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relatedCourses.map((item, idx) => (
            <Link
              key={item.slug}
              href={`/courses/${item.slug}`}
              className="overflow-hidden rounded-lg border border-[#D3D2D3] bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={RELATED_IMAGES[idx % RELATED_IMAGES.length]}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="mb-1 text-xs text-[#696969]">{item.category}</p>
                <h3 className="line-clamp-1 text-lg font-semibold text-heading">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-[#474348]">{item.description}</p>
                <p className="mt-2 text-lg font-bold text-heading">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
