import CourseDetailPage from "@/components/dashboard/learning-progress/CourseDetailPage";
import { courses } from "@/components/dashboard/learning-progress/courses-data";

export default async function LearningProgressDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = courses.find((c) => String(c.id) === id);
  const courseTitle = course?.title ?? "Course";

  return <CourseDetailPage courseTitle={courseTitle} />;
}
