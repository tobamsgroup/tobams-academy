"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Headphones,
  List,
  Maximize2,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
  ScrollText,
  Volume2,
} from "lucide-react";
import type { LessonContentCommonProps } from "./types";
import { VideoPlayerSettingsMenu } from "./VideoPlayerSettingsMenu";
import Image from "next/image";
import { IMAGES } from "@/assets/images";




export function InterestLiveHaulLessonContent({
  moduleTitle,
  lesson,
  isCompleted,
  onMarkComplete,
  prevLesson,
  nextLesson,
  onSelectLesson,
}: LessonContentCommonProps) {
  return (
    <div className="pb-8 md:pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">Module: {moduleTitle}</p>
        <h2 className="mt-2 text-2xl font-bold text-[#111827] md:text-3xl">{lesson.title}</h2>
      </div>

      <div className="mx-auto mt-6 w-full md:px-6">
        <div className="relative w-full h-[240px] md:h-[400px] overflow-hidden bg-[#CCDBEB]">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Image src={IMAGES.AudioFrame} alt="Audio Frame" width={280} height={280} className="md:w-[280px] md:h-[280px] w-[180px] h-[180px] object-cover" />
            <button
              type="button"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex md:h-16 md:w-16 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-105"
              aria-label="Play audio"
            >
              <Play className="ml-1 md:h-8 md:w-8 h-6 w-6 text-[#303869]" fill="currentColor" strokeWidth={0} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/50">
            <div className="h-full w-0 bg-emerald-500" />
          </div>
        </div>

        <div className="flex flex-nowrap items-center justify-between gap-2 bg-[#CCDBEB80] px-3 py-2.5 text-[#374151] md:flex-wrap md:gap-3">
          <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 md:gap-3">
            <button type="button" className="shrink-0 rounded p-1 hover:bg-black/5" aria-label="Pause">
              <Pause className="h-5 w-5" fill="currentColor" />
            </button>
            <button type="button" className="shrink-0 rounded p-1 hover:bg-black/5" aria-label="Back 10 seconds">
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
            </button>
            <span className="shrink-0 rounded border border-[#C4C4C4] bg-white px-2 py-0.5 text-xs font-medium">1x</span>
            <button type="button" className="shrink-0 rounded p-1 hover:bg-black/5" aria-label="Forward 10 seconds">
              <RotateCw className="h-4 w-4" strokeWidth={2} />
            </button>
            <span className="min-w-0 shrink truncate text-[11px] font-medium tabular-nums text-[#4B5563] md:text-xs">
              0:00/0:00
            </span>
            <button
              type="button"
              className="hidden shrink-0 items-center gap-1 rounded p-1 hover:bg-black/5 md:inline-flex"
              aria-label="Course outline"
            >
              <List className="h-5 w-5" strokeWidth={2} />
              <span className="text-xs font-medium">Course Outline</span>
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 md:gap-2">
            <button type="button" className="rounded p-1 hover:bg-black/5" aria-label="Volume">
              <Volume2 className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              className="hidden rounded p-1 hover:bg-black/5 md:inline-flex"
              aria-label="Transcript"
            >
              <ScrollText className="h-5 w-5" strokeWidth={2} />
            </button>
            <VideoPlayerSettingsMenu />
            <button
              type="button"
              className="hidden rounded p-1 hover:bg-black/5 md:inline-flex"
              aria-label="Picture in picture"
            >
              <PictureInPicture2 className="h-5 w-5" strokeWidth={2} />
            </button>
            <button type="button" className="rounded p-1 hover:bg-black/5" aria-label="Fullscreen">
              <Maximize2 className="h-5 w-5" strokeWidth={2} />
            </button>
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
