-- Learners get three attempts at each quiz (previously two).
ALTER TABLE "quizzes" ALTER COLUMN "attemptsAllowed" SET DEFAULT 3;

UPDATE "quizzes" SET "attemptsAllowed" = 3 WHERE "attemptsAllowed" < 3;
