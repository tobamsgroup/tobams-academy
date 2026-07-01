import { PATCH } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/with-auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    notification: {
      updateMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/with-auth", () => ({
  getAuthUser: jest.fn(),
}));

const mockPrisma = prisma as unknown as {
  notification: {
    updateMany: jest.Mock;
  };
};

const mockAuth = getAuthUser as jest.Mock;

const user = {
  id: "u1",
  email: "test@test.com",
  role: "LEARNER",
};

const createRequest = () => {
  return new NextRequest(
    "http://localhost/api/v1/notifications/mark-all-read",
    {
      method: "PATCH",
    },
  );
};

describe("PATCH /api/v1/notifications/mark-all-read", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should mark all notifications as read for the authenticated user", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 3 });

    const response = await PATCH(createRequest(), {});
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.updated).toBe(3);
    expect(body.message).toBe("3 notifications marked as read");
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
      where: {
        userId: "u1",
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  });

  it("should return 401 if the user is not authenticated", async () => {
    mockAuth.mockReturnValue(null);

    const response = await PATCH(createRequest(), {});
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Unauthorized");
  });

  it("should return 200 with 0 updated if there are no unread notifications", async () => {
    mockAuth.mockReturnValue(user);
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 0 });

    const response = await PATCH(createRequest(), {});
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.updated).toBe(0);
    expect(body.message).toBe("0 notifications marked as read");
  });
});
