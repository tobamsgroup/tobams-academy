import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    enrollment: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  enrollment: {
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
  return new NextRequest("http://localhost/api/v1/enrollments/me/stats", {
    method: "GET",
  });
};

describe("GET /enrollments/me/stats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns learning statistics successfully", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findMany.mockResolvedValue([
      {
        course: {
          modules: [
            {
              lessons: [
                {
                  id: "l1",
                  duration: 30,
                },
                {
                  id: "l2",
                  duration: 20,
                },
              ],
            },
          ],
        },

        lessonProgress: [
          {
            lessonId: "l1",
          },
        ],
      },

      {
        course: {
          modules: [
            {
              lessons: [
                {
                  id: "l3",
                  duration: 40,
                },
              ],
            },
          ],
        },

        lessonProgress: [
          {
            lessonId: "l3",
          },
        ],
      },
    ]);

    const response = await GET(createRequest(), {});
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual({
      coursesInProgress: 1,
      totalLearningMinutes: 70,
      averageProgress: 75,
    });
  });

  it("returns 401 without authentication", async () => {
    mockAuth.mockReturnValue(null);
    const response = await GET(createRequest(), {});
    expect(response.status).toBe(401);
  });

  it("returns zero stats when user has no enrollments", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.enrollment.findMany.mockResolvedValue([]);

    const response = await GET(createRequest(), {});
    const body = await response.json();

    expect(body.data).toEqual({
      coursesInProgress: 0,
      totalLearningMinutes: 0,
      averageProgress: 0,
    });
  });
});
