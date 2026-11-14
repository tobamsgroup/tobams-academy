"use client";

import { BookOpen, CalendarClock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCourseLearningProgress } from "@/hooks/useLearningProgress";
import type { ModuleProgressStatus, QuizProgress } from "@/types/learning-progress";

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuizStatusBadge({ quiz }: { quiz: QuizProgress }) {
  const [label, styles] =
    quiz.bestScore === null
      ? ["Not Taken", "bg-[#D3D2D366] text-[#474348]"]
      : quiz.passed
        ? ["Passed", "bg-[#DBEFDC] text-[#4CAF50]"]
        : ["Not Passed", "bg-[#FFF7CC] text-[#B39500]"];
  return <span className={`font-medium px-2 py-1 rounded-lg ${styles}`}>{label}</span>;
}

function ModuleStatusBadge({ status }: { status: ModuleProgressStatus }) {
  const map: Record<ModuleProgressStatus, string> = {
    Completed: "bg-[#DBEFDC] text-[#4CAF50]",
    "In Progress": "bg-[#FFF7CC] text-[#D5B300]",
    "Not Started": "bg-[#D3D2D366] text-[#474348]",
  };
  return <span className={`text-sm font-medium px-2 py-2 rounded-lg ${map[status]}`}>{status}</span>;
}

function QuizCard({ quiz }: { quiz: QuizProgress }) {
  return (
    <div className="rounded-[12px] border border-[#D3D2D366] bg-[#FAFDFF] p-4 space-y-3">
      <div>
        <h3 className="font-semibold text-heading">{quiz.lessonTitle}</h3>
        <p className="text-xs text-[#6C686C]">{quiz.moduleTitle}</p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-body font-medium">Best score</span>
        <span className="text-body font-medium">{quiz.bestScore === null ? "–" : `${quiz.bestScore}%`}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Status</span>
        <QuizStatusBadge quiz={quiz} />
      </div>
      <div className="rounded-lg border border-[#EFEFF3] bg-[#FCFCFC] px-2 py-1 text-center text-sm text-[#474348]">
        {quiz.attempts} of {quiz.attemptsAllowed} attempts used · pass mark {quiz.passingScore}%
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  label,
  highlight,
  source,
}: {
  icon: React.ReactNode;
  label: string;
  highlight: string;
  source: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#D3D2D366] bg-white p-4 space-y-3">
      <div className="w-9 h-9 rounded-lg bg-[#EFEFF3] flex items-center justify-center">{icon}</div>
      <p className="text-body font-medium text-sm">{label}</p>
      <p className="text-body font-semibold text-sm leading-snug">{highlight}</p>
      <div className="rounded-lg border border-[#EFEFF3] bg-[#FCFCFC] px-2 py-1 text-center text-sm text-[#474348] italic">
        {source}
      </div>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseDetailPage({ courseId }: { courseId: string }) {
  const { course, isLoading, error } = useCourseLearningProgress(courseId);

  const breadcrumb = (
    <nav className="flex items-center gap-1 px-4 py-6 md:px-6 md:py-4 text-gray-400">
      <Link
        href="/dashboard/learning-progress"
        className="hover:text-gray-600 text-[#6C686C] cursor-pointer transition-colors"
      >
        Learning Progress
      </Link>
      <ChevronRight size={14} className="text-heading" />
      <span className="text-primary font-medium">{course?.title ?? "Course"}</span>
    </nav>
  );

  if (error || (!isLoading && !course)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {breadcrumb}
        <div className="mx-4 rounded-lg bg-secondary/10 p-4 text-sm text-secondary md:mx-6">
          We couldn&apos;t find progress for this course. You may not be enrolled in it.
        </div>
      </div>
    );
  }

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        {breadcrumb}
        <div className="space-y-4 px-4 md:px-6" aria-busy="true">
          <div className="h-48 animate-pulse rounded-lg bg-[#EFEFF3]" />
          <div className="h-64 animate-pulse rounded-lg bg-[#EFEFF3]" />
        </div>
      </div>
    );
  }

  const lastActivity = formatDate(course.lastAccessedAt);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {breadcrumb}

      {/* Top grid: Quizzes + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#D3D2D366]">
            <h2 className="font-semibold text-heading">Quizzes &amp; Grades</h2>
            {course.averageScore !== null ? (
              <span className="text-sm font-medium text-heading">
                Overall: {course.averageScore}% ({course.grade})
              </span>
            ) : null}
          </div>
          <div className="p-6 space-y-3 max-h-[420px] overflow-y-auto">
            {course.quizzes.length === 0 ? (
              <p className="text-sm text-[#474348]">This course has no quizzes.</p>
            ) : (
              course.quizzes.map((quiz) => <QuizCard key={quiz.quizId} quiz={quiz} />)
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D3D2D366]">
            <h2 className="font-semibold text-heading">Progress Insight</h2>
          </div>
          <div className="py-6 px-4 space-y-3">
            <InsightCard
              icon={<BookOpen size={20} strokeWidth={1.5} className="text-gray-500" />}
              label="Lessons completed"
              highlight={`${course.lessonsCompleted} of ${course.totalLessons} lessons · ${course.progress}% of the course`}
              source={course.completedAt ? `Course completed on ${formatDate(course.completedAt)}` : "Keep going!"}
            />
            <InsightCard
              icon={<CalendarClock size={20} strokeWidth={1.5} className="text-gray-500" />}
              label="Last activity"
              highlight={lastActivity ? `You last studied this course on ${lastActivity}` : "You haven't started this course yet"}
              source={`Enrolled on ${formatDate(course.enrolledAt)}`}
            />
          </div>
        </div>
      </div>

      {/* Week Completion Tracker */}
      <div className="bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-heading">Week Completion Tracker</h2>
          <Link
            href={`/dashboard/courses/${course.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {course.progress > 0 ? "Continue learning" : "Start learning"}
          </Link>
        </div>

        <div className="px-4 pt-5 md:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#474348]">
              {course.modulesCompleted} of {course.totalModules} weeks completed
            </p>
            <span className="text-sm font-semibold text-heading">{course.progress}% Done</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full overflow-hidden bg-gray-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${course.progress}%`,
                background: "linear-gradient(to right, #ef4444, #eab308, #22c55e)",
              }}
            />
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="md:hidden px-4 py-5 space-y-3">
          {course.modules.map((mod, i) => (
            <div key={mod.id} className="rounded-xl border border-[#D3D2D366] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#6C686C]">Week {i + 1}</span>
                  <span className="text-sm font-semibold text-heading">{mod.title}</span>
                  <span className="text-xs text-[#6C686C]">
                    {mod.lessonsCompleted} of {mod.totalLessons} lessons
                  </span>
                </div>
                <ModuleStatusBadge status={mod.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto px-6 py-6">
          <table className="w-full text-left border border-[#D3D2D366] rounded-lg">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFDFF]">
                <th className="px-6 py-3 text-sm font-medium text-[#6C686C] uppercase tracking-wider w-16">S/N</th>
                <th className="px-4 py-3 text-sm font-medium text-[#6C686C] uppercase tracking-wider">Week</th>
                <th className="px-4 py-3 text-sm font-medium text-[#6C686C] uppercase tracking-wider">Lessons</th>
                <th className="px-4 py-3 text-sm font-medium text-[#6C686C] uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {course.modules.map((mod, i) => (
                <tr key={mod.id} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-[#6C686C] font-medium">{i + 1}</td>
                  <td className="px-4 py-4 text-sm font-medium text-[#6C686C]">{mod.title}</td>
                  <td className="px-4 py-4 text-sm text-[#6C686C]">
                    {mod.lessonsCompleted} of {mod.totalLessons}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <ModuleStatusBadge status={mod.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
