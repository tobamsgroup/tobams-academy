import { GET, DELETE } from "./route";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/with-auth";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    payment: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  payment: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    delete: jest.Mock;
  };
};
const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  role: "LEARNER",
};

const createRequest = () =>
  new NextRequest("http://localhost/api/v1/payments/p1");

describe("GET /payments/[paymentId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await GET(createRequest(), {
      params: Promise.resolve({
        paymentId: "p1",
      }),
    });

    expect(response.status).toBe(401);
  });

  it("returns payment details successfully", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.payment.findUnique.mockResolvedValue({
      id: "p1",
      userId: "u1",
      courseId: "c1",

      amount: 0,
      status: "COMPLETED",
      createdAt: new Date(),

      course: {
        title: "Node Course",

        price: 0,

        instructor: {
          name: "John",
        },

        modules: [
          {
            lessons: [
              {
                duration: 20,
              },
            ],
          },
        ],
      },
    });

    const response = await GET(createRequest(), {
      params: Promise.resolve({
        paymentId: "p1",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.courseDetails.duration).toBe(20);
  });

  it("returns 404 if payment does not exist", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.payment.findUnique.mockResolvedValue(null);

    const response = await GET(createRequest(), {
      params: Promise.resolve({
        paymentId: "p1",
      }),
    });

    expect(response.status).toBe(404);
  });

  it("returns 404 if payment belongs to another user", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.payment.findUnique.mockResolvedValue({
      id: "p1",
      userId: "different-user",

      course: {
        modules: [],
        instructor: {
          name: "John",
        },
      },
    });

    const response = await GET(createRequest(), {
      params: Promise.resolve({
        paymentId: "p1",
      }),
    });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /payments/[paymentId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await DELETE(createRequest(), {
      params: Promise.resolve({
        paymentId: "p1",
      }),
    });

    expect(response.status).toBe(401);
  });

  it("deletes payment successfully", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.payment.findFirst.mockResolvedValue({
      id: "p1",
      userId: "u1",
    });

    mockPrisma.payment.delete.mockResolvedValue({});

    const response = await DELETE(createRequest(), {
      params: Promise.resolve({
        paymentId: "p1",
      }),
    });

    expect(response.status).toBe(200);

    expect(mockPrisma.payment.delete).toHaveBeenCalledWith({
      where: {
        id: "p1",
      },
    });
  });

  it("returns 404 if payment does not exist", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.payment.findFirst.mockResolvedValue(null);

    const response = await DELETE(createRequest(), {
      params: Promise.resolve({
        paymentId: "p1",
      }),
    });

    expect(response.status).toBe(404);

    expect(mockPrisma.payment.delete).not.toHaveBeenCalled();
  });
});
