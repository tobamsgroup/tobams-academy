import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/with-auth";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      findUnique: jest.fn(),
    },

    enrollment: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const mockAuth = getAuthUser as jest.Mock;

const createRequest = () => {
  return new NextRequest("http://localhost/api/v1/courses/node-course/player", {
    method: "GET",
  });
};

const user = {
  id: "u1",

  email: "test@test.com",

  role: "LEARNER",
};

describe("GET /api/v1/courses/[slug]/player", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns player content for an authenticated and enrolled user", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.course.findUnique.mockResolvedValue({
      id: "c1",

      title: "Node Course",

      modules: [
        {
          id: "m1",

          title: "Introduction",

          position: 1,

          lessons: [
            {
              id: "l1",

              title: "Lesson 1",

              position: 1,
            },
          ],
        },
      ],
    });

    mockPrisma.enrollment.findUnique.mockResolvedValue({
      id: "e1",

      userId: "u1",

      courseId: "c1",
    });

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          slug: "node-course",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.courseId).toBe("c1");

    expect(body.data.modules).toHaveLength(1);

    expect(mockPrisma.course.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          slug: "node-course",

          status: "PUBLISHED",
        },
      }),
    );

    expect(mockPrisma.enrollment.findUnique).toHaveBeenCalled();
  });

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          slug: "node-course",
        }),
      },
    );

    expect(response.status).toBe(401);
  });

  it("returns error when slug is missing", async () => {
    mockAuth.mockReturnValue(user);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({}),
      },
    );

    expect(response.status).toBe(400);
  });

  it("returns 404 when course does not exist", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.course.findUnique.mockResolvedValue(null);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          slug: "unknown",
        }),
      },
    );

    expect(response.status).toBe(404);
  });

  it("returns 403 when user is not enrolled", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.course.findUnique.mockResolvedValue({
      id: "c1",

      title: "Node Course",

      modules: [],
    });

    mockPrisma.enrollment.findUnique.mockResolvedValue(null);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          slug: "node-course",
        }),
      },
    );

    expect(response.status).toBe(403);
  });
});
