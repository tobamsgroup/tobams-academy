import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      findMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  course: {
    findMany: jest.Mock;
  };
};

const createRequest = () => {
  return new NextRequest("http://localhost/api/v1/courses/featured", {
    method: "GET",
  });
};

describe("GET /api/v1/courses/featured", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns featured courses successfully with correct limit", async () => {
    mockPrisma.course.findMany.mockResolvedValue([
      {
        id: "c1",
        title: "Nest Course",
        isFeatured: true,
        status: "PUBLISHED",
      },

      {
        id: "c2",
        title: "Next Course",
        isFeatured: true,
        status: "PUBLISHED",
      },
    ]);

    const response = await GET(createRequest(), {});

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toHaveLength(2);

    expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isFeatured: true,
          status: "PUBLISHED",
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 6,
      }),
    );
  });

  it("returns empty array when no featured courses exist", async () => {
    mockPrisma.course.findMany.mockResolvedValue([]);

    const response = await GET(createRequest(), {});

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual([]);
  });
});
