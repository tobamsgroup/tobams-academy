"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLessonDocument } from "./useLessonDocument";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import type { LessonContentCommonProps } from "./types";

const PdfPages = dynamic(() => import("./PdfPages"), {
  ssr: false,
  loading: () => <p className="p-6 text-sm text-[#6C686C]">Loading reading…</p>,
});

/** A reading only auto-completes after it has been open this long (so clicking through doesn't). */
const MIN_READ_MS = 15_000;
const ZOOM_MIN = 70;
const ZOOM_MAX = 160;
const ZOOM_STEP = 15;
const MAX_PAGE_WIDTH = 900;

/** A reading lesson: shows this lesson's section of the week's PDF. */
export function PdfLessonContent({
  moduleTitle,
  lesson,
  isCompleted,
  isMarkingComplete,
  onMarkComplete,
  prevLesson,
  nextLesson,
  onSelectLesson,
}: LessonContentCommonProps) {
  const { data, error } = useLessonDocument(lesson);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reaching the last page of the section marks the lesson complete (once it's been open a bit).
  const openedAt = useRef(0);
  const completeTimer = useRef<number | null>(null);
  const autoCompleted = useRef(false);
  useEffect(() => {
    openedAt.current = Date.now();
    return () => {
      if (completeTimer.current) window.clearTimeout(completeTimer.current);
    };
  }, []);

  const handleReachedEnd = () => {
    if (isCompleted || autoCompleted.current || completeTimer.current) return;
    const wait = Math.max(0, MIN_READ_MS - (Date.now() - openedAt.current));
    completeTimer.current = window.setTimeout(() => {
      completeTimer.current = null;
      autoCompleted.current = true;
      void onMarkComplete();
    }, wait);
  };

  const pageWidth = Math.round(Math.min(containerWidth, MAX_PAGE_WIDTH) * (zoom / 100));
  const pageStart = lesson.pageStart ?? 1;
  const pageEnd = lesson.pageEnd ?? totalPages ?? undefined;

  return (
    <div className="pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:px-[45px] md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">{moduleTitle}</p>
        <h2 className="mt-2 text-lg font-bold text-[#111827]">{lesson.title}</h2>
      </div>

      <div className="mx-auto mt-6 w-full md:px-[45px]">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#6F7BC3] px-4 py-3 text-white md:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
              disabled={zoom <= ZOOM_MIN}
              className="rounded p-1 hover:bg-white/15 disabled:opacity-40"
              aria-label="Zoom out"
            >
              <Minus className="h-5 w-5" strokeWidth={2} />
            </button>
            <span className="w-12 text-center text-sm tabular-nums">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
              disabled={zoom >= ZOOM_MAX}
              className="rounded p-1 hover:bg-white/15 disabled:opacity-40"
              aria-label="Zoom in"
            >
              <Plus className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <p className="text-sm font-medium text-white/90">
            {totalPages ? `Pages ${pageStart}–${pageEnd} of ${totalPages}` : "Reading"}
          </p>
        </div>

        <div
          ref={containerRef}
          className="overflow-x-auto bg-[#F3F4F6] px-2 py-6 md:px-6"
          onContextMenu={(e) => e.preventDefault()}
        >
          {error ? (
            <p className="p-6 text-sm text-secondary">
              {error.message === "not-enrolled"
                ? "You need to be enrolled in this course to read this lesson."
                : "We couldn't load this reading. Please refresh and try again."}
            </p>
          ) : data && pageWidth > 0 ? (
            <PdfPages
              data={data}
              pageStart={pageStart}
              pageEnd={lesson.pageEnd}
              width={pageWidth}
              onPageCount={setTotalPages}
              onReachedEnd={handleReachedEnd}
            />
          ) : (
            <p className="p-6 text-sm text-[#6C686C]">Loading reading…</p>
          )}
        </div>

        <div className="mt-6 flex w-full flex-col items-start gap-10 px-6 md:px-0">
          <button
            type="button"
            onClick={onMarkComplete}
            disabled={isCompleted || isMarkingComplete}
            className="w-full rounded-lg bg-[#303869] px-5 py-3 text-sm font-medium text-white hover:bg-[#252d56] disabled:cursor-default disabled:opacity-60 md:w-auto"
          >
            {isCompleted ? "Completed" : isMarkingComplete ? "Saving…" : "Mark As Completed"}
          </button>
          {!isCompleted ? (
            <p className="-mt-8 text-xs text-[#6C686C]">
              This lesson is marked complete automatically when you reach the end of the reading.
            </p>
          ) : null}
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
