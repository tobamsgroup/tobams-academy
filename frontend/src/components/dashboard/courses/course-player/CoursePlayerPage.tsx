"use client";

import CoursePlayerView from "@/components/dashboard/courses/course-player/CoursePlayerView";
import { useCourse } from "@/hooks/useCourse";
import Link from "next/link";

export default function CoursePlayerPage({ slug }: { slug: string }) {
  const { course, error, isLoading } = useCourse(slug);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-[#f4f6f9] p-8 text-sm text-[#6C686C]">
        Loading course…
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 bg-[#f4f6f9] p-8 text-center">
        <p className="text-sm text-[#6C686C]">Course not found or unavailable.</p>
        <Link
          href="/dashboard/courses"
          className="rounded-lg bg-[#303869] px-4 py-2 text-sm font-medium text-white hover:bg-[#252d58]"
        >
          Back to My Courses
        </Link>
      </div>
    );
  }

  return <CoursePlayerView key={course.id} course={course} />;
}
