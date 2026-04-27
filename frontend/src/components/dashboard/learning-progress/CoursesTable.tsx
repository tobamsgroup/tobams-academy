"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { courses } from "./courses-data";

function GradeBadge({ grade, label }: { grade: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 md:text-sm text-xs font-medium text-gray-800">
      {grade}
      <span className="text-gray-500">({label})</span>
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <span className="md:text-sm text-xs font-medium text-[#474348]">
      {value} of {max}
    </span>
  );
}

export default function CoursesTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const router = useRouter();

  return (
    <section className="bg-white overflow-hidden">
      {/* Header */}
      <div className="pb-5">
        <h2 className="text-base font-semibold text-heading">Courses</h2>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-4 pt-4 md:hidden">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-[16px] border border-[#EFEFF3] overflow-hidden"
          >
            <div className="px-[11px] pt-[10px]">
              <p className="text-sm font-medium text-heading">{course.title}</p>
            </div>

            <div className="px-[11px] py-2 flex items-center justify-between">
              <span className="text-xs font-medium text-[#474348]">Modules completed</span>
              <span className="text-xs font-medium text-[#474348]">
                {course.modulesCompleted} of {course.totalModules}
              </span>
            </div>

            <div className="px-[11px] py-1 flex items-center justify-between">
              <span className="text-xs font-medium text-[#474348]">Assignment submitted</span>
              <span className="text-xs font-medium text-[#474348]">
                {course.assignmentsSubmitted} of {course.totalAssignments}
              </span>
            </div>

            <div className="mx-[11px] my-1 flex items-center justify-between rounded-lg bg-[#FCFCFC] border border-[#D3D2D366] px-[6px] py-[4px]">
              <span className="text-xs font-medium text-[#474348]">Overall Grade</span>
              <GradeBadge grade={course.overallGrade} label={course.gradeLabel} />
            </div>

            <div className="px-[11px] py-[10px] mt-1">
              <Link
                href={`/dashboard/learning-progress/${course.id}`}
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
              <th className="px-6 py-3 text-sm font-medium text-[#474348] tracking-wider w-14">
                S/N
              </th>
              <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider min-w-[180px]">
                Modules completed
              </th>
              <th className="px-4 py-3 text-sm font-medium text-[#474348] tracking-wider min-w-[180px]">
                Assignment submitted
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
            {courses.map((course) => (
              <tr
                key={course.id}
                onClick={() => router.push(`/dashboard/learning-progress/${course.id}`)}
                onMouseEnter={() => setHoveredRow(course.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-[#D3D2D366] transition-colors duration-150 cursor-pointer ${
                  hoveredRow === course.id ? "bg-indigo-50/40" : "bg-white"
                }`}
              >
                <td className="px-6 py-4 text-sm text-[#474348] font-medium">{course.id}</td>

                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-[#474348]">{course.title}</span>
                </td>

                <td className="px-4 py-4">
                  <ProgressBar value={course.modulesCompleted} max={course.totalModules} />
                </td>

                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-[#474348]">
                    {course.assignmentsSubmitted} of {course.totalAssignments}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm font-medium text-[#474348]">
                  <GradeBadge grade={course.overallGrade} label={course.gradeLabel} />
                </td>

                <td className="px-4 py-4 text-center">
                  <button
                    aria-label={`View ${course.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/learning-progress/${course.id}`);
                    }}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 ${
                      hoveredRow === course.id
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-[#474348] hover:text-indigo-500"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
