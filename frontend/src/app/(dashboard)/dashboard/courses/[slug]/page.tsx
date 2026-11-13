import CoursePlayerPage from "@/components/dashboard/courses/course-player/CoursePlayerPage";

export default async function DashboardCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string | string[] }>;
}) {
  const { slug } = await params;
  const { lesson } = await searchParams;
  // ?lesson=<id> opens the player on that lesson (used by "Resume" links).
  return <CoursePlayerPage slug={slug} initialLessonId={typeof lesson === "string" ? lesson : undefined} />;
}
