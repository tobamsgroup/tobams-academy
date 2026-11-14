"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import type { CourseLearningProgress } from "@/types/learning-progress";

function GradeBadge({ course }: { course: CourseLearningProgress }) {
  if (course.averageScore === null) {
    return <span className="md:text-sm text-xs font-medium text-[#6C686C]">No quizzes taken</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 md:text-sm text-xs font-medium text-gray-800">
      {course.averageScore}%
      <span className="text-gray-500">({course.grade})</span>
    </span>
  );
}

function ProgressCell({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 w-24 overflow-hidden rounded-full bg-[#EFEFF3]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <span className="md:text-sm text-xs font-medium text-[#474348]">{value}%</span>
    </div>
  );
}

function quizzesLabel(course: CourseLearningProgress) {
  return course.totalQuizzes === 0 ? "No quizzes" : `${course.quizzesTaken} of ${course.totalQuizzes}`;
}

export default function CoursesTable() {
  const { courses, isLoading, error } = useLearningProgress();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const router = useRouter();

  const detailHref = (course: CourseLearningProgress) => `/dashboard/learning-progress/${course.courseId}`;

  return (
    <section className="bg-white overflow-hidden">
      <div className="pb-5">
        <h2 className="text-base font-semibold text-heading">Courses</h2>
      </div>

      {error ? (
        <div className="rounded-lg bg-secondary/10 p-4 text-sm text-secondary">
          Unable to load your learning progress. Please try again.
        </div>
      ) : isLoading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[#EFEFF3]" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-[12px] border border-[#EFEFF3] p-8 text-center">
          <p className="text-[#474348]">You haven&apos;t enrolled in any courses yet.</p>
          <Link
            href="/dashboard/courses/explore"
            className="mt-3 inline-block font-medium text-primary hover:underline"
          >
            Explore courses
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="flex flex-col gap-4 pt-4 md:hidden">
            {courses.map((course) => (
              <div key={course.courseId} className="rounded-[16px] border border-[#EFEFF3] overflow-hidden">
                <div className="px-[11px] pt-[10px]">
                  <p className="text-sm font-medium text-heading">{course.title}</p>
                  {course.isExpired ? <p className="mt-1 text-xs font-medium text-secondary">Access expired</p> : null}
                </div>

                <div className="px-[11px] py-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#474348]">Progress</span>
                  <ProgressCell value={course.progress} />
                </div>

                <div className="px-[11px] py-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#474348]">Weeks completed</span>
                  <span className="text-xs font-medium text-[#474348]">
                    {course.modulesCompleted} of {course.totalModules}
                  </span>
                </div>

                <div className="px-[11px] py-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#474348]">Quizzes taken</span>
                  <span className="text-xs font-medium text-[#474348]">{quizzesLabel(course)}</span>
                </div>

                <div className="mx-[11px] my-1 flex items-center justify-between rounded-lg bg-[#FCFCFC] border border-[#D3D2D366] px-[6px] py-[4px]">
                  <span className="text-xs font-medium text-[#474348]">Overall Grade</span>
                  <GradeBadge course={course} />
                </div>

                <div className="px-[11px] py-[10px] mt-1">
                  <Link
                    href={detailHref(course)}
                    className="block w-full rounded-lg bg-[#CCDBEB66] py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-[#E2E5F0]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D3D2D366] bg-[#FFFAFA]">
                  <th className="px-6 py-3 text-sm font-medium text-[#474348] tracking-wider w-14">S/N</th>
                  <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider">Title</th>
                  <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider min-w-[160px]">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider min-w-[160px]">
                    Weeks completed
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider min-w-[130px]">
                    Quizzes taken
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider min-w-[130px]">
                    Overall grade
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider text-center w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr
                    key={course.courseId}
                    onClick={() => router.push(detailHref(course))}
                    onMouseEnter={() => setHoveredRow(course.courseId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`border-b border-[#D3D2D366] transition-colors duration-150 cursor-pointer ${
                      hoveredRow === course.courseId ? "bg-indigo-50/40" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-[#474348] font-medium">{index + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-[#474348]">{course.title}</span>
                      {course.isExpired ? (
                        <span className="ml-2 rounded bg-secondary/10 px-1.5 py-0.5 text-xs font-medium text-secondary">
                          Access expired
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <ProgressCell value={course.progress} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-[#474348]">
                        {course.modulesCompleted} of {course.totalModules}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-[#474348]">{quizzesLabel(course)}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-[#474348]">
                      <GradeBadge course={course} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        aria-label={`View ${course.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(detailHref(course));
                        }}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 ${
                          hoveredRow === course.courseId
                            ? "bg-indigo-100 text-indigo-600"
                            : "text-[#474348] hover:text-indigo-500"
                        }`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
