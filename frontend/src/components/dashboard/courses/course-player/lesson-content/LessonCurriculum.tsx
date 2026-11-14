"use client";

import type { LessonContentCommonProps } from "./types";
import { QuizLessonContent } from "@/components/courses/QuizLessonContent";
import { DefaultLessonContent } from "./DefaultLessonContent";
import { GettingStartedLessonContent } from "./GettingStartedLessonContent";
import { BasicsOfInterestPdfLessonContent } from "./BasicsOfInterestPdfLessonContent";
import { InterestLiveHaulLessonContent } from "./InterestLiveHaulLessonContent";
import { WantsVsNeedsArticleLessonContent } from "./WantsVsNeedsArticleLessonContent";
import { PdfLessonContent } from "./PdfLessonContent";
import { SlideLessonContent } from "./SlideLessonContent";
import { ComingSoonLessonContent } from "./ComingSoonLessonContent";

export function LessonCurriculum(props: LessonContentCommonProps) {
  if (props.lesson.kind === "quiz") {
    return (
      <QuizLessonContent
        key={props.lesson.id}
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

  // A week's slide deck (contentKey is the deck's PDF path).
  if (props.lesson.kind === "slides" && props.lesson.contentKey?.endsWith(".pdf")) {
    return <SlideLessonContent key={props.lesson.id} {...props} />;
  }

  // Reading lessons backed by a PDF document (contentKey is the document path).
  if (props.lesson.kind === "pdf" && props.lesson.contentKey?.endsWith(".pdf")) {
    return <PdfLessonContent key={props.lesson.id} {...props} />;
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
  if (props.lesson.contentUrl) {
    return <DefaultLessonContent {...props} />;
  }
  // No published material for this lesson yet.
  return <ComingSoonLessonContent {...props} />;
}
