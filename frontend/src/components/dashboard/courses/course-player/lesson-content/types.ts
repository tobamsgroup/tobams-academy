import type { PlayerCourse } from "./player-course";
import type { PlayerLesson } from "../curriculum";

export type LessonContentCommonProps = {
  course: PlayerCourse;
  moduleTitle: string;
  lesson: PlayerLesson;
  isCompleted: boolean;
  isMarkingComplete?: boolean;
  onMarkComplete: () => void | Promise<void>;
  prevLesson: PlayerLesson | undefined;
  nextLesson: PlayerLesson | undefined;
  onSelectLesson: (id: string) => void;
};

export type DefaultLessonContentProps = LessonContentCommonProps & {
  /** When set, shows a Transcript block under the video actions. */
  transcriptBody?: string | null;
};
