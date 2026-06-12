-- CreateEnum
CREATE TYPE "LessonKind" AS ENUM ('VIDEO', 'DOC', 'PDF', 'SCREEN', 'QUIZ', 'ASSESSMENT');

-- AlterTable: extend Lesson with kind, contentUrl, contentKey
ALTER TABLE "lessons"
  ADD COLUMN "kind"       "LessonKind" NOT NULL DEFAULT 'VIDEO',
  ADD COLUMN "contentUrl" TEXT,
  ADD COLUMN "contentKey" TEXT;

-- CreateTable: enrollments
CREATE TABLE "enrollments" (
    "id"             TEXT NOT NULL,
    "userId"         TEXT NOT NULL,
    "courseId"       TEXT NOT NULL,
    "enrolledAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt"    TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "enrollments_userId_idx" ON "enrollments"("userId");
CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON "enrollments"("userId", "courseId");

ALTER TABLE "enrollments"
  ADD CONSTRAINT "enrollments_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "enrollments_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: lesson_progress
CREATE TABLE "lesson_progress" (
    "id"           TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "lessonId"     TEXT NOT NULL,
    "completedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lesson_progress_enrollmentId_idx" ON "lesson_progress"("enrollmentId");
CREATE UNIQUE INDEX "lesson_progress_enrollmentId_lessonId_key"
  ON "lesson_progress"("enrollmentId", "lessonId");

ALTER TABLE "lesson_progress"
  ADD CONSTRAINT "lesson_progress_enrollmentId_fkey"
    FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "lesson_progress_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: quizzes
CREATE TABLE "quizzes" (
    "id"              TEXT NOT NULL,
    "lessonId"        TEXT NOT NULL,
    "timeLimit"       INTEGER NOT NULL,
    "passingScore"    INTEGER NOT NULL,
    "attemptsAllowed" INTEGER NOT NULL DEFAULT 2,
    "questionType"    TEXT NOT NULL DEFAULT 'Multiple Choice',
    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "quizzes_lessonId_key" ON "quizzes"("lessonId");

ALTER TABLE "quizzes"
  ADD CONSTRAINT "quizzes_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: quiz_questions
CREATE TABLE "quiz_questions" (
    "id"       TEXT NOT NULL,
    "quizId"   TEXT NOT NULL,
    "text"     TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "quiz_questions_quizId_idx" ON "quiz_questions"("quizId");

ALTER TABLE "quiz_questions"
  ADD CONSTRAINT "quiz_questions_quizId_fkey"
    FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: quiz_options
CREATE TABLE "quiz_options" (
    "id"         TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text"       TEXT NOT NULL,
    "isCorrect"  BOOLEAN NOT NULL DEFAULT false,
    "position"   INTEGER NOT NULL,
    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "quiz_options_questionId_idx" ON "quiz_options"("questionId");

ALTER TABLE "quiz_options"
  ADD CONSTRAINT "quiz_options_questionId_fkey"
    FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: quiz_attempts
CREATE TABLE "quiz_attempts" (
    "id"          TEXT NOT NULL,
    "quizId"      TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "score"       INTEGER NOT NULL,
    "isPassed"    BOOLEAN NOT NULL,
    "answers"     JSONB NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "quiz_attempts_quizId_userId_idx" ON "quiz_attempts"("quizId", "userId");

ALTER TABLE "quiz_attempts"
  ADD CONSTRAINT "quiz_attempts_quizId_fkey"
    FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "quiz_attempts_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
