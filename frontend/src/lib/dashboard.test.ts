import { getDashboardOverview, startOfUtcWeek } from "./dashboard";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    enrollment: { findMany: jest.fn() },
    learningActivity: { groupBy: jest.fn(), findMany: jest.fn() },
  },
}));

const mockPrisma = prisma as unknown as {
  enrollment: { findMany: jest.Mock };
  learningActivity: { groupBy: jest.Mock; findMany: jest.Mock };
};

const course = (id: string, lessonIds: string[]) => ({
  id,
  title: `Course ${id}`,
  slug: `course-${id}`,
  modules: [
    { position: 1, title: "Week 1", lessons: lessonIds.slice(0, 2).map((l) => ({ id: l, title: `Lesson ${l}` })) },
    { position: 2, title: "Week 2", lessons: lessonIds.slice(2).map((l) => ({ id: l, title: `Lesson ${l}` })) },
  ],
});

describe("startOfUtcWeek", () => {
  it("returns Monday 00:00 UTC", () => {
    // Friday 13 Nov 2026 → Monday 9 Nov 2026
    expect(startOfUtcWeek(new Date("2026-11-13T15:30:00Z")).toISOString()).toBe("2026-11-09T00:00:00.000Z");
    // A Sunday belongs to the week that started the previous Monday
    expect(startOfUtcWeek(new Date("2026-11-15T23:00:00Z")).toISOString()).toBe("2026-11-09T00:00:00.000Z");
    expect(startOfUtcWeek(new Date("2026-11-09T00:00:00Z")).toISOString()).toBe("2026-11-09T00:00:00.000Z");
  });
});

describe("getDashboardOverview", () => {
  const now = new Date("2026-11-13T12:00:00Z");

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.enrollment.findMany.mockResolvedValue([
      {
        enrolledAt: new Date("2026-11-01"),
        lastAccessedAt: new Date("2026-11-12"),
        completedAt: null,
        lessonProgress: [{ lessonId: "a1" }, { lessonId: "a2" }],
        course: course("a", ["a1", "a2", "a3", "a4"]),
      },
      {
        enrolledAt: new Date("2026-10-01"),
        lastAccessedAt: null,
        completedAt: new Date("2026-10-20"),
        lessonProgress: [{ lessonId: "b1" }],
        course: course("b", ["b1"]),
      },
    ]);
    mockPrisma.learningActivity.groupBy.mockResolvedValue([
      { courseId: "a", _sum: { seconds: 5400 } },
      { courseId: "b", _sum: { seconds: 600 } },
    ]);
    // First call: last two weeks. Second call: this year.
    mockPrisma.learningActivity.findMany
      .mockResolvedValueOnce([
        { day: new Date("2026-11-10T00:00:00Z"), seconds: 1200 }, // this week
        { day: new Date("2026-11-13T00:00:00Z"), seconds: 600 }, // this week
        { day: new Date("2026-11-04T00:00:00Z"), seconds: 900 }, // last week
      ])
      .mockResolvedValueOnce([
        { day: new Date("2026-10-15T00:00:00Z"), seconds: 600 },
        { day: new Date("2026-11-10T00:00:00Z"), seconds: 1200 },
        { day: new Date("2026-11-13T00:00:00Z"), seconds: 600 },
      ]);
  });

  it("builds continue-learning cards for unfinished courses with the next lesson", async () => {
    const overview = await getDashboardOverview("u1", now);

    expect(overview.continueLearning).toHaveLength(1);
    expect(overview.continueLearning[0]).toMatchObject({
      courseId: "a",
      progress: 50,
      timeSpentSeconds: 5400,
      nextLesson: { id: "a3", moduleNumber: 2 },
    });
  });

  it("computes insights from real data", async () => {
    const { insights } = await getDashboardOverview("u1", now);

    expect(insights).toEqual({
      thisWeekSeconds: 1800,
      lastWeekSeconds: 900,
      totalSeconds: 6000,
      coursesInProgress: 1,
      coursesEnrolled: 2,
      coursesCompleted: 1,
    });
  });

  it("totals learning time per month for the current year", async () => {
    const { engagement } = await getDashboardOverview("u1", now);

    expect(engagement.year).toBe(2026);
    expect(engagement.monthlySeconds[9]).toBe(600); // October
    expect(engagement.monthlySeconds[10]).toBe(1800); // November
    expect(engagement.monthlySeconds.reduce((a, b) => a + b, 0)).toBe(2400);
  });
});
