import type { EnrolledCourse } from "../../courses-data";
import type { PlayerLesson } from "../curriculum";

export type LessonContentCommonProps = {
  course: EnrolledCourse;
  moduleTitle: string;
  lesson: PlayerLesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
  prevLesson: PlayerLesson | undefined;
  nextLesson: PlayerLesson | undefined;
  onSelectLesson: (id: string) => void;
};

export type DefaultLessonContentProps = LessonContentCommonProps & {
  /** When set, shows a Transcript block under the video actions. */
  transcriptBody?: string | null;
};
