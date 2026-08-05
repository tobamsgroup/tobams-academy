import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    enrollment: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },

    lesson: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },

    lessonProgress: {
      upsert: jest.fn(),
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
    update: jest.Mock;
  };

  lesson: {
    findFirst: jest.Mock;
    findMany: jest.Mock;
  };

  lessonProgress: {
    upsert: jest.Mock;
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
  return new NextRequest(
    "http://localhost/api/v1/enrollments/c1/lessons/l1/complete",
    {
      method: "POST",
    },
  );
};

describe("POST /enrollments/[courseId]/lessons/[lessonId]/complete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("completes lesson successfully and returns progress", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findUnique.mockResolvedValue({
      id: "e1",
      completedAt: null,
    });

    mockPrisma.lesson.findFirst.mockResolvedValue({
      id: "l1",
    });

    mockPrisma.lessonProgress.findMany.mockResolvedValue([
      {
        lessonId: "l1",
      },
    ]);

    mockPrisma.lesson.findMany.mockResolvedValue([
      {
        id: "l1",
      },

      {
        id: "l2",
      },
    ]);

    const response = await POST(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
          lessonId: "l1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      progress: 50,

      completedLessonIds: ["l1"],
    });

    expect(mockPrisma.lessonProgress.upsert).toHaveBeenCalledWith({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: "e1",

          lessonId: "l1",
        },
      },

      update: {},

      create: {
        enrollmentId: "e1",

        lessonId: "l1",
      },
    });
  });

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await POST(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
          lessonId: "l1",
        }),
      },
    );

    expect(response.status).toBe(401);
  });

  it("returns error when courseId or lessonId is missing", async () => {
    mockAuth.mockReturnValue(user);

    const response = await POST(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
        }),
      },
    );

    expect(response.status).toBe(400);
  });

  it("returns 403 when user is not enrolled", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findUnique.mockResolvedValue(null);

    const response = await POST(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
          lessonId: "l1",
        }),
      },
    );

    expect(response.status).toBe(403);
  });

  it("returns 404 when lesson does not belong to course", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findUnique.mockResolvedValue({
      id: "e1",
    });

    mockPrisma.lesson.findFirst.mockResolvedValue(null);

    const response = await POST(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
          lessonId: "l9",
        }),
      },
    );

    expect(response.status).toBe(404);
  });

  it("marks enrollment completed when progress reaches 100%", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findUnique.mockResolvedValue({
      id: "e1",

      completedAt: null,
    });

    mockPrisma.lesson.findFirst.mockResolvedValue({
      id: "l1",
    });

    mockPrisma.lesson.findMany.mockResolvedValue([
      {
        id: "l1",
      },
    ]);

    mockPrisma.lessonProgress.findMany.mockResolvedValue([
      {
        lessonId: "l1",
      },
    ]);

    const response = await POST(
      createRequest(),

      {
        params: Promise.resolve({
          courseId: "c1",
          lessonId: "l1",
        }),
      },
    );

    expect(response.status).toBe(200);

    expect(mockPrisma.enrollment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          completedAt: expect.any(Date),
        },
      }),
    );
  });
});
