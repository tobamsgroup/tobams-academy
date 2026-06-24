'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ChevronDown } from 'lucide-react'
import { ICONS } from '@/assets/icons'
import { Button } from '@/components/ui/Button'
import type { Course, CourseDetail } from '@/types/course'
import { formatCoursePrice } from '@/lib/catalogue-courses'
import { getCourseThumbnail } from '@/lib/dashboard-courses'
import { learningOutcomesFromCourse, modulesToCurriculumSections } from '@/lib/course-api'
import { useEnrollments } from '@/hooks/useEnrollments'

interface Props {
  course: CourseDetail
  relatedCourses: Course[]
}

const TABS = [
  { id: 'learn', label: "What You'll Learn" },
  { id: 'content', label: 'Course Content' },
  { id: 'description', label: 'Description' },
  { id: 'feedbacks', label: 'Feedbacks' },
] as const

type TabId = (typeof TABS)[number]['id']

export function CourseDetailsBody({ course, relatedCourses }: Props) {
  const router = useRouter()
  const { status } = useSession()
  const { isEnrolledIn, enroll, isLoading: enrollmentsLoading, getErrorMessage } = useEnrollments()
  const [enrolling, setEnrolling] = useState(false)
  const [enrollError, setEnrollError] = useState('')

  const isEnrolled = isEnrolledIn(course.id)
  const isAuthenticated = status === 'authenticated'

  const curriculum = useMemo(() => modulesToCurriculumSections(course), [course])
  const learningOutcomes = useMemo(() => learningOutcomesFromCourse(course), [course])
  const thumbnail = getCourseThumbnail(course, 0)

  const [activeTab, setActiveTab] = useState<TabId>('learn')
  const [openWeek, setOpenWeek] = useState<number | null>(curriculum[0]?.week ?? null)
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

  const handleEnroll = async () => {
    setEnrollError('')
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${course.slug}`)}`)
      return
    }

    setEnrolling(true)
    try {
      await enroll({ courseId: course.id })
      router.push(`/dashboard/courses/${course.slug}`)
    } catch (error) {
      setEnrollError(getErrorMessage(error) ?? 'Unable to enroll. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1312px] px-6 py-10">
      <div className="mb-5 hidden grid-cols-2 rounded-[12px] border-[2px] border-[#E5E7EB] bg-white p-2 md:grid md:grid-cols-4">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            onClick={() => jumpTo(tab.id)}
            className={`rounded-lg px-3 py-2.5 text-lg font-normal shadow-none hover:translate-y-0 hover:shadow-none ${
              activeTab === tab.id ? 'bg-[#EEF0F6] text-primary' : 'bg-white text-[#221D23]'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.45fr_0.85fr]">
        <div className="order-2 lg:order-1">
          <section id="course-learn" className="mb-8 rounded-[12px] border border-[#D3D2D3] bg-white p-5 md:p-6">
            <h2 className="mb-4 text-[24px] font-medium text-heading md:mb-[31px] md:text-[28px]">
              What You&apos;ll Learn
            </h2>
            <div className="grid grid-cols-1 gap-3 text-[#474348] md:grid-cols-2 md:text-lg">
              {learningOutcomes.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </section>

          <section id="course-content" className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[24px] font-medium text-heading">Course Content</h2>
              <Button
                type="button"
                onClick={() => setExpandAll((value) => !value)}
                className="bg-transparent px-0 py-0 text-sm font-normal text-primary shadow-none hover:translate-y-0 hover:bg-transparent hover:from-transparent hover:to-transparent hover:shadow-none hover:underline"
              >
                {expandAll ? 'Collapse all sections' : 'Expand all sections'}
              </Button>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#D3D2D3] bg-white">
              {curriculum.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[#474348]">Course content coming soon.</p>
              ) : (
                curriculum.map((week) => {
                  const isOpen = expandAll || openWeek === week.week
                  return (
                    <div key={week.week} className="border-b border-[#E5E7EB] last:border-b-0">
                      <Button
                        type="button"
                        onClick={() => setOpenWeek(isOpen ? null : week.week)}
                        className="flex w-full items-center justify-between rounded-none bg-transparent px-4 py-3 text-left font-normal shadow-none hover:translate-y-0 hover:bg-[#F8F8FA] hover:from-[#F8F8FA] hover:to-[#F8F8FA] hover:shadow-none"
                      >
                        <p className="text-lg font-medium text-heading">{week.title}</p>
                        <div className="flex items-center gap-2">
                          <p className="hidden text-sm text-heading md:block">
                            {week.topics.length} lectures
                          </p>
                          <ChevronDown
                            className={`h-4 w-4 text-[#696969] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </Button>
                      {isOpen ? (
                        <ul className="space-y-1 px-4">
                          {week.topics.map((topic) => (
                            <li key={topic.id} className="border-b border-[#E5E7EB] py-3 text-primary">
                              {topic.title}
                              {topic.isQuiz ? (
                                <span className="ml-2 rounded bg-[#EEF0F6] px-2 py-0.5 text-xs font-medium text-[#303869]">
                                  Quiz
                                </span>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  )
                })
              )}
            </div>
          </section>

          <section id="course-description" className="mb-10">
            <h2 className="mb-3 text-[24px] font-medium text-heading">Description</h2>
            <div className="tetx-sm space-y-4 leading-relaxed text-[#474348] md:text-lg md:font-medium">
              <p>{course.description}</p>
            </div>
          </section>

          <section id="course-feedbacks">
            <h2 className="mb-3 text-2xl font-medium text-heading">Student Feedback</h2>
            <div className="mb-6">
              <div className="grid gap-y-3 md:grid-cols-[100px_1fr_88px] md:items-center md:gap-x-3 md:gap-y-2">
                <div className="text-center text-[48px] font-bold text-heading md:row-span-5 md:text-left">
                  4.5
                  <p className="mt-2 text-center text-sm font-normal text-[#474348] md:-mt-4 md:hidden md:text-left">
                    Course Rating
                  </p>
                </div>
                {feedbackBars.map((bar) => (
                  <div
                    key={bar.label}
                    className="grid grid-cols-[1fr_90px] items-center gap-x-1.5 md:col-span-2 md:col-end-4 md:gap-x-3"
                  >
                    <div className="h-2 overflow-hidden rounded-full bg-[#D3D2D3]">
                      <div className="h-full rounded bg-primary" style={{ width: bar.width }} />
                    </div>
                    <span className="text-right text-sm text-[#696969]">{bar.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 hidden text-center text-sm text-[#474348] md:-mt-4 md:block md:text-left">
                Course Rating
              </p>
            </div>

            <p className="text-sm text-[#474348]">Reviews will appear here once learners start enrolling.</p>
          </section>
        </div>

        <aside className="order-1 lg:order-2">
          <div className="sticky top-24 overflow-hidden rounded-lg border-[2px] border-[#E5E7EB]">
            <div className="relative aspect-[16/10]">
              <Image src={thumbnail} alt={course.title} fill className="object-cover" />
            </div>
            <div className="p-4 md:p-6">
              <p className="text-[28px] font-bold text-primary md:mb-4 md:text-[32px]">
                {formatCoursePrice(course.price)}
              </p>

              {enrollError ? (
                <p className="mb-3 text-sm text-secondary">{enrollError}</p>
              ) : null}

              {isEnrolled ? (
                <Link
                  href={`/dashboard/courses/${course.slug}`}
                  className="mb-4 flex w-full items-center justify-center rounded-md bg-primary py-3 text-center text-lg font-medium text-white transition-colors hover:bg-[#232A59] md:mb-3"
                >
                  Continue Learning
                </Link>
              ) : (
                <Button
                  type="button"
                  onClick={() => void handleEnroll()}
                  disabled={enrolling || enrollmentsLoading}
                  className="mb-4 w-full rounded-md bg-primary py-3 font-medium text-white hover:translate-y-0 hover:bg-[#232A59] hover:from-[#232A59] hover:to-[#232A59] md:mb-3 md:text-lg disabled:opacity-60"
                >
                  {enrolling ? 'Enrolling…' : isAuthenticated ? 'Enroll Now' : 'Sign in to Enroll'}
                </Button>
              )}

              <p className="mb-2 text-sm font-semibold text-heading">This course includes</p>
              <ul className="space-y-2 text-sm text-[#474348]">
                <li className="flex items-center gap-2">
                  <ICONS.Video width={16} height={16} className="shrink-0" />
                  {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
                </li>
                <li className="flex items-center gap-2">
                  <ICONS.BookDownload width={16} height={16} className="shrink-0" />
                  {course.modules.length} modules
                </li>
                <li className="flex items-center gap-2">
                  <ICONS.Device width={16} height={16} className="shrink-0" />
                  Access on mobile and TV
                </li>
                <li className="flex items-center gap-2">
                  <ICONS.Lifebuoy width={16} height={16} className="shrink-0" />
                  Instructor support
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

      {relatedCourses.length > 0 ? (
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
                      src={getCourseThumbnail(item, idx)}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
                  <span className="mb-2 w-fit rounded-sm bg-[#EEF0F6] px-2.5 py-1 text-xs font-medium text-slate-600">
                    {item.category.name}
                  </span>
                  <h3 className="mb-1.5 line-clamp-1 text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                  <p className="text-base font-bold text-slate-900">{formatCoursePrice(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
