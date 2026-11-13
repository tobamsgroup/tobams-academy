"use client";

import { useDeferredValue, useState } from "react";
import { ICONS } from "@/assets/icons";
import { CourseCard } from "@/components/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { useEnrollments } from "@/hooks/useEnrollments";

const PAGE_SIZE = 12;

export default function ExploreCoursesDashboard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search.trim());

  const { courses, meta, error, isLoading } = useCourses({
    search: deferredSearch || undefined,
    page,
    limit: PAGE_SIZE,
    sort: "recent",
  });
  const { isEnrolledIn, isLoading: enrollmentsLoading } = useEnrollments();

  const totalPages = meta?.totalPages ?? 1;
  const loading = isLoading || enrollmentsLoading;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-[#474348]">
          Browse every course available on Tobams Academy. Courses you&apos;ve already purchased are greyed out.
        </p>
        <div className="flex min-h-12 w-full items-center overflow-hidden rounded-lg border border-[#D3D2D366] bg-white focus-within:ring-2 focus-within:ring-blue-500 lg:max-w-[420px]">
          <div className="pointer-events-none flex items-center pl-3">
            <ICONS.PaymentSearch />
          </div>
          <input
            type="search"
            placeholder="Search courses"
            aria-label="Search courses"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-12 w-full min-w-0 border-0 bg-transparent px-3 text-[#221D23] outline-none placeholder:text-[#6C686C]"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg bg-secondary/10 p-4 text-sm text-secondary">
          Unable to load courses. Please try again.
        </div>
      ) : loading && courses.length === 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[380px] animate-pulse rounded-2xl bg-[#EEF0F6]" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-[12px] border border-[#D3D2D333] bg-white p-10 text-center text-[#474348]">
          {deferredSearch ? `No courses match "${deferredSearch}".` : "No courses are available yet."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                enrolled={isEnrolledIn(course.id)}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-heading">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-[#D3D2D3] px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-[#D3D2D3] px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
