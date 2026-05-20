"use client";

import { useMemo, useState } from "react";
import type { EnrolledCourse } from "../courses-data";
import { countLessons, findAdjacentLesson, findLesson, getCoursePlayerCurriculum } from "./curriculum";
import { CourseFeedbackModal } from "./CourseFeedbackModal";
import CourseFeedbackSuccessModal from "./CourseFeedbackSuccessModal";
import { CoursePlayerHeader } from "./CoursePlayerHeader";
import { CoursePlayerSidebar } from "./CoursePlayerSidebar";
import { LessonCurriculum } from "./lesson-content/LessonCurriculum";

export default function CoursePlayerView({ course }: { course: EnrolledCourse }) {
  const modules = useMemo(() => getCoursePlayerCurriculum(course.id), [course.id]);
  const firstLesson = modules[0]?.lessons[0];
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(() => new Set(["m1"]));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(firstLesson?.id ?? "");
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => new Set());
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSuccessOpen, setFeedbackSuccessOpen] = useState(false);

  const totalLessons = useMemo(() => countLessons(modules), [modules]);
  const completedInCurriculum = useMemo(
    () => modules.flatMap((m) => m.lessons).filter((l) => completedLessonIds.has(l.id)).length,
    [modules, completedLessonIds],
  );

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

  const markComplete = () => {
    if (!selectedLessonId) return;
    setCompletedLessonIds((prev) => {
      const n = new Set(prev);
      n.add(selectedLessonId);
      return n;
    });
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

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f4f6f9]">
      <CoursePlayerHeader
        courseTitle={course.title}
        courseProgress={course.progress}
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
          {selected ? (
            <LessonCurriculum
              course={course}
              moduleTitle={selected.module.title}
              lesson={selected.lesson}
              isCompleted={completedLessonIds.has(selectedLessonId)}
              onMarkComplete={markComplete}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onSelectLesson={selectLesson}
            />
          ) : (
            <div className="p-8 text-center text-sm text-[#6C686C]">Select a lesson</div>
          )}
        </main>
      </div>
    </div>
  );
}
