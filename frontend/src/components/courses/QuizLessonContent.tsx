"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Timer, XCircle } from "lucide-react";
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
  /** Called after an attempt is graded (passing can unlock the next week). */
  onAttempted?: () => void;
};

function formatAttemptDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

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
  onAttempted,
}: QuizLessonContentProps) {
  const { quiz, error, isLoading, submitAttempt, mutate: refreshQuiz } = useQuiz(lessonId);
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
  const noAttemptsLeft = quiz ? quiz.attemptsRemaining <= 0 : false;

  // An attempt saved in this browser can't be submitted once every attempt has been used
  // (e.g. finished in another tab): drop it rather than let the learner answer for nothing.
  useEffect(() => {
    if (noAttemptsLeft && attempt.isActive && !isSubmitting && !result) attempt.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noAttemptsLeft, attempt.isActive, isSubmitting, result]);

  const metaItems = useMemo(() => {
    if (!quiz) return [];
    return [
      { label: "Total Questions", value: String(quiz.totalQuestions) },
      { label: "Time Limit", value: formatQuizTimeLimit(quiz.timeLimit) },
      { label: "Question Type", value: quiz.questionType },
      { label: "Passing Score", value: `${quiz.passingScore}%` },
      { label: "Attempts Allowed", value: String(quiz.attemptsAllowed) },
      { label: "Attempts Used", value: `${quiz.attempts.length} of ${quiz.attemptsAllowed}` },
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
      await refreshQuiz();
      onAttempted?.();
    } catch (e) {
      const status = axios.isAxiosError(e) ? e.response?.status : undefined;
      if (status === 429) {
        // No attempts left: this attempt can't be recorded, so drop it.
        attempt.clear();
        setSubmitError(`You have used all ${quiz.attemptsAllowed} attempts for this quiz.`);
        void refreshQuiz();
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

            {quiz.attempts.length > 0 ? (
              <div className="mt-8 rounded-lg border border-[#D3D2D366] bg-[#FAFBFC] p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-semibold text-[#111827]">Your previous attempts</h4>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      quiz.hasPassed ? "bg-[#E7F6EC] text-[#0F7B3F]" : "bg-[#FDECEC] text-[#B42318]",
                    )}
                  >
                    {quiz.hasPassed ? "Passed" : "Not passed yet"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#474348]">
                  Best score: <span className="font-semibold text-[#111827]">{quiz.bestScore ?? 0}%</span>
                </p>
                <ul className="mt-3 divide-y divide-[#EEF0F6]">
                  {quiz.attempts.map((a, i) => (
                    <li key={a.completedAt} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="inline-flex items-center gap-2 text-[#474348]">
                        {a.isPassed ? (
                          <CheckCircle2 className="h-4 w-4 text-[#0F7B3F]" aria-label="Passed" />
                        ) : (
                          <XCircle className="h-4 w-4 text-[#B42318]" aria-label="Not passed" />
                        )}
                        Attempt {i + 1} · {formatAttemptDate(a.completedAt)}
                      </span>
                      <span className="font-semibold tabular-nums text-[#111827]">{a.score}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {submitError ? (
              <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
            ) : null}

            {noAttemptsLeft ? (
              <p className="mt-6 rounded-lg bg-[#F3F4F6] px-4 py-3 text-sm text-[#474348]">
                You have used all {quiz.attemptsAllowed} attempts for this quiz.
                {quiz.hasPassed ? null : (
                  <>
                    {" "}To request another attempt, email{" "}
                    <a href="mailto:theteam@tobamsgroup.com" className="font-medium text-[#303869] underline">
                      theteam@tobamsgroup.com
                    </a>
                    .
                  </>
                )}
              </p>
            ) : (
              <>
                <p className="mt-6 text-base text-[#111827]">Ensure you have a stable internet connection.</p>
                {quiz.attempts.length > 0 ? (
                  <p className="mt-2 text-sm text-[#6C686C]">
                    {quiz.attemptsRemaining === 1
                      ? "This is your last attempt."
                      : `You have ${quiz.attemptsRemaining} attempts left.`}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    autoSubmitted.current = false;
                    setSubmitError(null);
                    attempt.start();
                  }}
                  className="mt-8 w-full rounded-lg bg-[#303869] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#252d56] md:w-auto"
                >
                  {quiz.attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
                </button>
              </>
            )}
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
            {quiz ? (
              <p className="mt-2 text-sm text-[#6C686C]">
                {quiz.attemptsRemaining > 0
                  ? `Attempts left: ${quiz.attemptsRemaining} of ${quiz.attemptsAllowed}.`
                  : `You have used all ${quiz.attemptsAllowed} attempts.`}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setResult(null)}
              className="mt-6 mr-3 rounded-lg border border-[#303869] px-6 py-3 text-sm font-medium text-[#303869] transition hover:bg-[#F0F4F8]"
            >
              {!result?.isPassed && quiz && quiz.attemptsRemaining > 0 ? "Try Again" : "View Attempts"}
            </button>
            {!result?.isPassed && onMarkComplete ? (
              <button
                type="button"
                onClick={onMarkComplete}
                disabled={isCompleted || isMarkingComplete}
                className="mt-6 rounded-lg bg-[#303869] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#252d56] disabled:cursor-default disabled:opacity-60"
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
