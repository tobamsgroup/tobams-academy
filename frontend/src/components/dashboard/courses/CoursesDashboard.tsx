"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CourseSortDropdown, { type CourseSortKey } from "./CourseSortDropdown";
import { EnrolledCourseCard } from "./EnrolledCourseCard";
import { ICONS } from "@/assets/icons";
import { useEnrollments } from "@/hooks/useEnrollments";
import {
  DASHBOARD_COURSES_PAGE_SIZE,
  countCoursesInTab,
  formatLearningHours,
  matchesCourseTab,
  sortDashboardCourses,
  toDashboardCourseFromEnrollment,
} from "@/lib/dashboard-courses";

function buildPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) out.push("ellipsis");
    out.push(sorted[i]!);
  }
  return out;
}

function matchesSearch(
  course: { title: string; description: string; category: { name: string } },
  query: string,
): boolean {
  if (!query) return true;
  const haystack = `${course.title} ${course.description} ${course.category.name}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default function CoursesDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "inProgress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<CourseSortKey>("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const deferredSearch = useDeferredValue(searchQuery.trim());

  const { enrollments, stats: enrollmentStats, isLoading, error, mutate } = useEnrollments();

  useEffect(() => {
    void mutate();
  }, [mutate]);

  const dashboardCourses = useMemo(
    () => enrollments.map(toDashboardCourseFromEnrollment),
    [enrollments],
  );

  const filteredCourses = useMemo(() => {
    const tabbed = dashboardCourses.filter((course) => matchesCourseTab(course, activeTab));
    const searched = tabbed.filter((course) => matchesSearch(course, deferredSearch));
    return sortDashboardCourses(searched, sortBy);
  }, [dashboardCourses, activeTab, deferredSearch, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / DASHBOARD_COURSES_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const visibleCourses = useMemo(() => {
    const start = (safePage - 1) * DASHBOARD_COURSES_PAGE_SIZE;
    return filteredCourses.slice(start, start + DASHBOARD_COURSES_PAGE_SIZE);
  }, [filteredCourses, safePage]);

  const tabCounts = useMemo(
    () => ({
      all: dashboardCourses.length,
      inProgress: countCoursesInTab(dashboardCourses, "inProgress"),
      completed: countCoursesInTab(dashboardCourses, "completed"),
    }),
    [dashboardCourses],
  );

  const stats = useMemo(() => {
    const avgProgress =
      dashboardCourses.length > 0
        ? Math.round(
            dashboardCourses.reduce((sum, course) => sum + course.progress, 0) /
              dashboardCourses.length,
          )
        : 0;
    return {
      inProgress: enrollmentStats?.coursesInProgress ?? 0,
      totalHours: formatLearningHours(enrollmentStats?.totalLearningHours ?? 0),
      avgProgress,
    };
  }, [dashboardCourses, enrollmentStats]);

  const hasNoEnrollments = !isLoading && !error && dashboardCourses.length === 0;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 grid grid-cols-2 gap-4 md:mb-8 md:grid-cols-3 md:gap-6">
        <div className="rounded-[12px] border border-[#D3D2D333] bg-white p-4 md:p-5">
          <div className="flex items-start gap-3 md:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0F6]">
              <ICONS.Progress />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-sm text-[#474348] md:mb-2">Course In Progress</p>
              <p className="text-lg font-semibold text-heading">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#D3D2D333] bg-white p-4 md:p-5">
          <div className="flex items-start gap-3 md:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0F6]">
              <ICONS.Progress />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-sm text-[#474348] md:mb-2">
                <span className="md:hidden">Total Learning hrs</span>
                <span className="hidden md:inline">Total Learning Hours</span>
              </p>
              <p className="text-lg font-semibold text-heading">{stats.totalHours}</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 rounded-[12px] border border-[#D3D2D333] bg-white p-4 md:col-span-1 md:p-5">
          <div className="flex items-start gap-3 md:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF0F6]">
              <ICONS.Progress />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-sm text-[#474348] md:mb-2">Average Progress</p>
              <p className="text-lg font-semibold text-heading">{stats.avgProgress}%</p>
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
                placeholder="Search by topic, keyword, or instruct…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-12 w-full min-w-0 border-0 bg-transparent py-3 pl-3 pr-2 text-[#221D23] outline-none placeholder:text-[#6C686C] md:pl-10 md:pr-4"
              />
            </div>
            <div className="my-2.5 w-px shrink-0 self-stretch bg-[#D3D2D3] md:hidden" aria-hidden />
            <button
              type="button"
              className="m-1.5 flex w-11 shrink-0 items-center justify-center rounded-md bg-[#303869] text-white md:hidden"
              aria-label="Search courses"
            >
              <ICONS.PaymentSearch className="h-5 w-5" stroke="currentColor" />
            </button>
          </div>
        </div>

        <div className="order-2 flex w-full flex-wrap gap-2 lg:order-1 lg:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors md:text-base ${
              activeTab === "all"
                ? "bg-[#303869] text-white"
                : "border border-[#D3D2D366] bg-white text-[#474348] hover:bg-gray-100"
            }`}
          >
            All Courses({tabCounts.all})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("inProgress");
              setCurrentPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors md:text-base ${
              activeTab === "inProgress"
                ? "bg-[#303869] text-white"
                : "border border-[#D3D2D366] bg-white text-[#474348] hover:bg-gray-100"
            }`}
          >
            In progress ({tabCounts.inProgress})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("completed");
              setCurrentPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors md:text-base ${
              activeTab === "completed"
                ? "bg-[#303869] text-white"
                : "border border-[#D3D2D366] bg-white text-[#474348] hover:bg-gray-100"
            }`}
          >
            Completed ({tabCounts.completed})
          </button>
        </div>

        <div className="order-3 flex w-full justify-end lg:order-3 lg:w-auto lg:shrink-0">
          <CourseSortDropdown
            value={sortBy}
            onChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
            className="w-auto min-w-0 max-w-full"
          />
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg bg-secondary/10 p-4 text-sm text-secondary">
          Unable to load courses. Please try again.
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
          Loading courses…
        </div>
      ) : hasNoEnrollments ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
          <p className="mb-4 text-sm text-gray-500">You haven&apos;t enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-lg bg-[#303869] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#252b54]"
          >
            Browse courses
          </Link>
        </div>
      ) : visibleCourses.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
          {activeTab === "all"
            ? "No courses match your search."
            : `No ${activeTab === "completed" ? "completed" : "in-progress"} courses yet.`}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course, index) => (
            <EnrolledCourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      )}

      {!hasNoEnrollments && totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-end gap-6">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Previous page"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {buildPageItems(safePage, totalPages).map((item, idx) =>
            item === "ellipsis" ? (
              <span key={`e-${idx}`} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => setCurrentPage(item)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors ${
                  safePage === item
                    ? "bg-primary text-white"
                    : "border border-[#D3D2D3] text-[#474348] hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#474348] transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Next page"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
