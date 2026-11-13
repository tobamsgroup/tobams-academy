import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    enrollment: { findMany: jest.fn() },
    courseModule: { findMany: jest.fn() },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  enrollment: { findMany: jest.Mock };
  courseModule: { findMany: jest.Mock };
};
const mockAuth = getAuthUser as jest.Mock;

const user = { id: "u1", email: "test@email.com", role: "LEARNER" };

const courseSummary = (id: string, title: string) => ({
  id,
  title,
  slug: title.toLowerCase().replace(/\s+/g, "-"),
  description: "",
  thumbnail: null,
  level: "BEGINNER",
  price: null,
  earlyBirdPrice: null,
  isFeatured: false,
  createdAt: new Date("2026-01-01"),
  category: { id: "cat", name: "Tech", slug: "tech" },
  instructor: { id: "i1", name: "Instructor" },
  _count: { modules: 1 },
});

const enrollment = (id: string, courseId: string, title: string, done: string[], lastAccessedAt: Date | null) => ({
  id,
  userId: "u1",
  courseId,
  enrolledAt: new Date("2026-11-01"),
  lastAccessedAt,
  completedAt: null,
  course: courseSummary(courseId, title),
  lessonProgress: done.map((lessonId) => ({ lessonId, completedAt: new Date() })),
});

const createRequest = (query = "") => new NextRequest(`http://localhost/api/v1/enrollments/me${query}`);

describe("GET /api/v1/enrollments/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockReturnValue(user);
    mockPrisma.enrollment.findMany.mockResolvedValue([
      enrollment("e1", "c1", "Node Backend", ["l1"], new Date("2026-11-10")),
      enrollment("e2", "c2", "React Course", [], new Date("2026-11-12")),
    ]);
    // c1 has 2 lessons (across two modules), c2 has 1
    mockPrisma.courseModule.findMany.mockResolvedValue([
      { courseId: "c1", _count: { lessons: 1 } },
      { courseId: "c1", _count: { lessons: 1 } },
      { courseId: "c2", _count: { lessons: 1 } },
    ]);
  });

  it("returns enrollment summaries with the course the dashboard renders", async () => {
    const response = await GET(createRequest(), {});
    const body = await response.json();

    expect(response.status).toBe(200);
    const node = body.data.find((e: { courseId: string }) => e.courseId === "c1");
    expect(node).toEqual(
      expect.objectContaining({
        id: "e1",
        courseId: "c1",
        progress: 50,
        course: expect.objectContaining({
          title: "Node Backend",
          slug: "node-backend",
          level: "BEGINNER",
          category: { id: "cat", name: "Tech", slug: "tech" },
        }),
      }),
    );
  });

  it("returns every enrollment by default, most recently studied first", async () => {
    const body = await (await GET(createRequest(), {})).json();

    expect(body.data.map((e: { courseId: string }) => e.courseId)).toEqual(["c2", "c1"]);
    expect(body.meta).toEqual({ total: 2, page: 1, limit: 100, totalPages: 1 });
  });

  it("paginates when page and limit are given", async () => {
    const body = await (await GET(createRequest("?page=2&limit=1"), {})).json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].courseId).toBe("c1");
    expect(body.meta).toEqual({ total: 2, page: 2, limit: 1, totalPages: 2 });
  });

  it("filters by course title search", async () => {
    const body = await (await GET(createRequest("?search=node"), {})).json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].course.title).toBe("Node Backend");
  });

  it("filters by tab", async () => {
    const inProgress = await (await GET(createRequest("?tab=inProgress"), {})).json();
    expect(inProgress.data).toHaveLength(2);

    const completed = await (await GET(createRequest("?tab=completed"), {})).json();
    expect(completed.data).toHaveLength(0);
  });

  it("sorts alphabetically and by progress", async () => {
    const az = await (await GET(createRequest("?sort=az"), {})).json();
    expect(az.data[0].course.title).toBe("Node Backend");

    const active = await (await GET(createRequest("?sort=active"), {})).json();
    expect(active.data[0].progress).toBe(50);
  });

  it("returns 401 without authentication", async () => {
    mockAuth.mockReturnValue(null);
    const response = await GET(createRequest(), {});
    expect(response.status).toBe(401);
  });
});
