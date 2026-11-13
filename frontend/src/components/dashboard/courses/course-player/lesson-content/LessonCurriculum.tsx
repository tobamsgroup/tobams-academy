"use client";

import type { LessonContentCommonProps } from "./types";
import { QuizLessonContent } from "@/components/courses/QuizLessonContent";
import { DefaultLessonContent } from "./DefaultLessonContent";
import { GettingStartedLessonContent } from "./GettingStartedLessonContent";
import { BasicsOfInterestPdfLessonContent } from "./BasicsOfInterestPdfLessonContent";
import { InterestLiveHaulLessonContent } from "./InterestLiveHaulLessonContent";
import { WantsVsNeedsArticleLessonContent } from "./WantsVsNeedsArticleLessonContent";

export function LessonCurriculum(props: LessonContentCommonProps) {
  if (props.lesson.kind === "quiz") {
    return (
      <QuizLessonContent
        lessonId={props.lesson.id}
        lessonTitle={props.lesson.title}
        moduleTitle={props.moduleTitle}
        isCompleted={props.isCompleted}
        isMarkingComplete={props.isMarkingComplete}
        onMarkComplete={props.onMarkComplete}
        prevLessonId={props.prevLesson?.id}
        nextLessonId={props.nextLesson?.id}
        onSelectLesson={props.onSelectLesson}
      />
    );
  }

  const key = props.lesson.contentKey ?? "default";
  if (key === "getting-started") {
    return <GettingStartedLessonContent {...props} />;
  }
  if (key === "wants-vs-needs") {
    return <WantsVsNeedsArticleLessonContent {...props} />;
  }
  if (key === "basics-of-interest") {
    return <BasicsOfInterestPdfLessonContent {...props} />;
  }
  if (key === "interest-live-haul") {
    return <InterestLiveHaulLessonContent {...props} />;
  }
  return <DefaultLessonContent {...props} />;
}
