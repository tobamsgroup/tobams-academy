import type { PlayerCourse } from "../player-course";
import type { PlayerLesson } from "../curriculum";
import type { LessonCompleteResult } from "@/types/enrollment";

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
  /** The server completed this lesson by other means (an assignment upload): refresh progress. */
  onCompletedExternally?: (result: LessonCompleteResult) => void | Promise<void>;
};

export type DefaultLessonContentProps = LessonContentCommonProps & {
  /** When set, shows a Transcript block under the video actions. */
  transcriptBody?: string | null;
};
