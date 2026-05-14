import { notFound } from "next/navigation";
import EnrolledCourseDetailView from "@/components/dashboard/courses/EnrolledCourseDetailView";
import { getEnrolledCourseById } from "@/components/dashboard/courses/courses-data";

export default async function DashboardCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getEnrolledCourseById(id);
  if (!course) notFound();

  return (
    <div className="bg-[#FAFDFF] px-4 py-5 md:p-8">
      <EnrolledCourseDetailView course={course} />
    </div>
  );
}
