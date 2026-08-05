import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      findUnique: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  course: {
    findUnique: jest.Mock;
  };
  enrollment: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@email.com",
  role: "LEARNER",
};

const mockCourse = {
  id: "c1",
  status: "PUBLISHED",
  price: 0,
};

const mockEnrollment = {
  id: "e1",
  courseId: "c1",
  enrolledAt: new Date(),
};

const createRequest = (body?: object) => {
  return new NextRequest("http://localhost/api/v1/enrollments", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
};

describe("POST /api/v1/enrollments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("creates an enrollment successfully", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
    mockPrisma.enrollment.create.mockResolvedValue(mockEnrollment);
    const response = await POST(createRequest({ courseId: "c1" }), {});
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(mockPrisma.enrollment.create).toHaveBeenCalledWith({
      data: {
        userId: "u1",
        courseId: "c1",
        lastAccessedAt: expect.any(Date),
      },
    });
    expect(body.data.courseId).toBe("c1");
  });
  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await POST(createRequest({ courseId: "c1" }), {});

    expect(response.status).toBe(401);
  });
  it("returns error if courseId is missing", async () => {
    mockAuth.mockReturnValue(user);

    const response = await POST(createRequest({}), {});

    expect(response.status).toBe(400);
  });
  it("returns 404 if course is not found", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.course.findUnique.mockResolvedValue(null);
    const response = await POST(createRequest({ courseId: "c2" }), {});

    expect(response.status).toBe(404);
  });
  it("returns already enrolled response", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.course.findUnique.mockResolvedValue(mockCourse);
    mockPrisma.enrollment.findUnique.mockResolvedValue(mockEnrollment);

    const response = await POST(createRequest({ courseId: "c1" }), {});
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.message).toBe("Already enrolled");
    expect(mockPrisma.enrollment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "e1",
        },

        data: {
          lastAccessedAt: expect.any(Date),
        },
      }),
    );
  });
});
