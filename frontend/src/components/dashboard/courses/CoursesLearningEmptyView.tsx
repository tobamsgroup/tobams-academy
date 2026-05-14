"use client";

/**
 * Empty-state hero: add `frontend/public/courses-empty-illustration.png`.
 * If the image is missing or fails to load, a folder icon fallback is shown.
 */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CircleDashed, Clock, FolderOpen, LineChart } from "lucide-react";
import { ICONS } from "@/assets/icons";
import CourseSortDropdown, { type CourseSortKey } from "./CourseSortDropdown";
import { IMAGES } from "@/assets/images";

function IllustrationFallback() {
  return (
    <div className="flex h-44 w-44 items-center justify-center rounded-full bg-[#EEF0F6] md:h-52 md:w-52">
      <FolderOpen className="h-20 w-20 text-[#9CA3AF] md:h-24 md:w-24" strokeWidth={1.25} aria-hidden />
    </div>
  );
}

export default function CoursesLearningEmptyView() {
  const [sortBy, setSortBy] = useState<CourseSortKey>("recent");
  const [illustrationFailed, setIllustrationFailed] = useState(false);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 grid grid-cols-2 gap-4 md:mb-8 md:grid-cols-3 md:gap-6">
        <div className="rounded-[12px] border border-[#D3D2D333] bg-white p-4 md:p-5">
          <div className="flex items-start gap-3 md:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0F6] text-[#303869]">
              <CircleDashed className="h-5 w-5" strokeWidth={2} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-sm text-[#474348] md:mb-2">Course In Progress</p>
              <p className="text-lg font-semibold text-heading">0</p>
            </div>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#D3D2D333] bg-white p-4 md:p-5">
          <div className="flex items-start gap-3 md:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0F6] text-[#303869]">
              <Clock className="h-5 w-5" strokeWidth={2} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-sm text-[#474348] md:mb-2">
                <span className="md:hidden">Total Learning hrs</span>
                <span className="hidden md:inline">Total Learning Hours</span>
              </p>
              <p className="text-lg font-semibold text-heading">0</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 rounded-[12px] border border-[#D3D2D333] bg-white p-4 md:col-span-1 md:p-5">
          <div className="flex items-start gap-3 md:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0F6] text-[#303869]">
              <LineChart className="h-5 w-5" strokeWidth={2} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-sm text-[#474348] md:mb-2">Average Progress</p>
              <p className="text-lg font-semibold text-heading">0%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="order-1 w-full lg:order-2 lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
          <div className="flex min-h-12 w-full items-stretch overflow-hidden rounded-lg border border-[#D3D2D366] bg-white transition-[box-shadow] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-0 lg:max-w-[420px]">
            <div className="relative min-w-0 flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center pl-3 md:flex">
                <ICONS.PaymentSearch />
              </div>
              <input
                type="search"
                readOnly
                placeholder="Search courses by name, category"
                className="h-12 w-full min-w-0 cursor-default border-0 bg-transparent py-3 pl-3 pr-2 text-[#221D23] outline-none placeholder:text-[#6C686C] md:pl-10 md:pr-4"
                aria-readonly
              />
            </div>
            <div className="my-2.5 w-px shrink-0 self-stretch bg-[#D3D2D3] md:hidden" aria-hidden />
            <span className="m-1.5 flex w-11 shrink-0 items-center justify-center rounded-md bg-[#303869] text-white md:hidden">
              <ICONS.PaymentSearch className="h-5 w-5" stroke="currentColor" aria-hidden />
            </span>
          </div>
        </div>

        <div className="order-2 flex w-full flex-wrap gap-2 lg:order-1 lg:w-auto">
          <span className="rounded-lg bg-[#303869] px-4 py-2 text-sm font-medium text-white md:text-base">
            All Courses(0)
          </span>
          <span className="rounded-lg border border-[#D3D2D366] bg-white px-4 py-2 text-sm font-medium text-[#474348] md:text-base">
            In progress
          </span>
          <span className="rounded-lg border border-[#D3D2D366] bg-white px-4 py-2 text-sm font-medium text-[#474348] md:text-base">
            Completed
          </span>
        </div>

        <div className="order-3 flex w-full justify-end lg:order-3 lg:w-auto lg:shrink-0">
          <CourseSortDropdown value={sortBy} onChange={setSortBy} className="w-auto min-w-0 max-w-full" />
        </div>
      </div>

      <div className="flex flex-col items-center px-4 py-16 text-center md:py-20">
        <div className="mb-8 flex justify-center">
          {!illustrationFailed ? (
            <div className="relative h-44 w-44 md:h-52 md:w-52">
              <Image
                src={IMAGES.books}
                alt=""
                fill
                className="object-contain"
                onError={() => setIllustrationFailed(true)}
              />
            </div>
          ) : (
            <IllustrationFallback />
          )}
        </div>
        <h1 className="text-xl font-semibold text-[#221D23] md:text-2xl">No Courses Found</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#6C686C] md:text-base">
          You haven&apos;t enrolled in any courses yet.{" "}
          <Link href="/dashboard/courses/explore" className="font-medium text-[#303869] hover:underline">
            Enroll now
          </Link>{" "}
          to begin your learning journey.
        </p>
      </div>
    </div>
  );
}
