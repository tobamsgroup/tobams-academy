"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LessonContentCommonProps } from "./types";

const LESSON_DISPLAY_TITLE = "How to Differentiate Between Wants and Needs";

export function WantsVsNeedsArticleLessonContent({
  course,
  moduleTitle,
  lesson,
  isCompleted,
  onMarkComplete,
  prevLesson,
  nextLesson,
  onSelectLesson,
}: LessonContentCommonProps) {
  const mins = lesson.durationMin;
  const timeLabel = mins === 1 ? "1min" : `${mins}mins`;

  return (
    <div className="pb-10">
      <div className="flex flex-col gap-1 border-b border-[#D3D2D366] px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">{moduleTitle}</p>
        <p className="text-xs text-[#6C686C] sm:text-right">
          Estimated Completion Time: {timeLabel}
        </p>
      </div>

      <article className="mx-auto max-w-[975px] px-6 py-8">
        <h1 className="text-[20px] md:text-[24px] font-semibold text-heading">{LESSON_DISPLAY_TITLE}</h1>

        <h2 className="mt-8 text-lg font-semibold md:text-[20px] text-heading">Why This Distinction Matters</h2>
        <p className="mt-3 text-base leading-relaxed text-[#474348]">
        In our consumer-driven world, the line between wants and needs has become dangerously blurred. Every day, we're bombarded with messages telling us we "need" the latest smartphone, designer clothes, or premium subscriptions. But true financial freedom begins with understanding this critical distinction. This comprehensive guide will give you the tools to make smarter spending decisions, reduce financial stress, and build lasting wealth.
        </p>

        <h2 className="mt-8 md:text-lg font-medium text-heading">The Fundamental Difference</h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm md:text-base leading-relaxed text-[#474348] marker:font-semibold marker:text-[#111827]">
          <li>
            <span className="font-medium">Basic shelter:</span> rent and mortgage payments
          </li>
          <li>
            <span className="text-[#474348]">Nutritious food:</span> groceries, not restaurant meals
          </li>
          <li>
            <span className="font-medium">Essential clothing:</span> weather-appropriate, work-required attire
          </li>
          <li>
            <span className="font-medium">Healthcare:</span> insurance, medications, preventive care
          </li>
          <li>
            <span className="font-medium">Basic utilities:</span> electricity, water, heating
          </li>
        </ol>

        <div className="relative mt-6 md:mt-10 aspect-[21/9] w-full overflow-hidden bg-[#E5E7EB] md:aspect-[2/1]">
          <Image
            src={course.thumbnail}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 975px"
            priority
          />
        </div>
      </article>

      <div className="w-full md:mx-auto md:max-w-[975px] px-6">
        <button
          type="button"
          onClick={onMarkComplete}
          disabled={isCompleted}
          className="rounded-lg bg-[#303869] px-5 py-3 text-sm font-medium text-white hover:bg-[#252d56] disabled:cursor-default disabled:opacity-60 w-full md:w-auto"
        >
          {isCompleted ? "Completed" : "Mark As Completed"}
        </button>
      </div>

      <div className="mx-auto mt-10 flex max-w-[975px] items-center justify-between border-t border-[#EEF0F6] px-6 pt-6">
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
