"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import type { LessonContentCommonProps } from "./types";
import { useLessonDocument } from "./useLessonDocument";

const PdfPages = dynamic(() => import("./PdfPages"), {
  ssr: false,
  loading: () => <p className="p-6 text-sm text-[#6C686C]">Loading slides…</p>,
});

const SLIDE_RATIO = 9 / 16;
/** The deck only auto-completes after it has been open this long (so clicking through doesn't). */
const MIN_VIEW_MS = 15_000;

/** A week's slide deck: one slide at a time, keyboard and full-screen friendly. */
export function SlideLessonContent({
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
  const first = lesson.pageStart ?? 1;
  const [slide, setSlide] = useState(first);
  const [total, setTotal] = useState<number | null>(null);
  const last = lesson.pageEnd ?? total ?? first;

  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setStageWidth(entry.contentRect.width);
      setStageHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const go = useCallback((delta: number) => setSlide((s) => Math.min(last, Math.max(first, s + delta))), [first, last]);

  // ← / → move between slides (ignored while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Reaching the last slide completes the lesson (once it has been open a little while).
  const openedAt = useRef(0);
  const completeTimer = useRef<number | null>(null);
  useEffect(() => {
    openedAt.current = Date.now();
    return () => {
      if (completeTimer.current) window.clearTimeout(completeTimer.current);
    };
  }, []);
  useEffect(() => {
    if (isCompleted || total === null || slide !== last || completeTimer.current) return;
    const wait = Math.max(0, MIN_VIEW_MS - (Date.now() - openedAt.current));
    completeTimer.current = window.setTimeout(() => {
      completeTimer.current = null;
      void onMarkComplete();
    }, wait);
  }, [slide, last, total, isCompleted, onMarkComplete]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen?.();
  };

  // Fit the slide inside the stage: full width normally, limited by height in full screen.
  const slideWidth = Math.floor(
    fullscreen && stageHeight > 0 ? Math.min(stageWidth, (stageHeight - 64) / SLIDE_RATIO) : Math.min(stageWidth, 1100),
  );
  const count = last - first + 1;
  const position = slide - first + 1;

  return (
    <div className="pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:px-[45px] md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">{moduleTitle}</p>
        <h2 className="mt-2 text-lg font-bold text-[#111827]">{lesson.title}</h2>
      </div>

      <div className="mx-auto mt-6 w-full md:px-[45px]">
        <div
          ref={stageRef}
          className={`relative flex flex-col items-center bg-[#1E2347] ${fullscreen ? "h-screen justify-center" : "rounded-lg px-2 py-4 md:px-4"}`}
          onContextMenu={(e) => e.preventDefault()}
        >
          {error ? (
            <p className="p-8 text-sm text-white">
              {error.message === "not-enrolled"
                ? "You need active access to this course to view these slides."
                : "We couldn't load the slides. Please refresh and try again."}
            </p>
          ) : data && slideWidth > 0 ? (
            <PdfPages
              data={data}
              pageStart={slide}
              pageEnd={slide}
              width={slideWidth}
              aspectRatio={SLIDE_RATIO}
              onPageCount={setTotal}
            />
          ) : (
            <p className="p-8 text-sm text-white/80">Loading slides…</p>
          )}

          <div className="mt-3 flex w-full max-w-[1100px] items-center justify-between px-2 text-white">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={slide <= first}
              className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" /> Prev
            </button>
            <span className="text-sm tabular-nums" aria-live="polite">
              {total ? `Slide ${position} of ${count}` : "Slides"}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => go(1)}
                disabled={slide >= last}
                className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
                aria-label="Next slide"
              >
                Next <ChevronRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="rounded p-1.5 hover:bg-white/10"
                aria-label={fullscreen ? "Exit full screen" : "Full screen"}
              >
                {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 px-6 text-xs text-[#6C686C] md:px-0">
          Tip: use the ← and → keys to move between slides. The lesson is marked complete when you reach the last
          slide.
        </p>

        <div className="mt-6 flex w-full flex-col items-start gap-10 px-6 md:px-0">
          <button
            type="button"
            onClick={onMarkComplete}
            disabled={isCompleted || isMarkingComplete}
            className="w-full rounded-lg bg-[#303869] px-5 py-3 text-sm font-medium text-white hover:bg-[#252d56] disabled:cursor-default disabled:opacity-60 md:w-auto"
          >
            {isCompleted ? "Completed" : isMarkingComplete ? "Saving…" : "Mark As Completed"}
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
