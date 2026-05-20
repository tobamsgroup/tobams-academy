"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ListVideo,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Subtitles,
  Volume2,
} from "lucide-react";
import type { DefaultLessonContentProps } from "./types";
import { VideoPlayerSettingsMenu } from "./VideoPlayerSettingsMenu";

export function DefaultLessonContent({
  course,
  moduleTitle,
  lesson,
  isCompleted,
  onMarkComplete,
  prevLesson,
  nextLesson,
  onSelectLesson,
  transcriptBody,
}: DefaultLessonContentProps) {
  return (
    <div className="pb-8 md:pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">
          Module: {moduleTitle}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#111827] md:text-3xl">{lesson.title}</h2>
      </div>

      <div className="mx-auto mt-6 w-full md:px-6">
        <div className="relative h-[240px] md:h-[456px] w-full overflow-hidden bg-black">
          <Image
            src={course.thumbnail}
            alt=""
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <button
              type="button"
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white/95 text-[#303869] shadow-lg transition-transform hover:scale-105"
              aria-label="Play video"
            >
              <Play className="ml-1 h-8 w-8" fill="#221D23" strokeWidth={0} />
            </button>
          </div>
          <div className="absolute bottom-4 left-0 right-0 h-[13px] bg-white w-[90%] mx-auto rounded">
            <div className="h-full w-[18%] bg-[#099137] rounded-l-[4px]" />
          </div>
        </div>

        <div className="flex flex-nowrap items-center justify-between gap-2 bg-[#CCDBEB80] px-3 py-1 text-[#374151] md:flex-wrap md:gap-3">
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
              0:00/1:23
            </span>
            <button
              type="button"
              className="hidden shrink-0 rounded p-1 hover:bg-black/5 md:inline-flex"
              aria-label="Playlist"
            >
              <ListVideo className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 md:gap-2">
            <button
              type="button"
              className="hidden rounded p-1 hover:bg-black/5 md:inline-flex"
              aria-label="Volume"
            >
              <Volume2 className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              className="hidden rounded p-1 hover:bg-black/5 md:inline-flex"
              aria-label="Captions"
            >
              <Subtitles className="h-5 w-5" strokeWidth={2} />
            </button>
            <VideoPlayerSettingsMenu />
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

          {transcriptBody ? (
            <div className="w-full border-b border-[#E5E7EB] pb-4 md:hidden">
              <p className="text-sm font-semibold text-[#221D23]">Transcript</p>
              <p className="mt-2 text-sm leading-relaxed text-[#6C686C]">{transcriptBody}</p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={onMarkComplete}
            disabled={isCompleted}
            className="w-full rounded-lg bg-[#303869] px-5 py-3 text-sm font-medium text-white hover:bg-[#252d56] disabled:cursor-default disabled:opacity-60 md:w-auto"
          >
            {isCompleted ? "Completed" : "Mark As Completed"}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-between pt-6">
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
