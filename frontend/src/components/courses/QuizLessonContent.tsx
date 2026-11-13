"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuiz } from "@/hooks/useQuiz";
import { formatQuizTimeLimit } from "@/lib/quiz-utils";
import { QuizQuestionsPanel } from "./QuizQuestionsPanel";

type QuizPhase = "intro" | "active" | "result";

export type QuizLessonContentProps = {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  isCompleted?: boolean;
  isMarkingComplete?: boolean;
  onMarkComplete?: () => void | Promise<void>;
  prevLessonId?: string;
  nextLessonId?: string;
  onSelectLesson?: (id: string) => void;
};

export function QuizLessonContent({
  lessonId,
  lessonTitle,
  moduleTitle,
  isCompleted = false,
  isMarkingComplete = false,
  onMarkComplete,
  prevLessonId,
  nextLessonId,
  onSelectLesson,
}: QuizLessonContentProps) {
  const { quiz, error, isLoading, submitAttempt } = useQuiz(lessonId);
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; isPassed: boolean } | null>(null);

  useEffect(() => {
    setPhase("intro");
    setAnswers({});
    setSubmitError(null);
    setResult(null);
  }, [lessonId]);

  const metaItems = useMemo(() => {
    if (!quiz) return [];
    return [
      { label: "Total Questions", value: String(quiz.totalQuestions) },
      { label: "Time Limit", value: formatQuizTimeLimit(quiz.timeLimit) },
      { label: "Question Type", value: quiz.questionType },
      { label: "Passing Score", value: `${quiz.passingScore}%` },
      { label: "Attempts Allowed", value: String(quiz.attemptsAllowed) },
    ];
  }, [quiz]);

  const handleSubmit = async () => {
    if (!quiz) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const attempt = await submitAttempt(answers);
      setResult({ score: attempt.score, isPassed: attempt.isPassed });
      setPhase("result");
      if (attempt.isPassed && onMarkComplete && !isCompleted) {
        await onMarkComplete();
      }
    } catch {
      setSubmitError("Unable to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-10">
      <div className="border-b border-[#D3D2D366] px-6 py-4 md:px-[45px] md:py-[16px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6C686C]">{moduleTitle}</p>
        <h2 className="mt-2 text-lg font-bold text-[#111827] md:text-2xl">{lessonTitle}</h2>
      </div>

      <div className="mt-6 w-full px-6 md:px-8">
        {isLoading ? (
          <div className="rounded-xl border border-[#D3D2D333] bg-white p-8 text-center text-sm text-[#6C686C]">
            Loading quiz…
          </div>
        ) : error || !quiz ? (
          <div className="rounded-xl border border-[#D3D2D333] bg-white p-8 text-center text-sm text-[#6C686C]">
            Quiz unavailable for this lesson.
          </div>
        ) : phase === "intro" ? (
          <div className="rounded-xl border border-[#D3D2D333] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#111827] md:text-[20px]">
              Assess your understanding of this lesson.
            </h3>
            <p className="mt-3 text-base leading-relaxed text-[#6C686C]">
              This quiz will test your knowledge. Read the instructions below before you begin.
            </p>

            <ul className="mt-10 space-y-2 text-base text-[#111827]">
              {metaItems.map((item) => (
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
        ) : phase === "active" ? (
          <>
            {submitError ? (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
            ) : null}
            <QuizQuestionsPanel
              questions={quiz.questions}
              answers={answers}
              onSelectAnswer={(questionId, optionId) =>
                setAnswers((current) => ({ ...current, [questionId]: optionId }))
              }
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </>
        ) : (
          <div className="rounded-xl border border-[#D3D2D333] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#111827]">
              {result?.isPassed ? "Quiz passed" : "Quiz completed"}
            </h3>
            <p className="mt-3 text-base text-[#474348]">
              Your score: <span className="font-semibold text-[#111827]">{result?.score ?? 0}%</span>
              {quiz ? ` (passing score: ${quiz.passingScore}%)` : null}
            </p>
            {!result?.isPassed && onMarkComplete ? (
              <button
                type="button"
                onClick={onMarkComplete}
                disabled={isCompleted || isMarkingComplete}
                className="mt-8 rounded-lg bg-[#303869] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#252d56] disabled:cursor-default disabled:opacity-60"
              >
                {isCompleted ? "Completed" : isMarkingComplete ? "Saving…" : "Mark As Completed"}
              </button>
            ) : null}
          </div>
        )}
      </div>

      {onSelectLesson ? (
        <div className="mx-auto mt-10 flex max-w-[975px] items-center justify-between border-t border-[#EEF0F6] px-6 pt-6">
          {prevLessonId ? (
            <button
              type="button"
              onClick={() => onSelectLesson(prevLessonId)}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#303869] hover:underline"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              Previous
            </button>
          ) : (
            <span />
          )}
          {nextLessonId ? (
            <button
              type="button"
              onClick={() => onSelectLesson(nextLessonId)}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#303869] hover:underline"
            >
              Next
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            <span />
          )}
        </div>
      ) : null}
    </div>
  );
}
