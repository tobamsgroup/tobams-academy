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
  email: "test@email.com",
  role: "LEARNER",
};

const mockEnrollments = [
  {
    id: "e1",
    courseId: "c1",
    lastAccessedAt: null,
    completedAt: null,

    course: {
      id: "c1",
      title: "Node Backend",
      thumbnail: "node.png",

      modules: [
        {
          lessons: [
            {
              id: "l1",
              duration: 10,
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
    id: "e2",
    courseId: "c2",
    lastAccessedAt: null,
    completedAt: null,

    course: {
      id: "c2",
      title: "React Course",
      thumbnail: "react.png",

      modules: [
        {
          lessons: [
            {
              id: "l3",
              duration: 20,
            },
          ],
        },
      ],
    },

    lessonProgress: [],
  },
];

const createRequest = (url = "http://localhost/api/v1/enrollments/me") => {
  return new NextRequest(url, {
    method: "GET",
  });
};

describe("GET /api/v1/enrollments/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns user enrollments with progress and pagination", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findMany.mockResolvedValue(mockEnrollments);

    const response = await GET(
      createRequest("http://localhost/api/v1/enrollments/me?page=1&limit=6"),
      {},
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(2);

    expect(body.data[0]).toEqual(
      expect.objectContaining({
        enrollmentId: "e1",
        courseId: "c1",
        courseTitle: "Node Backend",
        progress: 50,
      }),
    );

    expect(body.meta).toEqual({
      total: 2,
      page: 1,
      limit: 6,
      totalPages: 1,
    });

    expect(mockPrisma.enrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: "u1",
        },
        orderBy: {
          enrolledAt: "desc",
        },
      }),
    );
  });

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await GET(createRequest(), {});

    expect(response.status).toBe(401);
  });

  it("filters enrollments by course title search", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findMany.mockResolvedValue(mockEnrollments);

    const response = await GET(
      createRequest("http://localhost/api/v1/enrollments/me?search=node"),
      {},
    );

    const body = await response.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].courseTitle).toBe("Node Backend");
  });

  it("returns completed courses only", async () => {
    mockAuth.mockReturnValue(user);

    const completedEnrollments = [
      {
        ...mockEnrollments[0],

        lessonProgress: [
          {
            lessonId: "l1",
          },

          {
            lessonId: "l2",
          },
        ],
      },
    ];

    mockPrisma.enrollment.findMany.mockResolvedValue(completedEnrollments);

    const response = await GET(
      createRequest("http://localhost/api/v1/enrollments/me?tab=completed"),
      {},
    );

    const body = await response.json();
    expect(body.data[0].progress).toBe(100);
  });

  it("sorts enrollments by progress when sort is active", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findMany.mockResolvedValue(mockEnrollments);

    const response = await GET(
      createRequest("http://localhost/api/v1/enrollments/me?sort=active"),
      {},
    );

    const body = await response.json();
    expect(body.data[0].progress).toBeGreaterThanOrEqual(body.data[1].progress);
  });

  it("sorts enrollments alphabetically by course title", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.enrollment.findMany.mockResolvedValue(mockEnrollments);

    const response = await GET(
      createRequest("http://localhost/api/v1/enrollments/me?sort=az"),
      {},
    );

    const body = await response.json();
    expect(body.data[0].courseTitle).toBe("Node Backend");
  });
});
