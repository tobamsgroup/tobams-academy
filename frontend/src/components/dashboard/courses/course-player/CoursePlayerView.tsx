"use client";

import { useMemo, useState } from "react";
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

export default function CoursePlayerView({ course }: { course: CourseDetail }) {
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
    isMarkingComplete,
    markCompleteError,
    isLoading: enrollmentLoading,
    error: enrollmentError,
    enrollment,
  } = useCourseEnrollment(course.id);
  const { progress: apiProgress, mutate: mutateProgress } = useCourseProgress(course.id);
  const { mutate: mutateEnrollments, mutateStats } = useEnrollments();

  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(
    () => new Set(firstModule ? [firstModule.id] : []),
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(firstLesson?.id ?? "");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
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
    setSelectedLessonId(id);
    setMobileOutlineOpen(false);
  };

  const toggleModule = (id: string) => {
    setExpandedModuleIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const markComplete = async () => {
    if (!selectedLessonId || completedLessonIds.has(selectedLessonId)) return;

    const result = await completeLesson(selectedLessonId);
    if (result) {
      await Promise.all([mutateEnrollments(), mutateStats(), mutateProgress()]);
    }
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

  if (enrollmentError) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 bg-[#f4f6f9] p-8 text-center">
        <p className="text-sm text-[#6C686C]">Unable to load enrollment for this course.</p>
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
              isMarkingComplete={isMarkingComplete}
              onMarkComplete={markComplete}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onSelectLesson={selectLesson}
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
