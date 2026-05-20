"use client";

import type { LessonContentCommonProps } from "./types";
import { DefaultLessonContent } from "./DefaultLessonContent";
import { GettingStartedLessonContent } from "./GettingStartedLessonContent";
import { BasicsOfInterestPdfLessonContent } from "./BasicsOfInterestPdfLessonContent";
import { GrowingMyMoneyQuizLessonContent } from "./GrowingMyMoneyQuizLessonContent";
import { InterestLiveHaulLessonContent } from "./InterestLiveHaulLessonContent";
import { WantsVsNeedsArticleLessonContent } from "./WantsVsNeedsArticleLessonContent";

export function LessonCurriculum(props: LessonContentCommonProps) {
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
  if (key === "growing-my-money-quiz") {
    return <GrowingMyMoneyQuizLessonContent {...props} />;
  }
  return <DefaultLessonContent {...props} />;
}
