import { POST, GET } from "./route";
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
      update: jest.fn(),
    },

    payment: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },

    $transaction: jest.fn(),
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
    update: jest.Mock;
  };
  payment: {
    create: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
  };
  $transaction: jest.Mock;
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  role: "LEARNER",
};

const mockCourse = {
  id: "c1",
  status: "PUBLISHED",
  price: 0,
};

const createRequest = (
  method: string,
  body?: object,
  url = "http://localhost/api/v1/payments",
) =>
  new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

describe("POST /api/v1/payments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 if user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await POST(
      createRequest("POST", {
        courseId: "c1",
      }),
      {},
    );

    expect(response.status).toBe(401);
  });

  it("returns error if courseId is missing", async () => {
    mockAuth.mockReturnValue(user);

    const response = await POST(createRequest("POST", {}), {});

    expect(response.status).toBe(400);
  });

  it("creates payment successfully", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.course.findUnique.mockResolvedValue(mockCourse);

    mockPrisma.enrollment.findUnique.mockResolvedValue(null);

    mockPrisma.$transaction.mockImplementation(async (callback) =>
      callback({
        payment: {
          create: jest.fn().mockResolvedValue({
            id: "p1",
            status: "COMPLETED",
            reference: "FREE-123",
            transactionId: null,
          }),
        },

        enrollment: {
          create: jest.fn().mockResolvedValue({
            id: "e1",
            courseId: "c1",
          }),
        },
      }),
    );

    const response = await POST(
      createRequest("POST", {
        courseId: "c1",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data.courseId).toBe("c1");

    expect(body.data.paymentId).toBe("p1");
  });

  it("returns 404 if course does not exist", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.course.findUnique.mockResolvedValue(null);

    const response = await POST(
      createRequest("POST", {
        courseId: "c2",
      }),
      {},
    );

    expect(response.status).toBe(404);
  });

  it("returns already enrolled response", async () => {
    mockAuth.mockReturnValue(user);

    mockPrisma.course.findUnique.mockResolvedValue(mockCourse);

    mockPrisma.enrollment.findUnique.mockResolvedValue({
      id: "e1",
      courseId: "c1",
      enrolledAt: new Date(),
    });

    const response = await POST(
      createRequest("POST", {
        courseId: "c1",
      }),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.message).toBe("Already enrolled");
  });
});

describe("GET /api/v1/payments", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockAuth.mockReturnValue(user);
  });

  it("returns paginated payments", async () => {
    mockPrisma.payment.findMany.mockResolvedValue([
      {
        id: "p1",
        amount: 0,
      },
    ]);

    mockPrisma.payment.count.mockResolvedValue(1);

    const response = await GET(
      createRequest(
        "GET",
        undefined,
        "http://localhost/api/v1/payments?page=1&limit=10",
      ),
      {},
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.meta.total).toBe(1);

    expect(mockPrisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
      }),
    );
  });

  it("filters by status", async () => {
    mockPrisma.payment.findMany.mockResolvedValue([]);

    mockPrisma.payment.count.mockResolvedValue(0);

    await GET(
      createRequest(
        "GET",
        undefined,
        "http://localhost/api/v1/payments?status=COMPLETED",
      ),
      {},
    );

    expect(mockPrisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "COMPLETED",
        }),
      }),
    );
  });

  it("returns 401 without auth", async () => {
    mockAuth.mockReturnValue(null);

    const response = await GET(createRequest("GET"), {});

    expect(response.status).toBe(401);
  });
});
