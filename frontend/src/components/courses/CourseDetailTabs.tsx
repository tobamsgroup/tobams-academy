'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { LocalCourse } from '@/types/course'

interface Props {
  course: LocalCourse
}

type Tab = 'about' | 'curriculum' | 'reviews'

const TAB_LABELS: Record<Tab, string> = {
  about: 'About Course',
  curriculum: 'Curriculum',
  reviews: 'Reviews',
}

export function CourseDetailTabs({ course }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('about')
  const [openWeek, setOpenWeek] = useState<number | null>(
    course.curriculum[0]?.week ?? null,
  )

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 mb-8">
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap
              ${
                activeTab === tab
                  ? 'border-b-2 border-[#571244] text-[#571244]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* About Course */}
      {activeTab === 'about' && (
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Who this course is for?
            </h2>
            <ul className="space-y-2">
              {course.targetAudience.map((audience, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-0.5 shrink-0 text-[#EF4353]">•</span>
                  <span>{audience}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Course Objectives:
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{course.objective}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-5">
              Key Learning Outcomes:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.keyLearningOutcomes.map((outcome, i) => (
                <div key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold">
                    ✓
                  </span>
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Curriculum */}
      {activeTab === 'curriculum' && (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {course.curriculum.map((week) => (
            <div key={week.week}>
              <button
                onClick={() =>
                  setOpenWeek(openWeek === week.week ? null : week.week)
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                    Week {week.week}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{week.title}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-slate-400">
                    {week.topics.length} topic{week.topics.length !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      openWeek === week.week ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {openWeek === week.week && (
                <ul className="border-t border-slate-100 bg-slate-50 px-4 py-3 space-y-2">
                  {week.topics.map((topic, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-600"
                    >
                      <span className="mt-0.5 shrink-0 text-[#571244] font-bold">›</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {activeTab === 'reviews' && (
        <div className="py-16 text-center">
          <p className="text-slate-400 text-sm">
            No reviews yet. Be the first to review this course.
          </p>
        </div>
      )}
    </div>
  )
}
