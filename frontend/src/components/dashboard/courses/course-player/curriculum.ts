import type { CourseModule, Lesson } from '@/types/course'
import { isQuizLesson } from '@/lib/quiz-utils'

export type LessonKind = "video" | "doc" | "pdf" | "screen" | "quiz" | "assessment";

export type PlayerLesson = {
  id: string;
  title: string;
  durationMin: number;
  kind: LessonKind;
  /** Maps to a lesson curriculum component in `lesson-content/`. */
  contentKey?: string;
};

export type PlayerModule = {
  id: string;
  title: string;
  lessons: PlayerLesson[];
};

function mapApiLessonKind(lesson: Lesson): LessonKind {
  if (isQuizLesson(lesson)) return 'quiz'
  if (lesson.kind === 'ASSESSMENT') return 'assessment'
  if (lesson.kind === 'PDF') return 'pdf'
  if (lesson.kind === 'DOC') return 'doc'
  if (lesson.kind === 'SCREEN') return 'screen'
  return 'video'
}

export function mapApiModulesToPlayerModules(modules: CourseModule[]): PlayerModule[] {
  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      durationMin: lesson.duration ?? 0,
      kind: mapApiLessonKind(lesson),
    })),
  }))
}

/** @deprecated Use mapApiModulesToPlayerModules with course.modules from GET /courses/:slug */
export function getCoursePlayerCurriculum(_courseId: string): PlayerModule[] {
  void _courseId;
  return [
    {
      id: "m1",
      title: "Module 1: Introduction",
      lessons: [
        { id: "m1-l1", title: "Getting Started", durationMin: 2, kind: "video", contentKey: "getting-started" },
        {
          id: "m1-l2",
          title: "How to Differentiate Between Wants an...",
          durationMin: 2,
          kind: "doc",
          contentKey: "wants-vs-needs",
        },
        {
          id: "m1-l3",
          title: "Basics of Working With Interest",
          durationMin: 3,
          kind: "pdf",
          contentKey: "basics-of-interest",
        },
        {
          id: "m1-l4",
          title: "Interest Live Haul",
          durationMin: 4,
          kind: "screen",
          contentKey: "interest-live-haul",
        },
        {
          id: "m1-l5",
          title: "Quiz 1: Growing My Money",
          durationMin: 4,
          kind: "quiz",
          contentKey: "growing-my-money-quiz",
        },
        {
          id: "m1-l6",
          title: "Assessment 1: Week One Assessment",
          durationMin: 6,
          kind: "assessment",
        },
      ],
    },
    {
      id: "m2",
      title: "Module 2",
      lessons: [
        { id: "m2-l1", title: "Lesson 1", durationMin: 5, kind: "video" },
        { id: "m2-l2", title: "Lesson 2", durationMin: 4, kind: "doc" },
        { id: "m2-l3", title: "Lesson 3", durationMin: 6, kind: "video" },
      ],
    },
    {
      id: "m3",
      title: "Module 3",
      lessons: [
        { id: "m3-l1", title: "Lesson 1", durationMin: 3, kind: "video" },
        { id: "m3-l2", title: "Lesson 2", durationMin: 3, kind: "pdf" },
      ],
    },
    {
      id: "m4",
      title: "Module 4",
      lessons: [{ id: "m4-l1", title: "Review", durationMin: 8, kind: "video" }],
    },
    {
      id: "m5",
      title: "Module 5",
      lessons: [
        { id: "m5-l1", title: "Deep dive", durationMin: 10, kind: "video" },
        { id: "m5-l2", title: "Workshop", durationMin: 12, kind: "screen" },
      ],
    },
    {
      id: "m6",
      title: "Module 6",
      lessons: [
        { id: "m6-l1", title: "Final prep", durationMin: 5, kind: "doc" },
        { id: "m6-l2", title: "Capstone", durationMin: 15, kind: "assessment" },
      ],
    },
  ];
}

export function countLessons(modules: PlayerModule[]) {
  return modules.reduce((n, m) => n + m.lessons.length, 0);
}

export function findLesson(
  modules: PlayerModule[],
  lessonId: string
): { module: PlayerModule; lesson: PlayerLesson } | undefined {
  for (const m of modules) {
    const lesson = m.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module: m, lesson };
  }
  return undefined;
}

export function findAdjacentLesson(
  modules: PlayerModule[],
  lessonId: string,
  dir: "prev" | "next"
): PlayerLesson | undefined {
  const flat = modules.flatMap((m) => m.lessons);
  const i = flat.findIndex((l) => l.id === lessonId);
  if (i < 0) return undefined;
  const j = dir === "next" ? i + 1 : i - 1;
  return flat[j];
}
