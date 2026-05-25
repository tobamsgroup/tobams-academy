import { notFound } from "next/navigation";
import CoursePlayerView from "@/components/dashboard/courses/course-player/CoursePlayerView";
import { getEnrolledCourseById } from "@/components/dashboard/courses/courses-data";

export default async function DashboardCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getEnrolledCourseById(id);
  if (!course) notFound();

  return <CoursePlayerView course={course} />;
}
