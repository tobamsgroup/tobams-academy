"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Minus, Plus, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonContentCommonProps } from "./types";

const ZOOM_MIN = 90;
const ZOOM_MAX = 130;
const ZOOM_STEP = 10;
const MOBILE_TOTAL_PAGES = 3;

function MobilePdfPage({ page }: { page: number }) {
  if (page === 1) {
    return (
      <>
        <h3 className="text-lg font-bold text-[#111827]">Why This Distinction Matters</h3>
        <p className="mt-4 text-base leading-relaxed">
          In our consumer-driven world, the line between wants and needs has become dangerously blurred. Every day,
          we&apos;re bombarded with messages telling us we &quot;need&quot; the latest smartphone, designer clothes, or
          premium subscriptions. Learning to pause and ask whether something is truly essential is one of the fastest ways
          to reduce financial stress and build lasting wealth.
        </p>
      </>
    );
  }

  if (page === 2) {
    return (
      <>
        <h3 className="text-lg font-bold text-[#111827]">The Fundamental Difference</h3>
        <p className="mt-4 text-base leading-relaxed">
          <strong className="text-[#111827]">Needs</strong> are expenses required for survival, health, and basic
          functioning—shelter, food, utilities, and necessary healthcare.{" "}
          <strong className="text-[#111827]">Wants</strong> are desires that improve comfort, status, or enjoyment but
          are not required to live and work safely.
        </p>
        <p className="mt-6 text-base leading-relaxed">
          The distinction can become blurry depending on your culture, income, and circumstances. What counts as a need
          for one household may be a want for another.
        </p>
      </>
    );
  }

  return (
    <p className="text-base leading-relaxed">
      The goal is not perfection—it is awareness. When you understand interest, inflation, and how small choices
      compound over time, you can align spending with what truly supports your long-term goals.
    </p>
  );
}

export function BasicsOfInterestPdfLessonContent({
  moduleTitle,
  lesson,
  isCompleted,
  onMarkComplete,
  prevLesson,
  nextLesson,
  onSelectLesson,
}: LessonContentCommonProps) {
  const [zoom, setZoom] = useState(100);
  const [mobilePage, setMobilePage] = useState(1);

  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));

  return (
    <div className="pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:px-[45px] md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">{moduleTitle}</p>
        <h2 className="mt-2 text-lg font-bold text-[#111827]">{lesson.title}</h2>
      </div>

      <div className="mx-auto mt-6 w-full md:px-[45px]">
        <div className="overflow-hidden" style={{ fontSize: `${zoom}%` }}>
          <article className="bg-white px-6 py-8 text-[#474348] md:px-8 md:py-6">
            {/* Desktop: full document */}
            <div className="hidden md:block">
              <h3 className="text-lg font-bold text-[#111827] md:text-xl">Why This Distinction Matters</h3>
              <p className="mt-4 text-base leading-relaxed">
                In our consumer-driven world, the line between wants and needs has become dangerously blurred. Every day,
                we&apos;re bombarded with messages telling us we &quot;need&quot; the latest smartphone, designer clothes,
                or premium subscriptions. Learning to pause and ask whether something is truly essential is one of the
                fastest ways to reduce financial stress and build lasting wealth.
              </p>

              <h3 className="mt-8 text-lg font-bold text-[#111827] md:text-xl">The Fundamental Difference</h3>
              <p className="mt-4 text-base leading-relaxed">
                <strong className="text-[#111827]">Needs</strong> are expenses required for survival, health, and basic
                functioning—shelter, food, utilities, and necessary healthcare.{" "}
                <strong className="text-[#111827]">Wants</strong> are desires that improve comfort, status, or enjoyment
                but are not required to live and work safely.
              </p>

              <p className="mt-6 text-base leading-relaxed">
                The distinction can become blurry depending on your culture, income, and circumstances. What counts as a
                need for one household may be a want for another. The goal is not perfection—it is awareness. When you
                understand interest, inflation, and how small choices compound over time, you can align spending with what
                truly supports your long-term goals.
              </p>
            </div>

            {/* Mobile: one section per page */}
            <div className="min-h-[200px] md:hidden">
              <MobilePdfPage page={mobilePage} />
            </div>

            {/* Mobile page handler */}
            <div className="mt-6 flex items-center justify-center gap-12 border-t border-[#EEF0F6] py-6 md:hidden">
              <button
                type="button"
                onClick={() => setMobilePage((p) => Math.max(1, p - 1))}
                disabled={mobilePage <= 1}
                className="rounded p-1 disabled:cursor-default"
                aria-label="Previous page"
              >
                <ChevronLeft
                  className={cn(
                    "h-7 w-7",
                    mobilePage <= 1 ? "text-[#D1D5DB]" : "text-[#303869]",
                  )}
                  strokeWidth={2}
                />
              </button>
              <button
                type="button"
                onClick={() => setMobilePage((p) => Math.min(MOBILE_TOTAL_PAGES, p + 1))}
                disabled={mobilePage >= MOBILE_TOTAL_PAGES}
                className="rounded p-1 disabled:cursor-default"
                aria-label="Next page"
              >
                <ChevronRight
                  className={cn(
                    "h-7 w-7",
                    mobilePage >= MOBILE_TOTAL_PAGES ? "text-[#D1D5DB]" : "text-[#303869]",
                  )}
                  strokeWidth={2}
                />
              </button>
            </div>
          </article>

          {/* Desktop toolbar */}
          <div className="mt-10 hidden items-center justify-between bg-[#6F7BC3] px-4 py-3 text-white md:flex md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= ZOOM_MIN}
                className="rounded p-1 hover:bg-white/15 disabled:opacity-40"
                aria-label="Zoom out"
              >
                <Minus className="h-5 w-5" strokeWidth={2} />
              </button>
              <button type="button" onClick={zoomIn} className="rounded p-1 hover:bg-white/15" aria-label="Zoom in">
                <ZoomIn className="h-5 w-5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= ZOOM_MAX}
                className="rounded p-1 hover:bg-white/15 disabled:opacity-40"
                aria-label="Increase zoom"
              >
                <Plus className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <p className="text-sm font-medium text-white/90">Page 1 of 1</p>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-col gap-10 items-start px-6 md:px-0">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D3D2D366] bg-[#F3F4F6] px-3 py-2.5 text-sm font-medium text-[#221D23] hover:bg-[#E8ECF0] md:w-auto md:justify-start"
          >
            <Download className="h-4 w-4 shrink-0" strokeWidth={2} />
            Download
          </button>

          <button
            type="button"
            onClick={onMarkComplete}
            disabled={isCompleted}
            className="w-full rounded-lg bg-[#303869] px-5 py-3 text-sm font-medium text-white hover:bg-[#252d56] disabled:cursor-default disabled:opacity-60 md:w-auto"
          >
            {isCompleted ? "Completed" : "Mark As Completed"}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-between px-6 pt-6 md:px-0">
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
    </div>
  );
}
