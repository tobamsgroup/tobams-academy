"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, MoreHorizontal } from "lucide-react";
import { IMAGES } from "@/assets/images";
import { cn } from "@/lib/utils";

const RING_FILL_MAX = 90;

function ProgressRing({ percent }: { percent: number }) {
  const r = 18;
  const stroke = 3;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, percent));
  const fillRatio = (clamped / 100) * (RING_FILL_MAX / 100);
  const progressLen = c * fillRatio;
  const gapLen = c - progressLen;
  return (
    <div className="relative h-11 w-11 shrink-0" aria-hidden>
      <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="white" strokeWidth={stroke} />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={`${progressLen} ${gapLen}`}
          strokeDashoffset={0}
        />
      </svg>
    </div>
  );
}

type CoursePlayerHeaderProps = {
  courseTitle: string;
  courseProgress: number;
  completedLessonCount: number;
  totalLessonCount: number;
  /** Opens course outline / sidebar on small screens */
  onOpenCourseOutline?: () => void;
  /** Opens the “Share your feedback” modal (from More → Leave a Rating). */
  onOpenFeedback?: () => void;
};

export function CoursePlayerHeader({
  courseTitle,
  courseProgress,
  completedLessonCount,
  totalLessonCount,
  onOpenCourseOutline,
  onOpenFeedback,
}: CoursePlayerHeaderProps) {
  const [progressOpen, setProgressOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const progressWrapRef = useRef<HTMLDivElement>(null);
  const moreWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressOpen && !moreOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (progressWrapRef.current && !progressWrapRef.current.contains(t)) setProgressOpen(false);
      if (moreWrapRef.current && !moreWrapRef.current.contains(t)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [progressOpen, moreOpen]);

  return (
    <header className="relative z-20 flex shrink-0 items-center justify-between gap-3 bg-[#221D23] px-3 py-2.5 text-white md:px-16 md:py-3">
      <Link
        href="/dashboard/courses"
        className="flex h-[54px] w-[54px] shrink-0 items-center justify-center gap-2 bg-white opacity-90 hover:opacity-100"
        aria-label="Back to courses"
      >
        <Image
          src={IMAGES.newLogo}
          alt=""
          width={73}
          height={73}
          className="h-[73px] w-[73px] object-contain md:h-[73px] md:w-[73px]"
        />
      </Link>
      <h1 className="min-w-0 flex-1 truncate px-2 text-center text-[24px] font-semibold">{courseTitle}</h1>
      <div className="flex shrink-0 items-center gap-2 md:gap-12">
        <div ref={progressWrapRef} className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              setMoreOpen(false);
              setProgressOpen((o) => !o);
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-1 text-lg font-medium hover:bg-white/10",
              progressOpen && "bg-white/10",
            )}
            aria-expanded={progressOpen}
            aria-haspopup="true"
            aria-label="Your progress"
          >
            <ProgressRing percent={courseProgress} />
            Your Progress
            <ChevronDown className="h-4 w-4 text-white/70" strokeWidth={2} />
          </button>
          {progressOpen ? (
            <div
              className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-lg bg-white px-4 py-3 text-center text-[#221D23] shadow-lg"
              role="menu"
            >
              {completedLessonCount} of {totalLessonCount} Completed
            </div>
          ) : null}
        </div>

        {onOpenCourseOutline ? (
          <button
            type="button"
            onClick={() => onOpenCourseOutline()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white hover:bg-white/90 md:hidden"
            aria-label="Open course content"
          >
            <Menu className="h-5 w-5 text-[#221D23]" strokeWidth={2} />
          </button>
        ) : null}

        <div ref={moreWrapRef} className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              setProgressOpen(false);
              setMoreOpen((o) => !o);
            }}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg bg-white hover:bg-white/90",
              moreOpen && "ring-2 ring-white/40",
            )}
            aria-expanded={moreOpen}
            aria-haspopup="true"
            aria-label="More options"
          >
            <MoreHorizontal className="h-5 w-5 text-black" strokeWidth={2} />
          </button>
          {moreOpen ? (
            <div
              className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-lg bg-[#FAFDFF] py-1 shadow-lg"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                className="w-full px-4 py-3 text-left text-[#221D23] hover:bg-[#F3F4F6]"
                onClick={() => {
                  setMoreOpen(false);
                  onOpenFeedback?.();
                }}
              >
                Leave a Rating
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
