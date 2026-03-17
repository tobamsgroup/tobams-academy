'use client'

import { useState } from 'react'
import { ChevronDown, Clock, PlayCircle } from 'lucide-react'
import type { CourseModule } from '@/types/course'

interface Props {
  modules: CourseModule[]
}

export function CourseOutline({ modules }: Props) {
  const [open, setOpen] = useState<string | null>(modules[0]?.id ?? null)

  if (modules.length === 0) {
    return <p className="text-sm text-slate-400">Course outline coming soon.</p>
  }

  return (
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
      {modules.map((mod) => (
        <div key={mod.id}>
          <button
            onClick={() => setOpen(open === mod.id ? null : mod.id)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold text-slate-800">{mod.title}</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${open === mod.id ? 'rotate-180' : ''}`}
            />
          </button>
          {open === mod.id && (
            <ul className="border-t border-slate-100 bg-slate-50 px-4 py-2">
              {mod.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center gap-2 py-1.5 text-xs text-slate-600">
                  <PlayCircle className="h-3.5 w-3.5 shrink-0 text-[#571244]" />
                  <span className="flex-1">{lesson.title}</span>
                  {lesson.duration && (
                    <span className="flex items-center gap-0.5 text-slate-400">
                      <Clock className="h-3 w-3" /> {lesson.duration}m
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
