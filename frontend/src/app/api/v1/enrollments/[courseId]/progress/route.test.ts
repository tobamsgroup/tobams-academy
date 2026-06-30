import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    enrollment: {
      findUnique: jest.fn(),
    },

    lesson: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  enrollment: {
    findUnique: jest.Mock;
  };

  lesson: {
    findMany: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  role: "LEARNER",
};

const createRequest = () => {
  return new NextRequest("http://localhost/api/v1/enrollments/c1/progress", {
    method: "GET",
  });
};

describe("GET /enrollments/[courseId]/progress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns course progress successfully", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findUnique.mockResolvedValue({
      id: "e1",

      lessonProgress: [
        {
          lessonId: "l1",
        },
      ],
    });

    mockPrisma.lesson.findMany.mockResolvedValue([
      {
        id: "l1",
      },

      {
        id: "l2",
      },

      {
        id: "l3",
      },
    ]);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
        }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      progress: 33,
      completedLessonIds: ["l1"],
    });
  });

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
        }),
      },
    );

    expect(response.status).toBe(401);
  });

  it("returns error when courseId is missing", async () => {
    mockAuth.mockReturnValue(user);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({}),
      },
    );

    expect(response.status).toBe(400);
  });

  it("returns 403 when user is not enrolled", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findUnique.mockResolvedValue(null);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
        }),
      },
    );

    expect(response.status).toBe(403);
  });

  it("returns zero progress when course has no lessons", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findUnique.mockResolvedValue({
      lessonProgress: [],
    });

    mockPrisma.lesson.findMany.mockResolvedValue([]);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
        }),
      },
    );

    const body = await response.json();

    expect(body.data.progress).toBe(0);
  });
});
