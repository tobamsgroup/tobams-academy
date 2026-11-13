"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { LessonContentCommonProps } from "./types";

/** Shown for lessons whose content hasn't been published yet. They can't be marked complete. */
export function ComingSoonLessonContent({
  moduleTitle,
  lesson,
  prevLesson,
  nextLesson,
  onSelectLesson,
}: LessonContentCommonProps) {
  return (
    <div className="pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:px-[45px] md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">{moduleTitle}</p>
        <h2 className="mt-2 text-lg font-bold text-[#111827]">{lesson.title}</h2>
      </div>

      <div className="mx-6 mt-8 flex flex-col items-center rounded-[12px] border border-[#D3D2D366] bg-white px-6 py-12 text-center md:mx-[45px]">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF0F6] text-primary">
          <Clock className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-heading">Content coming soon</h3>
        <p className="mt-2 max-w-md text-sm text-[#474348]">
          This lesson&apos;s material is being prepared. You&apos;ll be able to study it here as soon as it&apos;s
          released, and we&apos;ll let you know.
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between px-6 pt-6 md:px-[45px]">
        {prevLesson ? (
          <button
            type="button"
            onClick={() => onSelectLesson(prevLesson.id)}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#303869] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            Previous
          </button>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <button
            type="button"
            onClick={() => onSelectLesson(nextLesson.id)}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#303869] hover:underline"
          >
            Next
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
