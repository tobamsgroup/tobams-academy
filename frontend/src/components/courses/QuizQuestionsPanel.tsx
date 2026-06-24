"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/quiz";

const QUESTIONS_PER_PAGE = 2;

type QuizQuestionsPanelProps = {
  questions: QuizQuestion[];
  answers: Record<string, string>;
  onSelectAnswer: (questionId: string, optionId: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
};

export function QuizQuestionsPanel({
  questions,
  answers,
  onSelectAnswer,
  onSubmit,
  isSubmitting,
  disabled = false,
}: QuizQuestionsPanelProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const isLastPage = pageIndex >= totalPages - 1;

  const pageQuestions = useMemo(() => {
    const start = pageIndex * QUESTIONS_PER_PAGE;
    return questions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [pageIndex, questions]);

  const allAnswered = questions.every((question) => answers[question.id]);

  return (
    <div className="rounded-xl border border-[#D3D2D333] bg-white p-6 md:p-8">
      <div className="space-y-10">
        {pageQuestions.map((question, idx) => {
          const number = pageIndex * QUESTIONS_PER_PAGE + idx + 1;
          return (
            <div key={question.id}>
              <p className="text-base font-medium text-[#111827]">
                {number}. {question.text}
              </p>
              <ul className="mt-4 space-y-3">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.id;
                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={disabled || isSubmitting}
                        onClick={() => onSelectAnswer(question.id, option.id)}
                        className="flex w-full items-start gap-3 text-left text-base text-[#474348] disabled:cursor-default disabled:opacity-60"
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
                        <span className="leading-snug">{option.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-[#EEF0F6] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <button
            type="button"
            onClick={() => setPageIndex((page) => Math.max(0, page - 1))}
            disabled={pageIndex <= 0 || isSubmitting}
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium hover:underline disabled:cursor-default disabled:no-underline",
              pageIndex <= 0 ? "text-[#9CA3AF]" : "text-[#303869]",
            )}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            Previous
          </button>
          {!isLastPage ? (
            <button
              type="button"
              onClick={() => setPageIndex((page) => Math.min(totalPages - 1, page + 1))}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#303869] hover:underline disabled:cursor-default disabled:text-[#9CA3AF] disabled:no-underline"
            >
              Next
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : null}
        </div>

        {isLastPage ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!allAnswered || isSubmitting || disabled}
            className="rounded-lg bg-[#303869] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#252d56] disabled:cursor-default disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : "Submit Quiz"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
