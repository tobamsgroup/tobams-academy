"use client";

import Image from "next/image";
import Link from "next/link";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import {
  formatCourseLevel,
  formatLastAccessed,
  getCourseThumbnail,
  type DashboardCourse,
} from "@/lib/dashboard-courses";

type EnrolledCourseCardProps = {
  course: DashboardCourse;
  index: number;
};

export function EnrolledCourseCard({ course, index }: EnrolledCourseCardProps) {
  const { progress: apiProgress, isLoading: progressLoading } = useCourseProgress(course.id)
  const progress = progressLoading ? course.progress : apiProgress

  return (
    <article className="group overflow-hidden rounded-xl hover:shadow-md">
      <Link href={`/dashboard/courses/${course.slug}`} className="block">
        <div className="relative h-[200px] w-full bg-gray-200">
          <Image
            src={getCourseThumbnail(course, index)}
            alt={course.title}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="bg-white p-5">
          <h3 className="mb-1 text-lg font-semibold text-heading group-hover:text-slate-800">
            {course.title}
          </h3>
          <p className="mb-4 text-sm text-[#6C686C]">
            {course.category.name} · {formatCourseLevel(course.level)}
          </p>

          <div className="mb-3 bg-white">
            <div className="mb-2 flex items-center justify-between">
              <div className="mr-3 h-2 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-[#303869] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Last accessed: {formatLastAccessed(course.lastAccessed)}
          </p>
        </div>
      </Link>

      <div className="border-t border-[#F0F0F0] px-5 pb-5 pt-3">
        <Link
          href={`/dashboard/courses/${course.slug}`}
          className="flex w-full items-center justify-center rounded-lg bg-[#EEF0F6] py-3 text-center text-sm font-medium text-[#303869] transition-colors hover:bg-gray-200"
        >
          {course.completedAt != null ? "Review Course" : "Continue Learning"}
        </Link>
      </div>
    </article>
  );
}
