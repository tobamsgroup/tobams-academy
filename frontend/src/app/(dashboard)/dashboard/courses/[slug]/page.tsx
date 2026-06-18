import CoursePlayerPage from "@/components/dashboard/courses/course-player/CoursePlayerPage";

export default async function DashboardCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CoursePlayerPage slug={slug} />;
}
