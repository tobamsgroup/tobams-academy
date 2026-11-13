import { getLearningProgress, gradeLabel } from "./learning-progress";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    enrollment: { findMany: jest.fn() },
    quizAttempt: { findMany: jest.fn() },
  },
}));

const mockPrisma = prisma as unknown as {
  enrollment: { findMany: jest.Mock };
  quizAttempt: { findMany: jest.Mock };
};

const lesson = (id: string, quiz?: { id: string }) => ({
  id,
  title: `Lesson ${id}`,
  quiz: quiz ? { ...quiz, passingScore: 70, attemptsAllowed: 2 } : null,
});

const enrollment = {
  enrolledAt: new Date("2026-01-01"),
  lastAccessedAt: new Date("2026-01-05"),
  completedAt: null,
  lessonProgress: [{ lessonId: "l1" }, { lessonId: "l2" }, { lessonId: "l3" }],
  course: {
    id: "c1",
    title: "Node Course",
    slug: "node-course",
    modules: [
      { id: "m1", title: "Basics", lessons: [lesson("l1"), lesson("l2", { id: "q1" })] },
      { id: "m2", title: "Advanced", lessons: [lesson("l3"), lesson("l4", { id: "q2" })] },
      { id: "m3", title: "Extra", lessons: [lesson("l5")] },
    ],
  },
};

describe("gradeLabel", () => {
  it.each([
    [95, "A"],
    [80, "B"],
    [75, "C"],
    [60, "D"],
    [10, "F"],
  ])("%i → %s", (score, grade) => expect(gradeLabel(score)).toBe(grade));
});

describe("getLearningProgress", () => {
  beforeEach(() => jest.clearAllMocks());

  it("computes lesson, module and quiz progress from real records", async () => {
    mockPrisma.enrollment.findMany.mockResolvedValue([enrollment]);
    mockPrisma.quizAttempt.findMany.mockResolvedValue([
      { quizId: "q1", score: 60, isPassed: false },
      { quizId: "q1", score: 90, isPassed: true },
    ]);

    const [course] = await getLearningProgress("u1");

    expect(course).toMatchObject({
      courseId: "c1",
      progress: 60, // 3 of 5 lessons
      lessonsCompleted: 3,
      totalLessons: 5,
      modulesCompleted: 1,
      totalModules: 3,
      quizzesTaken: 1,
      totalQuizzes: 2,
      averageScore: 90, // best attempt counts
      grade: "A",
    });
    expect(course.modules.map((m) => m.status)).toEqual(["Completed", "In Progress", "Not Started"]);
    expect(course.quizzes[0]).toMatchObject({ bestScore: 90, passed: true, attempts: 2 });
    expect(course.quizzes[1]).toMatchObject({ bestScore: null, passed: false, attempts: 0 });
  });

  it("reports no grade when no quiz has been taken", async () => {
    mockPrisma.enrollment.findMany.mockResolvedValue([{ ...enrollment, lessonProgress: [] }]);
    mockPrisma.quizAttempt.findMany.mockResolvedValue([]);

    const [course] = await getLearningProgress("u1");

    expect(course.progress).toBe(0);
    expect(course.averageScore).toBeNull();
    expect(course.grade).toBeNull();
  });
});
