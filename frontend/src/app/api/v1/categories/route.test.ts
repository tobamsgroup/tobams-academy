import { GET } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  category: {
    findMany: jest.Mock;
  };
};

const createRequest = () =>
  new NextRequest("http://localhost/api/v1/categories", {
    method: "GET",
  });

describe("GET /api/v1/categories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns categories sorted by name", async () => {
    mockPrisma.category.findMany.mockResolvedValue([
      {
        id: "cat1",
        name: "Backend",
      },

      {
        id: "cat2",
        name: "Frontend",
      },
    ]);

    const response = await GET(createRequest(), {});

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toHaveLength(2);

    expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
      orderBy: {
        name: "asc",
      },
    });
  });

  it("returns empty array when no categories exist", async () => {
    mockPrisma.category.findMany.mockResolvedValue([]);

    const response = await GET(createRequest(), {});

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual([]);
  });
});
