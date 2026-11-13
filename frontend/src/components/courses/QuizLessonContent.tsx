"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Timer } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuiz } from "@/hooks/useQuiz";
import { formatCountdown, useQuizSession } from "@/hooks/useQuizSession";
import { cn } from "@/lib/utils";
import { formatQuizTimeLimit } from "@/lib/quiz-utils";
import { QuizQuestionsPanel } from "./QuizQuestionsPanel";

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
  const { data: authSession } = useSession();
  // The attempt in progress (start time + answers) survives reloads and tab switches.
  const attempt = useQuizSession(authSession?.user?.id, quiz?.id, quiz?.timeLimit ?? 0);
  const answers = attempt.answers;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; isPassed: boolean; timedOut: boolean } | null>(null);
  // Rendered with key={lessonId}, so this state starts fresh for every quiz lesson.
  const autoSubmitted = useRef(false);

  const phase = result ? "result" : attempt.isActive ? "active" : "intro";

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

  const handleSubmit = async (timedOut = false) => {
    if (!quiz) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const graded = await submitAttempt(answers);
      attempt.clear();
      setResult({ score: graded.score, isPassed: graded.isPassed, timedOut });
      if (graded.isPassed && onMarkComplete && !isCompleted) {
        await onMarkComplete();
      }
    } catch (e) {
      const status = axios.isAxiosError(e) ? e.response?.status : undefined;
      if (status === 429) {
        // No attempts left: this attempt can't be recorded, so drop it.
        attempt.clear();
        setSubmitError(`You have used all ${quiz.attemptsAllowed} attempts for this quiz.`);
      } else {
        setSubmitError("Unable to submit quiz. Check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Time's up (even if it ran out while the learner was away): submit what they have.
  useEffect(() => {
    if (phase === "active" && attempt.isExpired && !isSubmitting && !autoSubmitted.current) {
      autoSubmitted.current = true;
      void handleSubmit(true);
    }
    // handleSubmit is recreated each render; the guard ref keeps this to one auto-submit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, attempt.isExpired, isSubmitting]);

  const answeredCount = quiz ? quiz.questions.filter((q) => answers[q.id]).length : 0;
  const lowTime = attempt.remainingMs !== null && attempt.remainingMs <= 60_000;
  const warnTime = attempt.remainingMs !== null && attempt.remainingMs <= 5 * 60_000;

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
              onClick={() => {
                autoSubmitted.current = false;
                attempt.start();
              }}
              className="mt-8 w-full rounded-lg bg-[#303869] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#252d56] md:w-auto"
            >
              Start Quiz
            </button>
          </div>
        ) : phase === "active" ? (
          <>
            <div
              className={cn(
                "sticky top-0 z-10 mb-4 flex items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm",
                lowTime
                  ? "border-red-200 bg-red-50 text-red-700"
                  : warnTime
                    ? "border-[#F5D97A] bg-[#FFF7CC] text-[#5C4B00]"
                    : "border-[#D3D2D366] bg-white text-[#474348]",
              )}
              role="timer"
              aria-live={lowTime ? "assertive" : "off"}
            >
              <span>
                {answeredCount} of {quiz.questions.length} answered
              </span>
              {attempt.remainingMs !== null ? (
                <span className="inline-flex items-center gap-2 font-semibold tabular-nums">
                  <Timer className="h-4 w-4" aria-hidden />
                  {attempt.isExpired ? "Time's up" : `${formatCountdown(attempt.remainingMs)} left`}
                </span>
              ) : null}
            </div>
            {submitError ? (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
                {attempt.isExpired && attempt.isActive ? (
                  <button type="button" onClick={() => void handleSubmit(true)} className="ml-2 font-semibold underline">
                    Retry
                  </button>
                ) : null}
              </div>
            ) : null}
            <QuizQuestionsPanel
              questions={quiz.questions}
              answers={answers}
              onSelectAnswer={attempt.setAnswer}
              onSubmit={() => void handleSubmit(false)}
              isSubmitting={isSubmitting}
              disabled={attempt.isExpired}
            />
          </>
        ) : (
          <div className="rounded-xl border border-[#D3D2D333] bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#111827]">
              {result?.isPassed ? "Quiz passed" : "Quiz completed"}
            </h3>
            {result?.timedOut ? (
              <p className="mt-2 text-sm text-[#6C686C]">
                Time ran out, so your quiz was submitted automatically with the answers you had chosen.
              </p>
            ) : null}
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

      {onSelectLesson && phase !== "active" ? (
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
