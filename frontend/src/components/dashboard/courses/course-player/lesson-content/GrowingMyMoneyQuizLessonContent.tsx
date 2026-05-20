"use client";

import { useEffect, useState } from "react";
import type { LessonContentCommonProps } from "./types";
import { GROWING_MY_MONEY_QUIZ_META } from "./growing-my-money-quiz-data";
import { GrowingMyMoneyQuizQuestions } from "./GrowingMyMoneyQuizQuestions";

type QuizPhase = "intro" | "active";

export function GrowingMyMoneyQuizLessonContent({
  moduleTitle,
  lesson,
}: LessonContentCommonProps) {
  const [phase, setPhase] = useState<QuizPhase>("intro");

  useEffect(() => {
    setPhase("intro");
  }, [lesson.id]);

  return (
    <div className="pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:px-[45px] md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">{moduleTitle}</p>
        <h2 className="mt-2 text-lg font-bold text-[#111827] md:text-2xl">{lesson.title}</h2>
      </div>

      <div className="mt-6 w-full px-6 md:px-8">
        {phase === "intro" ? (
          <div className="rounded-xl border border-[#D3D2D333] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#111827] md:text-[20px]">
              Assess your understanding of basic financial Knowledge.
            </h3>
            <p className="mt-3 text-base leading-relaxed text-[#6C686C]">
              This quiz will test your knowledge on this lesson. Read the instructions below before you begin.
            </p>

            <ul className="mt-10 space-y-2 text-base text-[#111827]">
              {GROWING_MY_MONEY_QUIZ_META.map((item) => (
                <li key={item.label}>
                  <span className="font-medium">{item.label}:</span> {item.value}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-base text-[#111827]">Ensure you have a stable internet connection.</p>

            <button
              type="button"
              onClick={() => setPhase("active")}
              className="mt-8 w-full rounded-lg bg-[#303869] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#252d56] md:w-auto"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <GrowingMyMoneyQuizQuestions key={lesson.id} />
        )}
      </div>
    </div>
  );
}
