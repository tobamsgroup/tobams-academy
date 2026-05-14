import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { EnrolledCourse } from "./courses-data";

export default function EnrolledCourseDetailView({ course }: { course: EnrolledCourse }) {
  const isComplete = course.progress >= 100;

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-6 hidden items-center gap-2 text-sm text-[#6C686C] md:flex" aria-label="Breadcrumb">
        <Link href="/dashboard/courses" className="text-[#303869] hover:underline">
          Courses
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0 text-heading" />
        <span className="font-medium text-[#221D23] line-clamp-1">{course.title}</span>
      </nav>

      <div className="overflow-hidden rounded-xl border border-[#D3D2D366] bg-white shadow-sm">
        <div className="relative aspect-[21/9] w-full min-h-[180px] bg-gray-200 md:aspect-[2.4/1]">
          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" priority />
        </div>

        <div className="p-5 md:p-8">
          <h1 className="text-xl font-semibold text-[#221D23] md:text-2xl">{course.title}</h1>
          <p className="mt-2 text-sm text-[#6C686C]">Last accessed: {course.lastAccessed}</p>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-[#221D23]">Your progress</span>
              <span className="text-[#303869]">{course.progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all ${isComplete ? "bg-[#099137]" : "bg-[#303869]"}`}
                style={{ width: `${Math.min(100, course.progress)}%` }}
              />
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-[#D3D2D366] bg-[#FAFDFF] p-5">
            <h2 className="text-base font-medium text-[#221D23]">Continue where you left off</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6C686C]">
              Pick up from your last lesson. When your LMS is connected, modules and lessons will appear here.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/courses"
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#D3D2D366] py-3 text-center text-sm font-medium text-[#221D23] transition-colors hover:bg-gray-50"
            >
              Back to courses
            </Link>
            <Link
              href="/dashboard/courses/learning"
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#303869] py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              {isComplete ? "Review course" : "Resume learning"}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 md:hidden">
        <Link href="/dashboard/courses" className="text-sm font-medium text-[#303869] hover:underline">
          ← Back to courses
        </Link>
      </div>
    </div>
  );
}
