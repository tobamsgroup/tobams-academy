import CourseDetailPage from "@/components/dashboard/learning-progress/CourseDetailPage";

export default async function LearningProgressDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // id is the enrolled course's id; the page loads its own progress data.
  return <CourseDetailPage courseId={id} />;
}
