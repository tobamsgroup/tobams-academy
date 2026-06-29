import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const createRequest = (url: string) => {
  return new NextRequest(url, {
    method: "GET",
  });
};

describe("GET /api/v1/courses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns published paginated courses", async () => {
    mockPrisma.course.findMany.mockResolvedValue([
      {
        id: "c1",
        title: "Node Course",
      },
    ]);

    mockPrisma.course.count.mockResolvedValue(1);

    const response = await GET(
      createRequest("http://localhost/api/v1/courses?page=1&limit=10"),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toHaveLength(1);

    expect(body.meta).toEqual({
      total: 1,

      page: 1,

      limit: 10,

      totalPages: 1,
    });

    expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: "PUBLISHED",
        },

        skip: 0,

        take: 10,
      }),
    );
  });

  it("returns paginated courses filtered by category", async () => {
    mockPrisma.course.findMany.mockResolvedValue([
      {
        id: "c1",
        title: "Node Course",
        category: {
          id: "cat1",
          name: "Backend",
        },
      },
    ]);

    mockPrisma.course.count.mockResolvedValue(1);

    const response = await GET(
      createRequest(
        "http://localhost/api/v1/courses?page=2&limit=10&categoryId=cat1",
      ),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toHaveLength(1);

    expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: "PUBLISHED",

          categoryId: "cat1",
        },

        skip: 10,

        take: 10,
      }),
    );
  });

  it("returns paginated courses filtered by search", async () => {
    mockPrisma.course.findMany.mockResolvedValue([
      {
        id: "c1",
        title: "Node.js Backend Course",
        description: "Learn Node backend development",
      },
    ]);

    mockPrisma.course.count.mockResolvedValue(1);

    const response = await GET(
      createRequest(
        "http://localhost/api/v1/courses?search=node&page=1&limit=10",
      ),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toHaveLength(1);

    expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: "PUBLISHED",

          OR: [
            {
              title: {
                contains: "node",
                mode: "insensitive",
              },
            },

            {
              description: {
                contains: "node",
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    );
  });

  it("filters courses by category and search together", async () => {
    mockPrisma.course.findMany.mockResolvedValue([
      {
        id: "c1",
        title: "Node Backend Course",
      },
    ]);

    mockPrisma.course.count.mockResolvedValue(1);

    const response = await GET(
      createRequest(
        "http://localhost/api/v1/courses?categoryId=cat1&search=node",
      ),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toHaveLength(1);

    expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: "PUBLISHED",

          categoryId: "cat1",

          OR: expect.any(Array),
        },
      }),
    );
  });

  it("limits maximum limit to 50", async () => {
    mockPrisma.course.findMany.mockResolvedValue([]);

    mockPrisma.course.count.mockResolvedValue(0);

    await GET(createRequest("http://localhost/api/v1/courses?limit=100"));

    expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 50,
      }),
    );
  });
});
