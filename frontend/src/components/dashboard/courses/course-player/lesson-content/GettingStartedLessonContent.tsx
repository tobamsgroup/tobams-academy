"use client";

import type { LessonContentCommonProps } from "./types";
import { DefaultLessonContent } from "./DefaultLessonContent";

/** Curriculum for the “Getting Started” lesson — swap body copy or layout as needed. */
export function GettingStartedLessonContent(props: LessonContentCommonProps) {
  return (
    <DefaultLessonContent
      {...props}
      transcriptBody="Welcome to this course. In Getting Started, you’ll learn how to follow along with videos, track your progress, and use downloads when they’re available."
    />
  );
}
