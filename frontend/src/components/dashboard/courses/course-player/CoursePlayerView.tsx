"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CourseDetail } from "@/types/course";
import {
  countLessons,
  findAdjacentLesson,
  findLesson,
  mapApiModulesToPlayerModules,
} from "./curriculum";
import { CourseFeedbackModal } from "./CourseFeedbackModal";
import CourseFeedbackSuccessModal from "./CourseFeedbackSuccessModal";
import { CoursePlayerHeader } from "./CoursePlayerHeader";
import { CoursePlayerSidebar } from "./CoursePlayerSidebar";
import { LessonCurriculum } from "./lesson-content/LessonCurriculum";
import { toPlayerCourse } from "./player-course";
import { useCourseEnrollment } from "@/hooks/useCourseEnrollment";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useLearningHeartbeat } from "@/hooks/useLearningHeartbeat";
import { resumeLessonId } from "@/lib/resume-lesson";

export default function CoursePlayerView({
  course,
  initialLessonId,
}: {
  course: CourseDetail;
  initialLessonId?: string;
}) {
  const modules = useMemo(
    () => mapApiModulesToPlayerModules(course.modules),
    [course.modules],
  );
  const firstModule = modules[0];
  const firstLesson = firstModule?.lessons[0];
  const playerCourse = useMemo(() => toPlayerCourse(course), [course]);

  const {
    completedLessonIds,
    completeLesson,
    isSavingLesson,
    markCompleteError,
    isLoading: enrollmentLoading,
    error: enrollmentError,
    enrollment,
  } = useCourseEnrollment(course.id);
  const { progress: apiProgress, mutate: mutateProgress } = useCourseProgress(course.id);
  const { mutate: mutateEnrollments, mutateStats } = useEnrollments();

  // Which lesson is open: the learner's own choice once they pick one; before that, the lesson
  // from a ?lesson= link, or where they left off (last lesson opened / next unfinished one).
  const [chosenLessonId, setChosenLessonId] = useState<string | null>(null);
  const resumeId = useMemo(
    () =>
      resumeLessonId(
        modules.flatMap((m) => m.lessons.map((l) => l.id)),
        completedLessonIds,
        enrollment?.lastLessonId,
      ),
    [modules, completedLessonIds, enrollment?.lastLessonId],
  );
  const linked = initialLessonId ? findLesson(modules, initialLessonId)?.lesson.id : undefined;
  const selectedLessonId = chosenLessonId ?? linked ?? resumeId ?? firstLesson?.id ?? "";

  // Modules start collapsed except the one holding the open lesson, until the learner toggles.
  const [expandedOverride, setExpandedOverride] = useState<Set<string> | null>(null);
  const selectedModuleId = findLesson(modules, selectedLessonId)?.module.id ?? firstModule?.id;
  const expandedModuleIds = useMemo(
    () => expandedOverride ?? new Set(selectedModuleId ? [selectedModuleId] : []),
    [expandedOverride, selectedModuleId],
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  // Track real time spent on the open lesson (powers the dashboard's time metrics).
  useLearningHeartbeat(selectedLessonId, Boolean(enrollment) && !enrollment?.isExpired);
  const [feedbackSuccessOpen, setFeedbackSuccessOpen] = useState(false);

  const totalLessons = useMemo(() => countLessons(modules), [modules]);
  const completedInCurriculum = useMemo(
    () => modules.flatMap((m) => m.lessons).filter((l) => completedLessonIds.has(l.id)).length,
    [modules, completedLessonIds],
  );
  const courseProgress = apiProgress || enrollment?.progress || 0;

  const selected = useMemo(() => findLesson(modules, selectedLessonId), [modules, selectedLessonId]);
  const prevLesson = useMemo(() => findAdjacentLesson(modules, selectedLessonId, "prev"), [modules, selectedLessonId]);
  const nextLesson = useMemo(() => findAdjacentLesson(modules, selectedLessonId, "next"), [modules, selectedLessonId]);

  const selectLesson = (id: string) => {
    setChosenLessonId(id);
    // Keep the newly opened lesson's module visible in the outline.
    const moduleId = findLesson(modules, id)?.module.id;
    if (moduleId) setExpandedOverride((prev) => (prev ? new Set(prev).add(moduleId) : null));
    setMobileOutlineOpen(false);
  };

  const toggleModule = (id: string) => {
    setExpandedOverride((prev) => {
      const n = new Set(prev ?? expandedModuleIds);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  // Save a lesson as completed and refresh the progress views. Safe to call without awaiting:
  // the outline tick updates optimistically.
  const completeAndRefresh = async (lessonId: string) => {
    if (completedLessonIds.has(lessonId)) return;
    const result = await completeLesson(lessonId);
    if (result) {
      await Promise.all([mutateEnrollments(), mutateStats(), mutateProgress()]);
    }
  };

  const markComplete = async () => {
    if (!selectedLessonId || completedLessonIds.has(selectedLessonId)) return;
    // Pin the open lesson: completing it changes the resume target, and the page must not jump.
    setChosenLessonId(selectedLessonId);
    await completeAndRefresh(selectedLessonId);
  };

  /**
   * Previous/Next from inside a lesson. Moving forward from a lesson with content counts as
   * finishing it (quizzes complete by being submitted; "coming soon" lessons can't complete).
   * Navigation happens immediately; the completion is saved in the background.
   */
  const goToLesson = (id: string) => {
    const current = selected?.lesson;
    const movingForward = id === nextLesson?.id;
    const hasContent = Boolean(current?.contentKey || current?.contentUrl);
    if (current && movingForward && current.kind !== "quiz" && hasContent) {
      void completeAndRefresh(current.id);
    }
    selectLesson(id);
  };

  const sidebarProps = {
    modules,
    expandedModuleIds,
    selectedLessonId,
    completedLessonIds,
    onToggleModule: toggleModule,
    onSelectLesson: selectLesson,
    onClose: () => {
      setSidebarOpen(false);
      setMobileOutlineOpen(false);
    },
    onOpen: () => setSidebarOpen(true),
  };

  if (enrollmentLoading) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-[#f4f6f9] p-8 text-sm text-[#6C686C]">
        Loading your progress…
      </div>
    );
  }

  if (enrollmentError || enrollment?.isExpired) {
    const expiredOn = enrollment?.expiresAt
      ? new Date(enrollment.expiresAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
      : null;
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 bg-[#f4f6f9] p-8 text-center">
        <h2 className="text-lg font-semibold text-heading">
          {enrollment?.isExpired ? "Your access to this course has ended" : "You're not enrolled in this course"}
        </h2>
        <p className="max-w-md text-sm text-[#6C686C]">
          {enrollment?.isExpired
            ? `Course access lasts 180 days${expiredOn ? ` and ended on ${expiredOn}` : ""}. Renew to pick up where you left off; your progress is kept.`
            : "Enroll in the course to start learning."}
        </p>
        <Link
          href={`/courses/${course.slug}`}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-[#232A59]"
        >
          {enrollment?.isExpired ? "Renew access" : "View course"}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f4f6f9]">
      <CoursePlayerHeader
        courseTitle={course.title}
        courseProgress={courseProgress}
        completedLessonCount={completedInCurriculum}
        totalLessonCount={totalLessons}
        onOpenCourseOutline={() => setMobileOutlineOpen(true)}
        onOpenFeedback={() => setFeedbackOpen(true)}
      />

      <CourseFeedbackModal
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        onSubmit={() => setFeedbackSuccessOpen(true)}
      />
      <CourseFeedbackSuccessModal isOpen={feedbackSuccessOpen} onClose={() => setFeedbackSuccessOpen(false)} />

      <div className="relative flex min-h-0 min-w-0 flex-1">
        {mobileOutlineOpen ? (
          <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true" aria-label="Course content">
            <button
              type="button"
              className="absolute inset-0 bg-black/45"
              aria-label="Close course outline"
              onClick={() => setMobileOutlineOpen(false)}
            />
            <div className="relative z-10 flex h-full w-full min-w-0 flex-col bg-white shadow-xl">
              <CoursePlayerSidebar {...sidebarProps} open />
            </div>
          </div>
        ) : null}

        <div className="hidden h-full min-h-0 md:flex">
          <CoursePlayerSidebar
            {...sidebarProps}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpen={() => setSidebarOpen(true)}
          />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto bg-[#FAFDFF] md:pb-[141px]">
          {markCompleteError ? (
            <div className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {markCompleteError}
            </div>
          ) : null}

          {selected ? (
            <LessonCurriculum
              course={playerCourse}
              moduleTitle={selected.module.title}
              lesson={selected.lesson}
              isCompleted={completedLessonIds.has(selectedLessonId)}
              isMarkingComplete={isSavingLesson(selectedLessonId)}
              onMarkComplete={markComplete}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onSelectLesson={goToLesson}
            />
          ) : (
            <div className="p-8 text-center text-sm text-[#6C686C]">
              {modules.length === 0 ? "This course has no lessons yet." : "Select a lesson"}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
