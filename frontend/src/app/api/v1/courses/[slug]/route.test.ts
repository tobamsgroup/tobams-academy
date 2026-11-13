import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      findUnique: jest.fn(),
    },
  },
}));

const mockCourse = {
  id: "c1",

  title: "Node Course",

  slug: "node-course",

  category: {
    id: "cat1",
    name: "Backend",
  },

  instructor: {
    id: "u1",
    name: "John",
    email: "john@test.com",
  },

  modules: [
    {
      id: "m1",
      title: "Introduction",

      lessons: [
        {
          id: "l1",
          title: "Lesson 1",
        },
      ],
    },
  ],
};

const mockPrisma = prisma as unknown as {
  course: {
    findUnique: jest.Mock;
  };
};

const createRequest = () => {
  return new NextRequest("http://localhost/api/v1/courses/node-course", {
    method: "GET",
  });
};

describe("GET api/v1/courses/[slug]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns course details successfully", async () => {
    mockPrisma.course.findUnique.mockResolvedValue(mockCourse);

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

    expect(body.data.slug).toBe("node-course");

    expect(mockPrisma.course.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          slug: "node-course",
        },
      }),
    );
  });

  it("returns error when slug is missing", async () => {
    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({}),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.message).toBe("Slug is required");
  });

  it("returns 404 when course does not exist", async () => {
    mockPrisma.course.findUnique.mockResolvedValue(null);

    const response = await GET(
      createRequest(),

      {
        params: Promise.resolve({
          slug: "unknown-course",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.message).toBe("Course not found");
  });
});
