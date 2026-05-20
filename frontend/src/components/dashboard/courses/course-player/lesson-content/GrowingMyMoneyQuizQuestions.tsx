"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GROWING_MY_MONEY_QUESTIONS_PER_PAGE,
  GROWING_MY_MONEY_QUIZ_QUESTIONS,
} from "./growing-my-money-quiz-data";

export function GrowingMyMoneyQuizQuestions() {
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalPages = Math.ceil(GROWING_MY_MONEY_QUIZ_QUESTIONS.length / GROWING_MY_MONEY_QUESTIONS_PER_PAGE);

  const pageQuestions = useMemo(() => {
    const start = pageIndex * GROWING_MY_MONEY_QUESTIONS_PER_PAGE;
    return GROWING_MY_MONEY_QUIZ_QUESTIONS.slice(start, start + GROWING_MY_MONEY_QUESTIONS_PER_PAGE);
  }, [pageIndex]);

  const selectAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm md:p-10">
      <div className="space-y-10">
        {pageQuestions.map((question, idx) => {
          const number = pageIndex * GROWING_MY_MONEY_QUESTIONS_PER_PAGE + idx + 1;
          return (
            <div key={question.id}>
              <p className="text-base font-medium text-[#111827]">
                {number}. {question.text}
              </p>
              <ul className="mt-4 space-y-3">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option;
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => selectAnswer(question.id, option)}
                        className="flex w-full items-start gap-3 text-left text-base text-[#474348]"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                            selected ? "border-[#303869]" : "border-[#D1D5DB]",
                          )}
                          aria-hidden
                        >
                          {selected ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#303869]" />
                          ) : null}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-[#EEF0F6] pt-6">
        <button
          type="button"
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          disabled={pageIndex <= 0}
          className={cn(
            "inline-flex items-center gap-1 text-sm font-medium hover:underline disabled:cursor-default disabled:no-underline",
            pageIndex <= 0 ? "text-[#9CA3AF]" : "text-[#303869]",
          )}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Previous
        </button>
        <button
          type="button"
          onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
          disabled={pageIndex >= totalPages - 1}
          className={cn(
            "inline-flex items-center gap-1 text-sm font-semibold hover:underline disabled:cursor-default disabled:font-medium disabled:no-underline",
            pageIndex >= totalPages - 1 ? "text-[#9CA3AF]" : "text-[#303869]",
          )}
        >
          Next
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
