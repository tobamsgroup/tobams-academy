'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { ICONS } from '@/assets/icons'
import { IMAGES } from '@/assets/images'
import { Button } from '@/components/ui/Button'
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
    <div className="mx-auto max-w-[1312px] px-6 py-10  w-full">
       <div className="hidden md:grid mb-5  grid-cols-2 rounded-[12px] border-[2px] border-[#E5E7EB] bg-white p-2 md:grid-cols-4">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                type="button"
                onClick={() => jumpTo(tab.id)}
                className={`rounded-lg px-3 py-2.5 text-lg font-normal shadow-none hover:translate-y-0 hover:shadow-none ${
                  activeTab === tab.id ? 'bg-[#EEF0F6] text-primary' : 'text-[#221D23]'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.45fr_0.85fr]">
        <div className="order-2 lg:order-1">        
          <section id="course-learn" className="mb-8 rounded-[12px] border border-[#D3D2D3] bg-white  p-5 md:p-6">
            <h2 className="mb-4 md:mb-[31px] text-[24px] md:text-[28px] font-medium text-heading">What You&apos;ll Learn</h2>
            <div className="">
              <div className="grid grid-cols-1 gap-3 md:text-lg text-[#474348] md:grid-cols-2">
                {course.keyLearningOutcomes.slice(0, 6).map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </div>
          </section>

          <section id="course-content" className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[24px] font-medium text-heading">Course Content</h2>
              <Button
                type="button"
                onClick={() => setExpandAll((v) => !v)}
                className="px-0 py-0 text-sm font-normal text-primary shadow-none hover:translate-y-0 hover:bg-transparent hover:from-transparent hover:to-transparent hover:shadow-none hover:underline"
              >
                {expandAll ? 'Collapse all sections' : 'Expand all sections'}
              </Button>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#D3D2D3] bg-white">
              {course.curriculum.map((week) => {
                const isOpen = expandAll || openWeek === week.week
                return (
                  <div key={week.week} className="border-b border-[#E5E7EB] last:border-b-0">
                    <Button
                      type="button"
                      onClick={() => setOpenWeek(isOpen ? null : week.week)}
                      className="flex w-full items-center justify-between rounded-none px-4 py-3 text-left font-normal shadow-none hover:translate-y-0 hover:bg-[#F8F8FA] hover:from-[#F8F8FA] hover:to-[#F8F8FA] hover:shadow-none"
                    >
                        <p className="text-lg font-medium text-heading">{week.title}</p>
                      <div className="flex items-center gap-2">
                      <p className="text-sm text-heading hidden md:block">
                          {week.topics.length} lectures • {course.duration}
                        </p>
                      <ChevronDown className={`h-4 w-4 text-[#696969] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </Button>
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
            <Button
              type="button"
              onClick={() => setExpandAll(true)}
              className="mt-4 w-full rounded-md border border-primary bg-transparent py-3 font-medium text-heading text-primary shadow-none hover:translate-y-0 hover:bg-[#F7F7FA] hover:from-[#F7F7FA] hover:to-[#F7F7FA] md:text-lg"
            >
              View All Modules
            </Button>
          </section>

          <section id="course-description" className="mb-10">
            <h2 className="mb-3 text-[24px] font-medium text-heading">Description</h2>
            <div className="space-y-4 md:text-lg tetx-sm leading-relaxed text-[#474348] md:font-medium">
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
              <div className="grid gap-y-3 md:grid-cols-[100px_1fr_88px] md:items-center md:gap-x-3 md:gap-y-2">
                <div className="text-center text-[48px] font-bold text-heading md:row-span-5 md:text-left">
                  {course.rating}
                  <p className="mt-2 text-center text-sm text-[#474348] font-normal md:-mt-4 md:text-left md:hidden ">Course Rating</p>
                </div>
                {feedbackBars.map((bar) => (
                  <div
                    key={bar.label}
                    className="grid grid-cols-[1fr_90px] items-center gap-x-1.5 md:col-start-2 md:col-end-4 md:gap-x-3"
                  >
                    <div className="h-2 overflow-hidden rounded-full bg-[#D3D2D3]">
                      <div className="h-full rounded bg-primary" style={{ width: bar.width }} />
                    </div>
                    <span className="text-sm text-[#696969] text-right">{bar.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-sm text-[#474348] md:-mt-4 md:text-left hidden md:block">Course Rating</p>
            </div>

            {[1, 2].map((idx) => (
              <article key={idx} className="mb-4  border-t border-[#E5E7EB]  p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    MJ
                  </div>
                  <div>
                    <p className="md:text-lg text-sm text-heading">Michael J.</p>
                    <p className="text-xs text-[#474348]">2 weeks ago</p>
                  </div>
                </div>
                <p className="md:text-lg text-sm text-[#474348]">
                This course is absolutely amazing. The instructor explains everything clearly and the projects are very practical. I went from knowing nothing to building full-stack apps in just a few months. Highly recommended!
                </p>
              </article>
            ))}

            <Button
              type="button"
              className="w-full rounded-md border-[2px] border-[#E5E7EB] bg-transparent px-5 py-2 font-medium text-heading shadow-none hover:translate-y-0 hover:bg-[#F7F7FA] hover:from-[#F7F7FA] hover:to-[#F7F7FA] md:w-fit md:text-sm"
            >
              See all reviews
            </Button>
          </section>
        </div>

        <aside className="order-1 lg:order-2">
          <div className="sticky top-24 overflow-hidden rounded-lg border-[2px] border-[#E5E7EB]">
            <div className="relative aspect-[16/10]">
              <Image src={IMAGES.course2} alt={course.title} fill className="object-cover" />
            </div>
            <div className="md:p-6 p-4">
              <p className="text-[28px] md:text-[32px] font-bold text-primary md:mb-4">{course.price}</p>
              <p className="mb-4 text-sm text-[#B83092]">2 days left at this price!</p>
              <Button
                type="button"
                className="mb-4 w-full rounded-md bg-primary py-3 font-medium text-white hover:translate-y-0 hover:bg-[#232A59] hover:from-[#232A59] hover:to-[#232A59] md:mb-3 md:text-lg"
              >
                Add to Cart
              </Button>
              <Button
                type="button"
                className="mb-4 w-full rounded-md border border-primary bg-transparent py-3 font-semibold text-primary shadow-none hover:translate-y-0 hover:bg-[#F8F8FA] hover:from-[#F8F8FA] hover:to-[#F8F8FA] md:text-lg"
              >
                Buy Now
              </Button>

              <p className="mb-2 text-sm font-semibold text-heading">This course includes</p>
              <ul className="space-y-2 text-sm text-[#474348]">
                <li className="flex items-center gap-2">
                  <ICONS.Video width={16} height={16} className="shrink-0" />
                  65.5 hours on-demand video
                </li>
                <li className="flex items-center gap-2">
                  <ICONS.BookDownload width={16} height={16} className="shrink-0" />
                  48 downloadable resources
                </li>
                <li className="flex items-center gap-2">
                  <ICONS.Device width={16} height={16} className="shrink-0" />
                  Access on mobile and TV
                </li>
                <li className="flex items-center gap-2">
                  <ICONS.Lifebuoy width={16} height={16} className="shrink-0" />
                  Full lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <ICONS.Certificate width={16} height={16} className="shrink-0" />
                  Certificate of completion
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold text-heading">People Also View</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedCourses.map((item, idx) => (
            <Link
              key={item.slug}
              href={`/courses/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#D3D2D3] bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="w-full bg-white p-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={RELATED_IMAGES[idx % RELATED_IMAGES.length]}
                    alt={item.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
                <span className="mb-2 w-fit rounded-sm bg-[#EEF0F6] px-2.5 py-1 text-xs font-medium text-slate-600">
                  {item.category}
                </span>
                <h3 className="mb-1.5 line-clamp-1 text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
                <p className="text-base font-bold text-slate-900">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
